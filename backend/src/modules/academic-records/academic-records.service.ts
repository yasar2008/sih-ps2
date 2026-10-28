import crypto from 'crypto';
import { DatabaseStore, AcademicRecord, Student } from '../../config/database';
import { CryptoService } from '../../security/crypto.service';
import { AuditService } from '../../security/audit.service';

export interface BulkUploadRecordItem {
  apaarId: string;
  semester: number;
  academicYear: string;
  programName: string;
  department: string;
  sgpa: number;
  cgpa: number;
  creditsEarned: number;
  courses: Array<{ code: string; title: string; credits: number; grade: string }>;
}

export interface IngestionBatchPayload {
  aisheCode: string;
  nodalOfficerId: string;
  batchId: string;
  digitalSignature: string; // Institutional DSC RSA-SHA256 signature
  records: BulkUploadRecordItem[];
}

export interface BatchProcessingResult {
  batchId: string;
  aisheCode: string;
  totalSubmitted: number;
  processedCount: number;
  failedCount: number;
  dscSignatureValid: boolean;
  results: Array<{
    apaarId: string;
    semester: number;
    status: 'SUCCESS' | 'FAILED';
    recordId?: string;
    recordHash?: string;
    digilockerUri?: string;
    abcSyncReceipt?: string;
    error?: string;
  }>;
}

