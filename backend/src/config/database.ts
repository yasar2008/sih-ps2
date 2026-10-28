import { CryptoService } from '../security/crypto.service';
import { AuditService } from '../security/audit.service';

export interface Institution {
  aisheCode: string;
  aictePermanentId: string;
  name: string;
  category: string;
  state: string;
  district: string;
  nodalOfficerId: string;
  nodalOfficerName: string;
  nodalOfficerEmail: string;
  nodalOfficerMobile: string;
  publicKeyPem: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'UNDER_AUDIT';
  whitelistedIpRange: string;
}

export interface Student {
  apaarId: string;
  fullNameEncrypted: string;
  fullNameMasked: string;
  dobEncrypted: string;
  dobMasked: string;
  gender: string;
  mobileEncrypted: string;
  mobileMasked: string;
  emailEncrypted: string;
  emailMasked: string;
  currentAisheCode: string;
  enrollmentStatus: 'ENROLLED' | 'TRANSFERRED' | 'GRADUATED' | 'SUSPENDED';
  abcAccountId: string;
  aadhaarReferenceToken: string;
  isMinor: boolean;
  parentalConsentVerified: boolean;
}

export interface AcademicRecord {
  recordId: string;
  apaarId: string;
  aisheCode: string;
  programName: string;
  department: string;
  semester: number;
  academicYear: string;
  sgpaEncrypted: string;
  sgpaMasked: string;
  cgpaEncrypted: string;
  cgpaMasked: string;
  creditsEarned: number;
  totalCreditsAccumulated: number;
  transcriptPayloadEncrypted: string;
  courses: Array<{ code: string; title: string; credits: number; grade: string }>;
  digilockerUri: string;
  abcSyncStatus: 'SYNCED' | 'PENDING' | 'FAILED';
  recordHashSha256: string;
  w3cVerifiableCredential: any;
  issuerDigitalSignature: string;
  platformSignature: string;
  status: 'VERIFIED' | 'REVOKED' | 'DISPUTED';
  verifiedAt: string;
}

export interface ConsentArtefact {
  consentId: string;
  apaarId: string;
  requesterEntityId: string;
  requesterName: string;
  requesterType: 'EMPLOYER' | 'INSTITUTION' | 'GOVERNMENT_AGENCY' | 'VERIFIER';
  purposeCode: string;
  purposeDescription: string;
  allowedFields: string[];
  validFrom: string;
  expiresAt: string;
  status: 'REQUESTED' | 'GRANTED' | 'REVOKED' | 'EXPIRED';
  studentSignature?: string;
  consentHandle: string;
  grantedAt?: string;
  revokedAt?: string;
}

export interface StudentTransfer {
  transferId: string;
  apaarId: string;
  fromAisheCode: string;
  toAisheCode: string;
  programName: string;
  targetSemester: number;
  creditsTransferred: number;
  nocDocumentHash: string;
  status: 'INITIATED' | 'APPROVED_BY_SOURCE' | 'APPROVED_BY_TARGET' | 'COMPLETED' | 'REJECTED';
  sourceNodalSignature?: string;
  targetNodalSignature?: string;
  initiatedAt: string;
  completedAt?: string;
}

export interface AnomalyAlert {
  alertId: string;
  alertType: 'DUPLICATE_ENROLLMENT' | 'TAMPERED_CREDENTIAL' | 'ABNORMAL_CREDIT_VELOCITY' | 'UNAUTHORIZED_BULK_ACCESS';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  apaarId?: string;
  aisheCode?: string;
  description: string;
  evidencePayload: Record<string, any>;
  status: 'ACTIVE' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';
  detectedAt: string;
}

export class DatabaseStore {
  public static institutions: Map<string, Institution> = new Map();
  public static students: Map<string, Student> = new Map();
  public static academicRecords: Map<string, AcademicRecord> = new Map();
  public static consentArtefacts: Map<string, ConsentArtefact> = new Map();
  public static studentTransfers: Map<string, StudentTransfer> = new Map();
  public static anomalyAlerts: Map<string, AnomalyAlert> = new Map();

  static {
    this.seedInitialData();
  }

