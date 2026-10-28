import { Router, Response } from 'express';
import { DatabaseStore } from '../../config/database';
import { CryptoService } from '../../security/crypto.service';
import { AadhaarDataVaultService } from '../../security/adv.service';
import { AuditService } from '../../security/audit.service';
import { authenticate, AuthenticatedRequest, extractClientIp } from '../auth/auth.middleware';
import QRCode from 'qrcode';

const router = Router();

/**
 * GET /api/v1/students/:apaarId
 * Fetch student profile with DPDP Act compliance (Field-level decryption only when permitted)
 */
router.get('/:apaarId', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const apaarId = String(req.params.apaarId);
  const clientIp = extractClientIp(req);
  const student = DatabaseStore.students.get(apaarId);

  if (!student) {
    return res.status(404).json({ error: 'STUDENT_NOT_FOUND', message: 'Student APAAR record not found.' });
  }

  const isSelf = req.user?.sub === apaarId;
  const isEnrolledCollege = req.user?.role === 'INSTITUTION_NODAL' && req.user.aisheCode === student.currentAisheCode;
  const isAdmin = req.user?.role === 'AICTE_SUPERADMIN';

  // DPDP Act 2023: Full PII decryption only allowed for the student, their current college, or superadmin
  const canViewFullPii = isSelf || isEnrolledCollege || isAdmin;

  const institution = DatabaseStore.institutions.get(student.currentAisheCode);

  AuditService.logSecurityEvent({
    actorId: req.user?.sub || 'UNKNOWN',
    actorRole: (req.user?.role as any) || 'STUDENT',
    actorIp: clientIp,
    actionType: 'READ',
    entityType: 'STUDENT',
    entityId: apaarId,
    details: { fullPiiAllowed: canViewFullPii }
  });

  return res.json({
    success: true,
    data: {
      apaarId: student.apaarId,
      fullName: canViewFullPii ? CryptoService.decryptField(student.fullNameEncrypted) : student.fullNameMasked,
      dob: canViewFullPii ? CryptoService.decryptField(student.dobEncrypted) : student.dobMasked,
      gender: student.gender,
      mobile: canViewFullPii ? CryptoService.decryptField(student.mobileEncrypted) : student.mobileMasked,
      email: canViewFullPii ? CryptoService.decryptField(student.emailEncrypted) : student.emailMasked,
      currentAisheCode: student.currentAisheCode,
      institutionName: institution?.name || 'AICTE Approved Institution',
      enrollmentStatus: student.enrollmentStatus,
      abcAccountId: student.abcAccountId,
      isMinor: student.isMinor,
      parentalConsentVerified: student.parentalConsentVerified,
      piiEncryptedAtRest: true
    }
  });
});

/**
 * GET /api/v1/students/:apaarId/timeline
 * Unified academic journey across AICTE institutions
 */
router.get('/:apaarId/timeline', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const apaarId = String(req.params.apaarId);
  const records: any[] = [];

  for (const [_, record] of DatabaseStore.academicRecords.entries()) {
    if (record.apaarId === apaarId) {
      const inst = DatabaseStore.institutions.get(record.aisheCode);
      records.push({
        recordId: record.recordId,
        semester: record.semester,
        academicYear: record.academicYear,
        programName: record.programName,
        institutionName: inst?.name || record.aisheCode,
        aisheCode: record.aisheCode,
        sgpa: record.sgpaMasked,
        cgpa: record.cgpaMasked,
        creditsEarned: record.creditsEarned,
        totalCreditsAccumulated: record.totalCreditsAccumulated,
        courses: record.courses,
        digilockerUri: record.digilockerUri,
        recordHashSha256: record.recordHashSha256,
        status: record.status,
        verifiedAt: record.verifiedAt
      });
    }
  }

  // Sort by semester ascending
  records.sort((a, b) => a.semester - b.semester);

  return res.json({
    success: true,
    apaarId,
    totalRecords: records.length,
    timeline: records
  });
});

/**
 * GET /api/v1/students/:apaarId/apaar-card
 * Generate cryptographically signed QR Code and Official APAAR Card metadata
 */
router.get('/:apaarId/apaar-card', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const apaarId = String(req.params.apaarId);
  const student = DatabaseStore.students.get(apaarId);

  if (!student) {
    return res.status(404).json({ error: 'STUDENT_NOT_FOUND' });
  }

  const institution = DatabaseStore.institutions.get(student.currentAisheCode);
  const fullName = CryptoService.decryptField(student.fullNameEncrypted);

  // Digital verification QR payload
  const qrPayload = JSON.stringify({
    apaarId: student.apaarId,
    fullName: student.fullNameMasked,
    dobYear: student.dobMasked.split('/').pop(),
    gender: student.gender,
    abcAccountId: student.abcAccountId,
    aisheCode: student.currentAisheCode,
    issuer: 'All India Council for Technical Education (AICTE)',
    portal: 'https://apaar.aicte-india.gov.in',
    signature: CryptoService.generatePlatformSignature(`APAAR-CARD:${student.apaarId}`)
  });

  // Generate QR code Data URL
  const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
    errorCorrectionLevel: 'H',
    margin: 1,
    color: {
      dark: '#1e3a8a', // Deep Bharat Navy
      light: '#ffffff'
    }
  });

  return res.json({
    success: true,
    cardData: {
      apaarId: student.apaarId,
      fullName,
      dobMasked: student.dobMasked,
      gender: student.gender,
      currentInstitution: institution?.name || 'AICTE Institution',
      aisheCode: student.currentAisheCode,
      abcAccountId: student.abcAccountId,
      issuingAuthority: 'Ministry of Education & AICTE, Government of India',
      validity: 'LIFETIME_NATIONAL_CREDENTIAL',
      qrCodeDataUrl,
      rawQrPayload: qrPayload
    }
  });
});

export default router;