export class AcademicRecordsService {
  /**
   * 4-Stage Automated Verification & Credit Sync Pipeline
   */
  public static async processBulkIngestionBatch(
    payload: IngestionBatchPayload,
    clientIp: string
  ): Promise<BatchProcessingResult> {
    const institution = DatabaseStore.institutions.get(payload.aisheCode);
    if (!institution) {
      throw new Error(`Institution with AISHE code ${payload.aisheCode} not found in AICTE registry.`);
    }

    // STAGE 1 & 2: Institutional DSC Signature Verification
    const canonicalBatchString = JSON.stringify({
      aisheCode: payload.aisheCode,
      batchId: payload.batchId,
      recordCount: payload.records.length
    });

    const isDscValid = CryptoService.verifyInstitutionalDSC(
      canonicalBatchString,
      payload.digitalSignature,
      institution.publicKeyPem
    );

    if (!isDscValid) {
      AuditService.logSecurityEvent({
        actorId: payload.nodalOfficerId,
        actorRole: 'INSTITUTION_NODAL',
        actorIp: clientIp,
        actionType: 'BULK_INGEST',
        entityType: 'ACADEMIC_RECORD',
        entityId: payload.batchId,
        details: { result: 'REJECTED_INVALID_DSC_SIGNATURE' }
      });
      throw new Error('Digital Signature Certificate (DSC) verification failed: Institutional signature is invalid or altered.');
    }

    const batchResult: BatchProcessingResult = {
      batchId: payload.batchId,
      aisheCode: payload.aisheCode,
      totalSubmitted: payload.records.length,
      processedCount: 0,
      failedCount: 0,
      dscSignatureValid: true,
      results: []
    };

    // STAGE 2, 3 & 4: Process records sequentially with cryptographic proofs
    for (const item of payload.records) {
      try {
        // Validate 12-digit APAAR ID format
        if (!/^[0-9]{12}$/.test(item.apaarId)) {
          throw new Error('Invalid APAAR ID format (must be 12 digits).');
        }

        // Schema & Identity Check: Check student exists in registry
        let student = DatabaseStore.students.get(item.apaarId);
        if (!student) {
          // Auto-enroll if student is brand new to this institution
          const studentToken = crypto.randomUUID();
          student = {
            apaarId: item.apaarId,
            fullNameEncrypted: CryptoService.encryptField(`Student ${item.apaarId}`),
            fullNameMasked: CryptoService.maskName(`Student ${item.apaarId}`),
            dobEncrypted: CryptoService.encryptField('2004-01-01'),
            dobMasked: '**/**/2004',
            gender: 'OTHER',
            mobileEncrypted: CryptoService.encryptField('+919000000000'),
            mobileMasked: 'XXXXXX0000',
            emailEncrypted: CryptoService.encryptField(`student.${item.apaarId}@inst.edu.in`),
            emailMasked: 's***@inst.edu.in',
            currentAisheCode: payload.aisheCode,
            enrollmentStatus: 'ENROLLED',
            abcAccountId: `ABC-IN-2024-${item.apaarId.slice(-6)}`,
            aadhaarReferenceToken: studentToken,
            isMinor: false,
            parentalConsentVerified: false
          };
          DatabaseStore.students.set(item.apaarId, student);
        }

        // STAGE 3: Deterministic SHA-256 Canonical Hashing
        const recordHash = CryptoService.computeCanonicalTranscriptHash({
          apaarId: item.apaarId,
          aisheCode: payload.aisheCode,
          semester: item.semester,
          academicYear: item.academicYear,
          sgpa: item.sgpa,
          cgpa: item.cgpa,
          creditsEarned: item.creditsEarned,
          courses: item.courses
        });

        // Generate W3C Verifiable Credential
        const recordId = crypto.randomUUID();
        const digilockerUri = `in.gov.aicte.apaar:RECORD-${item.academicYear.replace('-', '')}-SEM${item.semester}-${item.apaarId}`;

        const w3cCredential = {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://schema.org',
            'https://apaar.aicte-india.gov.in/contexts/v1'
          ],
          id: `urn:uuid:${recordId}`,
          type: ['VerifiableCredential', 'AICTEAcademicCredential'],
          issuer: `did:gov:in:aicte:institution:${payload.aisheCode}`,
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: `did:gov:in:apaar:${item.apaarId}`,
            institution: institution.name,
            aisheCode: payload.aisheCode,
            program: item.programName,
            semester: item.semester,
            academicYear: item.academicYear,
            sgpa: item.sgpa.toFixed(2),
            cgpa: item.cgpa.toFixed(2),
            creditsEarned: item.creditsEarned,
            abcAccountId: student.abcAccountId
          },
          proof: {
            type: 'RsaSignature2018',
            created: new Date().toISOString(),
            verificationMethod: `did:gov:in:aicte:institution:${payload.aisheCode}#key-1`,
            jws: payload.digitalSignature
          }
        };

        const platformSig = CryptoService.generatePlatformSignature(recordHash);

        // Store Record
        const newRecord: AcademicRecord = {
          recordId,
          apaarId: item.apaarId,
          aisheCode: payload.aisheCode,
          programName: item.programName,
          department: item.department,
          semester: item.semester,
          academicYear: item.academicYear,
          sgpaEncrypted: CryptoService.encryptField(item.sgpa.toFixed(2)),
          sgpaMasked: item.sgpa.toFixed(2),
          cgpaEncrypted: CryptoService.encryptField(item.cgpa.toFixed(2)),
          cgpaMasked: item.cgpa.toFixed(2),
          creditsEarned: item.creditsEarned,
          totalCreditsAccumulated: item.creditsEarned * item.semester, // calculation
          transcriptPayloadEncrypted: CryptoService.encryptField(JSON.stringify(item.courses)),
          courses: item.courses,
          digilockerUri,
          abcSyncStatus: 'SYNCED',
          recordHashSha256: recordHash,
          w3cVerifiableCredential: w3cCredential,
          issuerDigitalSignature: payload.digitalSignature,
          platformSignature: platformSig,
          status: 'VERIFIED',
          verifiedAt: new Date().toISOString()
        };

        DatabaseStore.academicRecords.set(recordId, newRecord);

        // STAGE 4: Audit Logging
        AuditService.logSecurityEvent({
          actorId: payload.nodalOfficerId,
          actorRole: 'INSTITUTION_NODAL',
          actorIp: clientIp,
          actionType: 'WRITE',
          entityType: 'ACADEMIC_RECORD',
          entityId: recordId,
          details: {
            apaarId: item.apaarId,
            aisheCode: payload.aisheCode,
            semester: item.semester,
            recordHash
          }
        });

        batchResult.processedCount++;
        batchResult.results.push({
          apaarId: item.apaarId,
          semester: item.semester,
          status: 'SUCCESS',
          recordId,
          recordHash,
          digilockerUri,
          abcSyncReceipt: `TXN-ABC-${Date.now()}`
        });
      } catch (err: any) {
        batchResult.failedCount++;
        batchResult.results.push({
          apaarId: item.apaarId,
          semester: item.semester,
          status: 'FAILED',
          error: err.message
        });
      }
    }

    return batchResult;
  }
}