  private static seedInitialData() {
    // 1. Seed Institutions
    const instList: Institution[] = [
      {
        aisheCode: 'C-41584',
        aictePermanentId: '1-10992381',
        name: 'COEP Technological University, Pune',
        category: 'Engineering & Technology',
        state: 'Maharashtra',
        district: 'Pune',
        nodalOfficerId: 'NODAL-COEP-01',
        nodalOfficerName: 'Dr. Sanjay Arvind Kamble',
        nodalOfficerEmail: 'nodal.coep@gov.in',
        nodalOfficerMobile: '+919822012345',
        publicKeyPem: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA10qL1z7Vv3yR6s8Y1t9v\nCOEP_NODAL_OFFICER_OFFICIAL_DSC_RSA_PUBLIC_KEY_PEM_2026_AICTE_APPROVED\nAQAB\n-----END PUBLIC KEY-----',
        status: 'ACTIVE',
        whitelistedIpRange: '10.10.0.0/16,192.168.1.0/24'
      },
      {
        aisheCode: 'C-24953',
        aictePermanentId: '1-28118274',
        name: 'College of Engineering, Guindy (Anna University)',
        category: 'Engineering & Technology',
        state: 'Tamil Nadu',
        district: 'Chennai',
        nodalOfficerId: 'NODAL-CEG-02',
        nodalOfficerName: 'Dr. S. Meenakshi Sundaram',
        nodalOfficerEmail: 'nodal.ceg@annauniv.edu.in',
        nodalOfficerMobile: '+919444018273',
        publicKeyPem: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA38uP9a2Xb4qR7t0v1z5k\nCEG_ANNA_UNIV_NODAL_OFFICER_DSC_RSA_PUBLIC_KEY_PEM_2026_AICTE_APPROVED\nAQAB\n-----END PUBLIC KEY-----',
        status: 'ACTIVE',
        whitelistedIpRange: '10.20.0.0/16,172.16.0.0/16'
      },
      {
        aisheCode: 'C-33827',
        aictePermanentId: '1-45691024',
        name: 'Veermata Jijabai Technological Institute (VJTI)',
        category: 'Engineering & Technology',
        state: 'Maharashtra',
        district: 'Mumbai',
        nodalOfficerId: 'NODAL-VJTI-03',
        nodalOfficerName: 'Prof. Milind Ramesh Joshi',
        nodalOfficerEmail: 'nodal.vjti@vjti.ac.in',
        nodalOfficerMobile: '+919820194857',
        publicKeyPem: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA49vQ1b3Yc5rS8u1w2a6l\nVJTI_MUMBAI_NODAL_OFFICER_DSC_RSA_PUBLIC_KEY_PEM_2026_AICTE_APPROVED\nAQAB\n-----END PUBLIC KEY-----',
        status: 'ACTIVE',
        whitelistedIpRange: '10.30.0.0/16'
      },
      {
        aisheCode: 'U-0099',
        aictePermanentId: '1-39827110',
        name: 'Delhi Technological University (DTU)',
        category: 'Engineering & Technology',
        state: 'Delhi',
        district: 'North West Delhi',
        nodalOfficerId: 'NODAL-DTU-04',
        nodalOfficerName: 'Dr. Rakesh Kumar Verma',
        nodalOfficerEmail: 'nodal.dtu@dtu.ac.in',
        nodalOfficerMobile: '+919811029384',
        publicKeyPem: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA50wR2c4Zd6sT9v2x3b7m\nDTU_DELHI_NODAL_OFFICER_DSC_RSA_PUBLIC_KEY_PEM_2026_AICTE_APPROVED\nAQAB\n-----END PUBLIC KEY-----',
        status: 'ACTIVE',
        whitelistedIpRange: '10.40.0.0/16'
      },
      {
        aisheCode: 'U-0570',
        aictePermanentId: '1-77182903',
        name: 'Jadavpur University Faculty of Engineering',
        category: 'Engineering & Technology',
        state: 'West Bengal',
        district: 'Kolkata',
        nodalOfficerId: 'NODAL-JU-05',
        nodalOfficerName: 'Dr. Anirban Mukherjee',
        nodalOfficerEmail: 'nodal.ju@jadavpuruniversity.in',
        nodalOfficerMobile: '+919830018274',
        publicKeyPem: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA61xS3d5ae7tU0w3y4c8n\nJU_KOLKATA_NODAL_OFFICER_DSC_RSA_PUBLIC_KEY_PEM_2026_AICTE_APPROVED\nAQAB\n-----END PUBLIC KEY-----',
        status: 'ACTIVE',
        whitelistedIpRange: '10.50.0.0/16'
      }
    ];

    instList.forEach(i => this.institutions.set(i.aisheCode, i));

    // 2. Seed Students
    const studentList: Student[] = [
      {
        apaarId: '908123456781',
        fullNameEncrypted: CryptoService.encryptField('Aarav Rajesh Sharma'),
        fullNameMasked: CryptoService.maskName('Aarav Rajesh Sharma'),
        dobEncrypted: CryptoService.encryptField('2003-05-14'),
        dobMasked: CryptoService.maskDob('2003-05-14'),
        gender: 'MALE',
        mobileEncrypted: CryptoService.encryptField('+919822184920'),
        mobileMasked: CryptoService.maskMobile('+919822184920'),
        emailEncrypted: CryptoService.encryptField('aarav.sharma.coep@gmail.com'),
        emailMasked: CryptoService.maskEmail('aarav.sharma.coep@gmail.com'),
        currentAisheCode: 'C-41584',
        enrollmentStatus: 'ENROLLED',
        abcAccountId: 'ABC-IN-2023-098124',
        aadhaarReferenceToken: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        isMinor: false,
        parentalConsentVerified: false
      },
      {
        apaarId: '908123456782',
        fullNameEncrypted: CryptoService.encryptField('Priya Sundaram Iyer'),
        fullNameMasked: CryptoService.maskName('Priya Sundaram Iyer'),
        dobEncrypted: CryptoService.encryptField('2004-08-22'),
        dobMasked: CryptoService.maskDob('2004-08-22'),
        gender: 'FEMALE',
        mobileEncrypted: CryptoService.encryptField('+919444109283'),
        mobileMasked: CryptoService.maskMobile('+919444109283'),
        emailEncrypted: CryptoService.encryptField('priya.iyer@annauniv.edu.in'),
        emailMasked: CryptoService.maskEmail('priya.iyer@annauniv.edu.in'),
        currentAisheCode: 'C-24953',
        enrollmentStatus: 'ENROLLED',
        abcAccountId: 'ABC-IN-2023-098125',
        aadhaarReferenceToken: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
        isMinor: false,
        parentalConsentVerified: false
      },
      {
        apaarId: '908123456783',
        fullNameEncrypted: CryptoService.encryptField('Rohan Amit Deshmukh'),
        fullNameMasked: CryptoService.maskName('Rohan Amit Deshmukh'),
        dobEncrypted: CryptoService.encryptField('2003-11-09'),
        dobMasked: CryptoService.maskDob('2003-11-09'),
        gender: 'MALE',
        mobileEncrypted: CryptoService.encryptField('+919820491823'),
        mobileMasked: CryptoService.maskMobile('+919820491823'),
        emailEncrypted: CryptoService.encryptField('rohan.deshmukh@vjti.ac.in'),
        emailMasked: CryptoService.maskEmail('rohan.deshmukh@vjti.ac.in'),
        currentAisheCode: 'C-33827',
        enrollmentStatus: 'ENROLLED',
        abcAccountId: 'ABC-IN-2023-098126',
        aadhaarReferenceToken: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
        isMinor: false,
        parentalConsentVerified: false
      }
    ];

    studentList.forEach(s => this.students.set(s.apaarId, s));

    // 3. Seed Academic Records with Canonical Hash & W3C Verifiable Credentials
    const coepCoursesSem5 = [
      { code: 'CS501', title: 'Distributed Systems', credits: 4, grade: 'AA' },
      { code: 'CS502', title: 'Compiler Design', credits: 4, grade: 'AB' },
      { code: 'CS503', title: 'Cryptography & Network Security', credits: 4, grade: 'AA' },
      { code: 'CS504', title: 'Machine Learning', credits: 4, grade: 'AA' },
      { code: 'CS505', title: 'Cloud Computing Lab', credits: 2, grade: 'AA' },
      { code: 'CS506', title: 'Minor Project', credits: 4, grade: 'AA' }
    ];

    const record1Hash = CryptoService.computeCanonicalTranscriptHash({
      apaarId: '908123456781',
      aisheCode: 'C-41584',
      semester: 5,
      academicYear: '2024-2025',
      sgpa: '8.92',
      cgpa: '8.84',
      creditsEarned: 22.0,
      courses: coepCoursesSem5
    });

    const record1Id = 'f1e2d3c4-b5a6-9788-1234-567890abcdef';
    const rec1: AcademicRecord = {
      recordId: record1Id,
      apaarId: '908123456781',
      aisheCode: 'C-41584',
      programName: 'Bachelor of Technology in Computer Engineering',
      department: 'Computer Engineering',
      semester: 5,
      academicYear: '2024-2025',
      sgpaEncrypted: CryptoService.encryptField('8.92'),
      sgpaMasked: '8.92',
      cgpaEncrypted: CryptoService.encryptField('8.84'),
      cgpaMasked: '8.84',
      creditsEarned: 22.0,
      totalCreditsAccumulated: 110.0,
      transcriptPayloadEncrypted: CryptoService.encryptField(JSON.stringify(coepCoursesSem5)),
      courses: coepCoursesSem5,
      digilockerUri: 'in.gov.aicte.apaar:RECORD-2024-SEM5-COEP-908123456781',
      abcSyncStatus: 'SYNCED',
      recordHashSha256: record1Hash,
      w3cVerifiableCredential: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: `urn:uuid:${record1Id}`,
        type: ['VerifiableCredential', 'AICTEAcademicCredential'],
        issuer: 'did:gov:in:aicte:institution:C-41584',
        issuanceDate: '2025-01-15T10:30:00Z',
        credentialSubject: {
          id: 'did:gov:in:apaar:908123456781',
          institution: 'COEP Technological University, Pune',
          program: 'Bachelor of Technology in Computer Engineering',
          semester: 5,
          sgpa: '8.92',
          cgpa: '8.84',
          creditsEarned: 22.0,
          totalCreditsAccumulated: 110.0,
          abcAccountId: 'ABC-IN-2023-098124'
        },
        proof: {
          type: 'RsaSignature2018',
          created: '2025-01-15T10:30:00Z',
          verificationMethod: 'did:gov:in:aicte:institution:C-41584#key-1',
          jws: 'COEP_NODAL_OFFICER_DSC_RSA_SHA256_SIGNATURE_BASE64'
        }
      },
      issuerDigitalSignature: 'COEP_NODAL_OFFICER_DSC_RSA_SHA256_SIGNATURE_BASE64==',
      platformSignature: CryptoService.generatePlatformSignature(record1Hash),
      status: 'VERIFIED',
      verifiedAt: '2025-01-15T10:30:00Z'
    };

