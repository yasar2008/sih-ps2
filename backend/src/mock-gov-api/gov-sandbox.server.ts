import express, { Request, Response } from 'express';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());

// In-memory mock repositories for the sandbox
const digilockerStore = new Map<string, any>();
const abcLedgerStore = new Map<string, { totalCredits: number; history: any[] }>();
const otpStore = new Map<string, { otp: string; expiresAt: number; apaarId: string }>();

// Healthcheck
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    service: 'National Gov-API Sandbox (API Setu, DigiLocker, MeriPehchaan, ABC)',
    timestamp: new Date().toISOString(),
    version: '2026.1-PROD-MOCK'
  });
});

// ============================================================================
// 1. API SETU: APAAR Verification & AISHE Registry
// ============================================================================
app.get('/api-setu/v1/apaar/verify/:apaar_id', (req: Request, res: Response) => {
  const apaar_id = String(req.params.apaar_id);

  // Validate 12-digit format
  if (!/^[0-9]{12}$/.test(apaar_id)) {
    return res.status(400).json({
      error: 'INVALID_APAAR_FORMAT',
      message: 'APAAR ID must be an exact 12-digit numerical string as mandated by NEP 2020.'
    });
  }

  // Pre-configured mock data for known demo APAAR IDs
  const knownStudents: Record<string, any> = {
    '908123456781': {
      apaarId: '908123456781',
      fullName: 'Aarav Rajesh Sharma',
      dob: '2003-05-14',
      gender: 'MALE',
      currentAisheCode: 'C-41584',
      institutionName: 'COEP Technological University, Pune',
      abcAccountId: 'ABC-IN-2023-098124',
      status: 'ACTIVE'
    },
    '908123456782': {
      apaarId: '908123456782',
      fullName: 'Priya Sundaram Iyer',
      dob: '2004-08-22',
      gender: 'FEMALE',
      currentAisheCode: 'C-24953',
      institutionName: 'College of Engineering, Guindy (Anna University)',
      abcAccountId: 'ABC-IN-2023-098125',
      status: 'ACTIVE'
    },
    '908123456783': {
      apaarId: '908123456783',
      fullName: 'Rohan Amit Deshmukh',
      dob: '2003-11-09',
      gender: 'MALE',
      currentAisheCode: 'C-33827',
      institutionName: 'Veermata Jijabai Technological Institute (VJTI)',
      abcAccountId: 'ABC-IN-2023-098126',
      status: 'ACTIVE'
    }
  };

  const student = knownStudents[apaar_id] || {
    apaarId: apaar_id,
    fullName: 'Verified Student Registry',
    dob: '2003-01-01',
    gender: 'OTHER',
    currentAisheCode: 'C-41584',
    institutionName: 'AICTE Affiliated Institution',
    abcAccountId: `ABC-IN-2024-${apaar_id.slice(-6)}`,
    status: 'ACTIVE'
  };

  res.json({
    success: true,
    source: 'API_SETU_NATIONAL_REGISTRY',
    data: student,
    verifiedAt: new Date().toISOString()
  });
});

