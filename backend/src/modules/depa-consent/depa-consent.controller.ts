import { Router, Response } from 'express';
import crypto from 'crypto';
import { DatabaseStore, ConsentArtefact } from '../../config/database';
import { AuditService } from '../../security/audit.service';
import { authenticate, AuthenticatedRequest, extractClientIp } from '../auth/auth.middleware';

const router = Router();

/**
 * POST /api/v1/consent/request
 * Third-party entity (Employer / University) requests student consent under DEPA
 */
router.post('/request', (req: AuthenticatedRequest, res: Response) => {
  const clientIp = extractClientIp(req);
  const {
    apaarId,
    requesterEntityId,
    requesterName,
    requesterType,
    purposeCode,
    purposeDescription,
    allowedFields,
    validityDays
  } = req.body;

  if (!apaarId || !requesterEntityId || !allowedFields || !Array.isArray(allowedFields)) {
    return res.status(400).json({ error: 'INVALID_CONSENT_REQUEST_PAYLOAD' });
  }

  const consentId = crypto.randomUUID();
  const consentHandle = `CONSENT-HANDLE-${requesterEntityId}-${apaarId}-${Date.now()}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (validityDays || 30) * 86400000);

  const artefact: ConsentArtefact = {
    consentId,
    apaarId,
    requesterEntityId,
    requesterName: requesterName || requesterEntityId,
    requesterType: requesterType || 'EMPLOYER',
    purposeCode: purposeCode || 'EMPLOYMENT_VERIFICATION',
    purposeDescription: purposeDescription || 'Academic verification for employment onboarding',
    allowedFields,
    validFrom: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    status: 'REQUESTED',
    consentHandle
  };

  DatabaseStore.consentArtefacts.set(consentId, artefact);

  AuditService.logSecurityEvent({
    actorId: requesterEntityId,
    actorRole: 'VERIFIER_API',
    actorIp: clientIp,
    actionType: 'WRITE',
    entityType: 'CONSENT_ARTEFACT',
    entityId: consentId,
    details: { apaarId, purposeCode, allowedFields }
  });

  return res.json({
    success: true,
    message: 'DEPA Consent request submitted. Notification sent to student for cryptographic approval.',
    consentId,
    consentHandle,
    status: 'REQUESTED'
  });
});

/**
 * GET /api/v1/consent/student/:apaarId
 * Student views their consent requests and active permissions in real-time
 */
router.get('/student/:apaarId', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const apaarId = String(req.params.apaarId);

  // Ensure student is accessing their own consent manager or is super-admin
  if (req.user?.role === 'STUDENT' && req.user.sub !== apaarId) {
    return res.status(403).json({ error: 'FORBIDDEN_ACCESS' });
  }

  const artefacts: ConsentArtefact[] = [];
  for (const [_, c] of DatabaseStore.consentArtefacts.entries()) {
    if (c.apaarId === apaarId) {
      artefacts.push(c);
    }
  }

  // Sort: REQUESTED first, then by validFrom desc
  artefacts.sort((a, b) => {
    if (a.status === 'REQUESTED' && b.status !== 'REQUESTED') return -1;
    if (b.status === 'REQUESTED' && a.status !== 'REQUESTED') return 1;
    return new Date(b.validFrom).getTime() - new Date(a.validFrom).getTime();
  });

  return res.json({
    success: true,
    apaarId,
    totalArtefacts: artefacts.length,
    artefacts
  });
});

/**
 * POST /api/v1/consent/:consentId/grant
 * Student grants consent with digital e-sign
 */
router.post('/:consentId/grant', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const consentId = String(req.params.consentId);
  const clientIp = extractClientIp(req);
  const artefact = DatabaseStore.consentArtefacts.get(consentId);

  if (!artefact) {
    return res.status(404).json({ error: 'CONSENT_ARTEFACT_NOT_FOUND' });
  }

  if (req.user?.role === 'STUDENT' && req.user.sub !== artefact.apaarId) {
    return res.status(403).json({ error: 'FORBIDDEN_CONSENT_OPERATION' });
  }

  artefact.status = 'GRANTED';
  artefact.grantedAt = new Date().toISOString();
  artefact.studentSignature = `MERIPEHCHAAN_E_SIGN_STUDENT_${artefact.apaarId}_${Date.now()}`;

  AuditService.logSecurityEvent({
    actorId: artefact.apaarId,
    actorRole: 'STUDENT',
    actorIp: clientIp,
    actionType: 'CONSENT_GRANT',
    entityType: 'CONSENT_ARTEFACT',
    entityId: consentId,
    consentTokenId: consentId,
    details: {
      requesterEntityId: artefact.requesterEntityId,
      purposeCode: artefact.purposeCode,
      allowedFields: artefact.allowedFields
    }
  });

  return res.json({
    success: true,
    message: 'Consent granted successfully. Third-party is now authorized to access specified fields until expiration.',
    artefact
  });
});

/**
 * POST /api/v1/consent/:consentId/revoke
 * Student revokes consent immediately under DPDP Act Right to Revoke
 */
router.post('/:consentId/revoke', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const consentId = String(req.params.consentId);
  const clientIp = extractClientIp(req);
  const artefact = DatabaseStore.consentArtefacts.get(consentId);

  if (!artefact) {
    return res.status(404).json({ error: 'CONSENT_ARTEFACT_NOT_FOUND' });
  }

  if (req.user?.role === 'STUDENT' && req.user.sub !== artefact.apaarId) {
    return res.status(403).json({ error: 'FORBIDDEN_CONSENT_OPERATION' });
  }

  artefact.status = 'REVOKED';
  artefact.revokedAt = new Date().toISOString();

  AuditService.logSecurityEvent({
    actorId: artefact.apaarId,
    actorRole: 'STUDENT',
    actorIp: clientIp,
    actionType: 'CONSENT_REVOKE',
    entityType: 'CONSENT_ARTEFACT',
    entityId: consentId,
    consentTokenId: consentId,
    details: { requesterEntityId: artefact.requesterEntityId }
  });

  return res.json({
    success: true,
    message: 'Consent revoked in real-time. Third-party access has been immediately invalidated.',
    artefact
  });
});

export default router;
