// AICTE APAAR National Portal - Bilingual i18n Dictionary (English & Hindi)
// Compliant with Bhashini API National Language Translation Standard

export const translations = {
  en: {
    // Top Bar
    govIndia: 'Government of India',
    ministryEdu: 'Ministry of Education',
    aicteFull: 'All India Council for Technical Education',
    skipContent: 'Skip to Main Content',
    screenReader: 'Screen Reader Access',
    fontSize: 'Text Size',
    contrast: 'Contrast',
    normal: 'Normal',
    highContrast: 'High Contrast',
    dark: 'Dark',
    language: 'Language',

    // Brand
    portalTitle: 'APAAR Digital Credential & Verification Platform',
    portalSub: 'One Nation, One Student ID (Automated Permanent Academic Account Registry)',

    // Navigation Tabs
    tabVerifier: 'Public Instant Verifier',
    tabStudent: 'Student Portal & APAAR Card',
    tabInstitution: 'Institution Nodal Officer',
    tabAdmin: 'AICTE National Directorate',

    // Public Verifier
    verifierHeader: 'Zero-Red-Tape Instant Credential Verification Engine',
    verifierSub: 'Sub-200ms cryptographic validation of AICTE academic transcripts and W3C Verifiable Credentials.',
    apaarInputLabel: 'Student 12-Digit APAAR ID',
    recordIdInputLabel: 'Academic Record UUID / Credential ID',
    orPasteQr: 'Or Paste Signed W3C JSON-LD / Scanned QR Payload',
    verifyNowBtn: 'Verify Credential Cryptographically',
    benchmarkingNote: 'Target SLA: Verification completes in < 200ms using stored canonical SHA-256 hash comparison.',
    
    // Status
    statusValid: 'VALID & CERTIFIED',
    statusTampered: 'TAMPER DETECTED',
    statusRevoked: 'CREDENTIAL REVOKED',
    statusConsentDenied: 'DEPA CONSENT REQUIRED',
    statusNotFound: 'RECORD NOT FOUND',

    // Verification Result Details
    cryptographicProof: 'Cryptographic Integrity Proof',
    storedHash: 'Stored Canonical Transcript Hash (SHA-256)',
    recomputedHash: 'Recomputed Canonical Transcript Hash',
    hashMatched: 'Cryptographic Match Confirmed',
    hsmSignature: 'AICTE Platform Root HSM Signature',
    institutionalDsc: 'Institution Nodal Officer DSC Signature',
    w3cFormat: 'W3C Verifiable Credential 1.0 JSON-LD',
    digilockerNad: 'DigiLocker NAD Status',
    abcSync: 'Academic Bank of Credits (ABC) Status',
    verifiedAt: 'Time of Verification',
    executionTime: 'Latency Benchmark',
    confidentialNotice: 'Grade transcript is protected under DPDP Act 2023. Real-time DEPA consent required to decrypt.',

    // Student Portal
    studentPortalTitle: 'Student Academic Timeline & APAAR Card',
    studentLoginVia: 'National SSO Login via MeriPehchaan (Jan Parichay)',
    enterApaar: 'Enter 12-Digit APAAR ID',
    sendOtp: 'Request SSO OTP',
    verifyOtp: 'Verify & Login',
    academicJourney: 'Unified Academic Timeline',
    accumulatedCredits: 'Total Accumulated Credits (ABC)',
    downloadCard: 'Download Official APAAR Card',
    consentDashboard: 'DEPA Consent Manager (DPDP Act 2023)',
    pendingRequests: 'Incoming Third-Party Data Requests',
    grantBtn: 'Approve & e-Sign',
    revokeBtn: 'Revoke Access',

    // Institution Portal
    institutionPortalTitle: 'Institution Nodal Officer Bulk Pipeline & Migration',
    bulkUploadTitle: '4-Stage Automated Bulk Transcript Verification Pipeline',
    stage1: 'Stage 1: Institutional DSC Digital Signature Validation',
    stage2: 'Stage 2: 12-Digit APAAR & API Setu Demographic Verification',
    stage3: 'Stage 3: Canonical SHA-256 Hashing & W3C Credential Sealing',
    stage4: 'Stage 4: DigiLocker Registry & Academic Bank of Credits Push',
    selectBatch: 'Upload Institution Semester Batch (JSON)',
    runPipelineBtn: 'Sign with DSC & Execute Verification Pipeline',
    migrationTab: 'Inter-College Student Transfer Handler',
    initiateMigration: 'Initiate Transfer via APAAR ID',
    activeTransfers: 'Active Inter-College Migration Requests',

    // AICTE Admin
    adminTitle: 'AICTE National Directorate - Command Sentinel',
    nationalSummary: 'National Infrastructure Health & Enrollment Analytics',
    stateMetrics: 'State-wise AICTE Technical Enrollment Heatmap',
    anomalyTitle: 'National Sentinel Anomaly & Fraud Detection Engine',
    auditTrailTitle: 'CERT-In 180-Day Immutable Security Audit Stream',
    verifyAuditChain: 'Audit Chain Cryptographic Integrity',

    // Footer
    copyright: '© 2026 All India Council for Technical Education (AICTE). All Rights Reserved.',
    hostedOn: 'Hosted on MeghRaj (Government of India GI Cloud) | CERT-In & GIGW 3.0 Certified'
  },
  hi: {
    // Top Bar
    govIndia: 'भारत सरकार',
    ministryEdu: 'शिक्षा मंत्रालय',
    aicteFull: 'अखिल भारतीय तकनीकी शिक्षा परिषद',
    skipContent: 'मुख्य सामग्री पर जाएं',
    screenReader: 'स्क्रीन रीडर एक्सेस',
    fontSize: 'फ़ॉन्ट आकार',
    contrast: 'कंट्रास्ट',
    normal: 'सामान्य',
    highContrast: 'उच्च कंट्रास्ट',
    dark: 'डार्क मोड',
    language: 'भाषा',

    // Brand
    portalTitle: 'अपार (APAAR) डिजिटल प्रमाण पत्र एवं सत्यापन पोर्टल',
    portalSub: 'एक राष्ट्र, एक छात्र पहचान पत्र (स्वचालित स्थायी शैक्षणिक खाता रजिस्ट्री)',

    // Navigation Tabs
    tabVerifier: 'सार्वजनिक त्वरित सत्यापन',
    tabStudent: 'छात्र पोर्टल एवं अपार कार्ड',
    tabInstitution: 'संस्थान नोडल अधिकारी',
    tabAdmin: 'एआईसीटीई राष्ट्रीय निदेशालय',

    // Public Verifier
    verifierHeader: 'शून्य-लालफीताशाही त्वरित प्रमाण पत्र सत्यापन इंजन',
    verifierSub: 'एआईसीटीई शैक्षणिक ट्रांसक्रिप्ट एवं W3C सत्यापन योग्य क्रेडेंशियल का 200ms से कम समय में क्रिप्टोग्राफिक सत्यापन।',
    apaarInputLabel: 'छात्र का 12-अंकीय अपार (APAAR) आईडी',
    recordIdInputLabel: 'शैक्षणिक रिकॉर्ड यूयूआईडी / क्रेडेंशियल आईडी',
    orPasteQr: 'अथवा हस्ताक्षरित W3C JSON-LD / क्यूआर पेलोड पेस्ट करें',
    verifyNowBtn: 'क्रिप्टोग्राफिक रूप से क्रेडेंशियल सत्यापित करें',
    benchmarkingNote: 'लक्ष्य मानक: संग्रहीत कैनोनिकल SHA-256 हैश मिलान के माध्यम से <200ms में सत्यापन पूर्ण होता है।',

    // Status
    statusValid: 'प्रमाणित एवं वैध',
    statusTampered: 'छेड़छाड़ का पता चला',
    statusRevoked: 'प्रमाण पत्र रद्द कर दिया गया',
    statusConsentDenied: 'डीईपीए (DEPA) सहमति आवश्यक',
    statusNotFound: 'रिकॉर्ड नहीं मिला',

    // Verification Result Details
    cryptographicProof: 'क्रिप्टोग्राफिक अखंडता प्रमाण',
    storedHash: 'संग्रहीत कैनोनिकल ट्रांसक्रिप्ट हैश (SHA-256)',
    recomputedHash: 'पुनर्गणित कैनोनिकल ट्रांसक्रिप्ट हैश',
    hashMatched: 'क्रिप्टोग्राफिक मिलान की पुष्टि हुई',
    hsmSignature: 'एआईसीटीई प्लेटफॉर्म रूट एचएसएम हस्ताक्षर',
    institutionalDsc: 'संस्थान नोडल अधिकारी डीएससी हस्ताक्षर',
    w3cFormat: 'W3C सत्यापन योग्य क्रेडेंशियल 1.0 JSON-LD',
    digilockerNad: 'डिजिलॉकर (NAD) स्थिति',
    abcSync: 'एकेडमिक बैंक ऑफ क्रेडिट्स (ABC) स्थिति',
    verifiedAt: 'सत्यापन का समय',
    executionTime: 'विलंबता मानक',
    confidentialNotice: 'ग्रेड ट्रांसक्रिप्ट DPDP अधिनियम 2023 के तहत सुरक्षित है। देखने के लिए छात्र की सहमति आवश्यक है।',

    // Student Portal
    studentPortalTitle: 'छात्र शैक्षणिक समयरेखा एवं अपार कार्ड',
    studentLoginVia: 'मेरीपहचान (जन परिचय) राष्ट्रीय एसएसओ द्वारा लॉगिन',
    enterApaar: '12-अंकीय अपार आईडी दर्ज करें',
    sendOtp: 'एसएसओ ओटीपी प्राप्त करें',
    verifyOtp: 'सत्यापित करें एवं लॉगिन करें',
    academicJourney: 'एकीकृत शैक्षणिक समयरेखा',
    accumulatedCredits: 'कुल संचित क्रेडिट (ABC)',
    downloadCard: 'आधिकारिक अपार कार्ड डाउनलोड करें',
    consentDashboard: 'डीईपीए सहमति प्रबंधक (DPDP अधिनियम 2023)',
    pendingRequests: 'आने वाले तीसरे पक्ष के डेटा अनुरोध',
    grantBtn: 'अनुमोदन एवं ई-हस्ताक्षर करें',
    revokeBtn: 'पहुंच तुरंत रद्द करें',

    // Institution Portal
    institutionPortalTitle: 'संस्थान नोडल अधिकारी बल्क पाइपलाइन एवं स्थानांतरण',
    bulkUploadTitle: '4-चरणीय स्वचालित बल्क ट्रांसक्रिप्ट सत्यापन पाइपलाइन',
    stage1: 'चरण 1: संस्थान नोडल अधिकारी डीएससी डिजिटल हस्ताक्षर सत्यापन',
    stage2: 'चरण 2: 12-अंकीय अपार एवं एपीआई सेतु जनसांख्यिकीय सत्यापन',
    stage3: 'चरण 3: कैनोनिकल SHA-256 हैशिंग एवं W3C क्रेडेंशियल सीलिंग',
    stage4: 'चरण 4: डिजिलॉकर रजिस्ट्री एवं एकेडमिक बैंक ऑफ क्रेडिट्स पुश',
    selectBatch: 'संस्थान सेमेस्टर बैच फ़ाइल (JSON) अपलोड करें',
    runPipelineBtn: 'डीएससी से हस्ताक्षर करें एवं सत्यापन पाइपलाइन निष्पादित करें',
    migrationTab: 'कॉलेज-से-कॉलेज छात्र स्थानांतरण हैंडलर',
    initiateMigration: 'अपार आईडी द्वारा स्थानांतरण आरंभ करें',
    activeTransfers: 'सक्रिय अंतर-कॉलेज स्थानांतरण अनुरोध',

    // AICTE Admin
    adminTitle: 'एआईसीटीई राष्ट्रीय निदेशालय - कमांड सेंटिनल',
    nationalSummary: 'राष्ट्रीय अवसंरचना स्वास्थ्य एवं नामांकन विश्लेषण',
    stateMetrics: 'राज्यवार एआईसीटीई तकनीकी नामांकन हीटमैप',
    anomalyTitle: 'राष्ट्रीय सेंटिनल विसंगति एवं धोखाधड़ी पहचान इंजन',
    auditTrailTitle: 'CERT-In 180-दिवसीय अपरिवर्तनीय सुरक्षा ऑडिट स्ट्रीम',
    verifyAuditChain: 'ऑडिट श्रृंखला क्रिप्टोग्राफिक अखंडता',

    // Footer
    copyright: '© 2026 अखिल भारतीय तकनीकी शिक्षा परिषद (AICTE)। सर्वाधिकार सुरक्षित।',
    hostedOn: 'मेघराज (भारत सरकार जीआई क्लाउड) पर होस्ट किया गया | CERT-In एवं GIGW 3.0 प्रमाणित'
  }
};