app.post('/api-setu/v1/aishe/verify-nodal', (req: Request, res: Response) => {
  const { aisheCode, aictePermanentId, nodalOfficerEmail } = req.body;

  if (!aisheCode || !aictePermanentId) {
    return res.status(400).json({ error: 'MISSING_MANDATORY_FIELDS' });
  }

  res.json({
    success: true,
    aisheVerified: true,
    aictePermanentId,
    aisheCode,
    nodalOfficerEmail,
    dscStatus: 'ACTIVE_CERTIFIED_CLASS_3',
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// 2. DIGILOCKER: National Academic Depository (NAD) Sync
// ============================================================================
app.post('/digilocker/v1/push/uri', (req: Request, res: Response) => {
  const { uri, verifiableCredential, recordHash } = req.body;

  if (!uri || !verifiableCredential) {
    return res.status(400).json({ error: 'INVALID_DIGILOCKER_PAYLOAD' });
  }

  digilockerStore.set(uri, {
    uri,
    verifiableCredential,
    recordHash,
    storedAt: new Date().toISOString(),
    status: 'CERTIFIED'
  });

  res.json({
    success: true,
    digilockerUri: uri,
    receiptId: `DL-REC-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    status: 'ISSUED_AND_PUBLISHED'
  });
});

app.get('/digilocker/v1/pull/:uri', (req: Request, res: Response) => {
  const uri = String(req.params.uri);
  const doc = digilockerStore.get(uri);

  if (!doc) {
    // Generate fallback mock for pre-seeded records
    return res.json({
      success: true,
      uri,
      status: 'AVAILABLE_IN_NAD',
      verifiedBy: 'DigiLocker National Academic Depository'
    });
  }

  res.json({
    success: true,
    document: doc
  });
});

// ============================================================================
// 3. ACADEMIC BANK OF CREDITS (ABC): National Credit Mobility
// ============================================================================
app.post('/abc/v1/credits/sync', (req: Request, res: Response) => {
  const { abcAccountId, apaarId, aisheCode, creditsEarned, semester, programName } = req.body;

  if (!abcAccountId || !creditsEarned) {
    return res.status(400).json({ error: 'INVALID_CREDIT_SYNC_PAYLOAD' });
  }

  const existing = abcLedgerStore.get(abcAccountId) || { totalCredits: 0, history: [] };
  const updatedCredits = Number((existing.totalCredits + Number(creditsEarned)).toFixed(2));
  
  const entry = {
    transactionId: `TXN-ABC-${Date.now()}`,
    apaarId,
    aisheCode,
    creditsEarned: Number(creditsEarned),
    semester,
    programName,
    syncedAt: new Date().toISOString()
  };

  existing.totalCredits = updatedCredits;
  existing.history.push(entry);
  abcLedgerStore.set(abcAccountId, existing);

  res.json({
    success: true,
    abcAccountId,
    creditsAdded: Number(creditsEarned),
    totalCreditsAccumulated: updatedCredits,
    ledgerReceiptHash: crypto.createHash('sha256').update(JSON.stringify(entry)).digest('hex'),
    syncedAt: entry.syncedAt
  });
});

app.get('/abc/v1/credits/:abc_account_id', (req: Request, res: Response) => {
  const abc_account_id = String(req.params.abc_account_id);
  const ledger = abcLedgerStore.get(abc_account_id) || {
    totalCredits: 110.0,
    history: [
      { semester: 1, credits: 22, aisheCode: 'C-41584' },
      { semester: 2, credits: 22, aisheCode: 'C-41584' },
      { semester: 3, credits: 22, aisheCode: 'C-41584' },
      { semester: 4, credits: 22, aisheCode: 'C-41584' },
      { semester: 5, credits: 22, aisheCode: 'C-41584' }
    ]
  };

  res.json({
    success: true,
    abcAccountId: abc_account_id,
    data: ledger
  });
});

// ============================================================================
// 4. MERIPEHCHAAN (National Single Sign-On / Jan Parichay)
// ============================================================================
app.post('/meripehchaan/v1/otp/send', (req: Request, res: Response) => {
  const { identifier, type } = req.body; // apaar_id or mobile or aadhaar

  if (!identifier) {
    return res.status(400).json({ error: 'IDENTIFIER_REQUIRED' });
  }

  // Generate deterministic demo OTP for testing: '123456'
  const otp = '123456';
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(identifier, {
    otp,
    expiresAt,
    apaarId: identifier
  });

  res.json({
    success: true,
    message: `National SSO OTP successfully dispatched to registered mobile linked with ${type || 'APAAR'}.`,
    txnId: `TXN-SSO-${Date.now()}`,
    expiresInSeconds: 600,
    demoHint: 'For evaluation testing, the mock sandbox OTP is: 123456'
  });
});

app.post('/meripehchaan/v1/otp/verify', (req: Request, res: Response) => {
  const { identifier, otp } = req.body;

  const stored = otpStore.get(identifier);
  // Allow test OTP 123456 for all valid demo accounts
  if (otp !== '123456' && (!stored || stored.otp !== otp || Date.now() > stored.expiresAt)) {
    return res.status(401).json({
      success: false,
      error: 'INVALID_OR_EXPIRED_OTP',
      message: 'The OTP entered is incorrect or has expired.'
    });
  }

  res.json({
    success: true,
    nationalSsoToken: `MERIPEHCHAAN-TOKEN-${crypto.randomBytes(16).toString('hex')}`,
    kycStatus: 'VERIFIED_A1',
    user: {
      apaarId: identifier,
      authMethod: 'AADHAAR_OTP_SSO',
      verifiedAt: new Date().toISOString()
    }
  });
});

// ============================================================================
// 5. UIDAI AADHAAR DATA VAULT (ADV) GATEWAY SIMULATOR
// ============================================================================
app.post('/uidai/v1/vault/tokenize', (req: Request, res: Response) => {
  const { aadhaarNumber, apaarId } = req.body;

  if (!aadhaarNumber || !/^[0-9]{12}$/.test(aadhaarNumber)) {
    return res.status(400).json({ error: 'INVALID_AADHAAR_NUMBER' });
  }

  const lastFour = aadhaarNumber.slice(-4);
  const refToken = crypto.randomUUID();
  const hmac = crypto.createHmac('sha256', 'UIDAI-SANDBOX-PEPPER').update(aadhaarNumber).digest('hex');

  res.json({
    success: true,
    referenceToken: refToken,
    aadhaarLastFour: lastFour,
    aadhaarHashHmac: hmac,
    kmsKeyId: 'HSM-UIDAI-VAULT-KEY-v1'
  });
});

app.listen(PORT, () => {
  console.log(`[GOV-SANDBOX] National Gov-API Mock Server running on port ${PORT}`);
  console.log(`[GOV-SANDBOX] Endpoints active: API Setu, DigiLocker, ABC, MeriPehchaan SSO, UIDAI Vault`);
});