    this.academicRecords.set(record1Id, rec1);

    // 4. Seed DEPA Consent Artefacts
    const consent1Id = '0a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d';
    this.consentArtefacts.set(consent1Id, {
      consentId: consent1Id,
      apaarId: '908123456781',
      requesterEntityId: 'ORG-TCS-RECRUITMENT-2026',
      requesterName: 'Tata Consultancy Services - Campus Hiring Cell',
      requesterType: 'EMPLOYER',
      purposeCode: 'EMPLOYMENT_VERIFICATION',
      purposeDescription: 'Verification of CGPA, SGPA, and graduation eligibility for National Qualifier Test (NQT) onboarding.',
      allowedFields: ['FULL_NAME', 'ENROLLMENT_STATUS', 'CGPA', 'SGPA', 'TOTAL_CREDITS'],
      validFrom: new Date(Date.now() - 2 * 86400000).toISOString(),
      expiresAt: new Date(Date.now() + 28 * 86400000).toISOString(),
      status: 'GRANTED',
      studentSignature: 'STUDENT_AADHAAR_MERIPEHCHAAN_E_SIGN_2026_VALID',
      consentHandle: 'CONSENT-HANDLE-TCS-908123456781-2026',
      grantedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    });

    const consent2Id = '1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e';
    this.consentArtefacts.set(consent2Id, {
      consentId: consent2Id,
      apaarId: '908123456781',
      requesterEntityId: 'AISHE-U-0099',
      requesterName: 'Delhi Technological University - Post-Graduate Admissions',
      requesterType: 'INSTITUTION',
      purposeCode: 'TRANSFER_ADMISSION',
      purposeDescription: 'Evaluation of credit accumulation for inter-university lateral transfer and fellowship eligibility.',
      allowedFields: ['FULL_NAME', 'ENROLLMENT_STATUS', 'TRANSCRIPT_DETAILS', 'CREDITS_EARNED'],
      validFrom: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(),
      status: 'REQUESTED',
      consentHandle: 'CONSENT-HANDLE-DTU-908123456781-2026'
    });

    // 5. Seed Anomaly Alert
    const alertId = '99887766-5544-3322-1100-aabbccddeeff';
    this.anomalyAlerts.set(alertId, {
      alertId,
      alertType: 'DUPLICATE_ENROLLMENT',
      severity: 'HIGH',
      apaarId: '908123456783',
      aisheCode: 'C-33827',
      description: 'Automated Sentinel detected concurrent active regular semester enrollment attempt for APAAR 908123456783 across two distinct AICTE institutions.',
      evidencePayload: {
        conflictingInstitutions: ['C-33827 (VJTI)', 'U-0312 (Uni Pune)'],
        detectedAt: new Date().toISOString(),
        actionRecommended: 'Hold Semester 5 batch validation until Migration Certificate is uploaded.'
      },
      status: 'ACTIVE',
      detectedAt: new Date().toISOString()
    });
  }
}
