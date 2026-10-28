import { Router, Response } from 'express';
import { AcademicRecordsService } from './academic-records.service';
import { DatabaseStore } from '../../config/database';
import { authenticate, requireRole, enforceInstitutionalIsolation, AuthenticatedRequest, extractClientIp } from '../auth/auth.middleware';

const router = Router();

/**
 * POST /api/v1/institution/bulk-upload
 * Stage 1 & 2: Ingest institutional batch signed with Nodal Officer DSC
 */
router.post(
  '/bulk-upload',
  authenticate,
  requireRole('INSTITUTION_NODAL', 'AICTE_SUPERADMIN'),
  enforceInstitutionalIsolation,
  async (req: AuthenticatedRequest, res: Response) => {
    const clientIp = extractClientIp(req);
    const { aisheCode, nodalOfficerId, batchId, digitalSignature, records } = req.body;

    if (!aisheCode || !records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        error: 'INVALID_BATCH_PAYLOAD',
        message: 'AISHE Code and non-empty records list are required.'
      });
    }

    try {
      const result = await AcademicRecordsService.processBulkIngestionBatch(
        {
          aisheCode,
          nodalOfficerId: nodalOfficerId || req.user?.sub || 'NODAL-DEFAULT',
          batchId: batchId || `BATCH-${Date.now()}`,
          digitalSignature: digitalSignature || 'COEP_NODAL_OFFICER_DSC_RSA_SHA256_SIGNATURE_BASE64==',
          records
        },
        clientIp
      );

      return res.json({
        success: true,
        message: `Batch processed successfully: ${result.processedCount} records cryptographically sealed and synced with ABC & DigiLocker.`,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ error: 'BATCH_INGESTION_FAILED', message: err.message });
    }
  }
);

/**
 * GET /api/v1/institution/records
 * View all records issued by current institution
 */
router.get(
  '/institution-records',
  authenticate,
  requireRole('INSTITUTION_NODAL', 'AICTE_SUPERADMIN'),
  (req: AuthenticatedRequest, res: Response) => {
    const aisheCode = req.user?.role === 'INSTITUTION_NODAL' ? req.user.aisheCode : req.query.aisheCode;
    const records: any[] = [];

    for (const [_, rec] of DatabaseStore.academicRecords.entries()) {
      if (!aisheCode || rec.aisheCode === aisheCode) {
        records.push({
          recordId: rec.recordId,
          apaarId: rec.apaarId,
          aisheCode: rec.aisheCode,
          programName: rec.programName,
          semester: rec.semester,
          academicYear: rec.academicYear,
          sgpa: rec.sgpaMasked,
          cgpa: rec.cgpaMasked,
          creditsEarned: rec.creditsEarned,
          recordHashSha256: rec.recordHashSha256,
          digilockerUri: rec.digilockerUri,
          status: rec.status,
          verifiedAt: rec.verifiedAt
        });
      }
    }

    return res.json({
      success: true,
      aisheCode,
      totalCount: records.length,
      records
    });
  }
);

/**
 * GET /api/v1/academic-records/:recordId
 * View individual credential
 */
router.get('/:recordId', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const recordId = String(req.params.recordId);
  const record = DatabaseStore.academicRecords.get(recordId);

  if (!record) {
    return res.status(404).json({ error: 'RECORD_NOT_FOUND' });
  }

  const institution = DatabaseStore.institutions.get(record.aisheCode);

  return res.json({
    success: true,
    data: {
      ...record,
      institutionName: institution?.name || record.aisheCode
    }
  });
});

export default router;
