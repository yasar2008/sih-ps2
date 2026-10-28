-- ============================================================================
-- AICTE APAAR National Platform - Comprehensive Government Seed Data
-- Standard Institutions, Verified Students, Aadhaar Vault & W3C Verifiable Credentials
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SEED AICTE INSTITUTIONS
-- ----------------------------------------------------------------------------
INSERT INTO aicte_core.institutions (
    aishe_code, aicte_permanent_id, name, category, state, district, pincode,
    nodal_officer_id, nodal_officer_name, nodal_officer_email, nodal_officer_mobile,
    public_key_pem, status, whitelisted_ip_range
) VALUES
(
    'C-41584', '1-10992381', 'COEP Technological University, Pune', 'Engineering & Technology',
    'Maharashtra', 'Pune', '411005', 'NODAL-COEP-01', 'Dr. Sanjay Arvind Kamble',
    'nodal.coep@gov.in', '+919822012345',
    '-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA10qL1z7Vv3yR6s8Y1t9v
COEP_NODAL_OFFICER_OFFICIAL_DSC_RSA_PUBLIC_KEY_PEM_2026_AICTE_APPROVED
AQAB
-----END PUBLIC KEY-----',
    'ACTIVE', '10.10.0.0/16,192.168.1.0/24'
),
(
    'C-24953', '1-28118274', 'College of Engineering, Guindy (Anna University)', 'Engineering & Technology',
    'Tamil Nadu', 'Chennai', '600025', 'NODAL-CEG-02', 'Dr. S. Meenakshi Sundaram',
    'nodal.ceg@annauniv.edu.in', '+919444018273',
    '-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA38uP9a2Xb4qR7t0v1z5k
CEG_ANNA_UNIV_NODAL_OFFICER_DSC_RSA_PUBLIC_KEY_PEM_2026_AICTE_APPROVED
AQAB
-----END PUBLIC KEY-----',
    'ACTIVE', '10.20.0.0/16,172.16.0.0/16'
),
(
    'C-33827', '1-45691024', 'Veermata Jijabai Technological Institute (VJTI)', 'Engineering & Technology',
    'Maharashtra', 'Mumbai', '400019', 'NODAL-VJTI-03', 'Prof. Milind Ramesh Joshi',
    'nodal.vjti@vjti.ac.in', '+919820194857',
    '-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA49vQ1b3Yc5rS8u1w2a6l
VJTI_MUMBAI_NODAL_OFFICER_DSC_RSA_PUBLIC_KEY_PEM_2026_AICTE_APPROVED
AQAB
-----END PUBLIC KEY-----',
    'ACTIVE', '10.30.0.0/16'
),
(
    'U-0099', '1-39827110', 'Delhi Technological University (DTU)', 'Engineering & Technology',
    'Delhi', 'North West Delhi', '110042', 'NODAL-DTU-04', 'Dr. Rakesh Kumar Verma',
    'nodal.dtu@dtu.ac.in', '+919811029384',
    '-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA50wR2c4Zd6sT9v2x3b7m
DTU_DELHI_NODAL_OFFICER_DSC_RSA_PUBLIC_KEY_PEM_2026_AICTE_APPROVED
AQAB
-----END PUBLIC KEY-----',
    'ACTIVE', '10.40.0.0/16'
),
(
    'U-0570', '1-77182903', 'Jadavpur University Faculty of Engineering', 'Engineering & Technology',
    'West Bengal', 'Kolkata', '700032', 'NODAL-JU-05', 'Dr. Anirban Mukherjee',
    'nodal.ju@jadavpuruniversity.in', '+919830018274',
    '-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA61xS3d5ae7tU0w3y4c8n
JU_KOLKATA_NODAL_OFFICER_DSC_RSA_PUBLIC_KEY_PEM_2026_AICTE_APPROVED
AQAB
-----END PUBLIC KEY-----',
    'ACTIVE', '10.50.0.0/16'
)
ON CONFLICT (aishe_code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. SEED ISOLATED AADHAAR DATA VAULT (ADV)
-- ----------------------------------------------------------------------------
INSERT INTO aadhaar_vault_schema.aadhaar_vault (
    reference_token, encrypted_aadhaar_payload, kms_key_id, aadhaar_last_four, aadhaar_hash_hmac, linked_apaar_id
) VALUES
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '{"iv":"8e14f8a07c11f7c3","ciphertext":"3fa829bb09723ecaa19e34e945c2299a9b7e","tag":"5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d","keyVersion":1}',
    'HSM-UIDAI-VAULT-KEY-v1', '9812', '7e4c9359e1bfd8e48bb37e7a7604b732e49c716279f1bc413e1c6670868f705b', '908123456781'
),
(
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    '{"iv":"9f25a9b18d22a8d4","ciphertext":"4ab930cc10834fdbb20f45fa56d3300b0c8f","tag":"6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e","keyVersion":1}',
    'HSM-UIDAI-VAULT-KEY-v1', '5431', '8f5d0460f2cfe9f59cc48f8b8715c843f50d827380a2cd524f2d7781979a816c', '908123456782'
),
(
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    '{"iv":"0a36b0c29e33b9e5","ciphertext":"5bc041dd219450ecc31a56ab67e4411c1d9a","tag":"7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f","keyVersion":1}',
    'HSM-UIDAI-VAULT-KEY-v1', '7620', '9a6e1571a3dfe0a60dd59a9c9826d954a61e938491b3de635a3e889208ab927d', '908123456783'
),
(
    'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
    '{"iv":"1b47c1d30f44caf6","ciphertext":"6cd152ee320561fdd42b67bc78f5522d2e0b","tag":"8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a","keyVersion":1}',
    'HSM-UIDAI-VAULT-KEY-v1', '2309', 'ab7f2682b4eff1b71ee6ab0da937ea65b72fa495a2c4ef746b4f990319bc038e', '908123456784'
),
(
    'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
    '{"iv":"2c58d2e41055db07","ciphertext":"7de263ff431672aee53c78cd89a6633e3f1c","tag":"9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b","keyVersion":1}',
    'HSM-UIDAI-VAULT-KEY-v1', '4198', 'bc803793c50002c82ff7bc1eb048fb76c830b506b3d5fa857c50aa142acd149f', '908123456785'
)
ON CONFLICT (reference_token) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. SEED STUDENTS (APAAR ID Registry)
-- ----------------------------------------------------------------------------
INSERT INTO aicte_core.students (
    apaar_id, full_name_encrypted, full_name_masked, dob_encrypted, dob_masked,
    gender, mobile_encrypted, mobile_masked, email_encrypted, email_masked,
    current_aishe_code, enrollment_status, abc_account_id, aadhaar_reference_token,
    is_minor, parental_consent_verified
) VALUES
(
    '908123456781',
    'ENC:AES256GCM:a83b92f7c0:Aarav Rajesh Sharma', 'A***v R****h S****a',
    'ENC:AES256GCM:b94c03a8d1:2003-05-14', '**/**/2003',
    'MALE',
    'ENC:AES256GCM:c05d14b9e2:+919822184920', 'XXXXXX4920',
    'ENC:AES256GCM:d16e25c0f3:aarav.sharma.coep@gmail.com', 'a***v.s***@gmail.com',
    'C-41584', 'ENROLLED', 'ABC-IN-2023-098124', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    FALSE, FALSE
),
(
    '908123456782',
    'ENC:AES256GCM:e27f36d1a4:Priya Sundaram Iyer', 'P***a S******m I**r',
    'ENC:AES256GCM:f38a47e2b5:2004-08-22', '**/**/2004',
    'FEMALE',
    'ENC:AES256GCM:a49b58f3c6:+919444109283', 'XXXXXX9283',
    'ENC:AES256GCM:b50c69a4d7:priya.iyer@annauniv.edu.in', 'p***a.i***@annauniv.edu.in',
    'C-24953', 'ENROLLED', 'ABC-IN-2023-098125', 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    FALSE, FALSE
),
(
    '908123456783',
    'ENC:AES256GCM:c61d70b5e8:Rohan Amit Deshmukh', 'R***n A***t D******h',
    'ENC:AES256GCM:d72e81c6f9:2003-11-09', '**/**/2003',
    'MALE',
    'ENC:AES256GCM:e83f92d7a0:+919820491823', 'XXXXXX1823',
    'ENC:AES256GCM:f94a03e8b1:rohan.deshmukh@vjti.ac.in', 'r***n.d***@vjti.ac.in',
    'C-33827', 'ENROLLED', 'ABC-IN-2023-098126', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    FALSE, FALSE
),
(
    '908123456784',
    'ENC:AES256GCM:a05b14f9c2:Ananya Vikram Patel', 'A****a V****m P***l',
    'ENC:AES256GCM:b16c25a0d3:2004-03-30', '**/**/2004',
    'FEMALE',
    'ENC:AES256GCM:c27d36b1e4:+919811827364', 'XXXXXX7364',
    'ENC:AES256GCM:d38e47c2f5:ananya.patel@dtu.ac.in', 'a****a.p***@dtu.ac.in',
    'U-0099', 'ENROLLED', 'ABC-IN-2023-098127', 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
    FALSE, FALSE
),
(
    '908123456785',
    'ENC:AES256GCM:e49f58d3a6:Debabrata Subhas Sengupta', 'D*******a S****s S******a',
    'ENC:AES256GCM:f50a69e4b7:2003-12-18', '**/**/2003',
    'MALE',
    'ENC:AES256GCM:a61b70f5c8:+919830918273', 'XXXXXX8273',
    'ENC:AES256GCM:b72c81a6d9:debabrata.ju@jadavpur.edu', 'd*******a.j***@jadavpur.edu',
    'U-0570', 'ENROLLED', 'ABC-IN-2023-098128', 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
    FALSE, FALSE
)
ON CONFLICT (apaar_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. SEED ACADEMIC TRANSCRIPTS & W3C VERIFIABLE CREDENTIALS
-- ----------------------------------------------------------------------------
INSERT INTO aicte_core.academic_records (
    record_id, apaar_id, aishe_code, program_name, department, semester, academic_year,
    sgpa_encrypted, sgpa_masked, cgpa_encrypted, cgpa_masked,
    credits_earned, total_credits_accumulated,
    transcript_payload_encrypted,
    digilocker_uri, abc_sync_status,
    record_hash_sha256,
    w3c_verifiable_credential,
    issuer_digital_signature, platform_signature, status
) VALUES
(
    'f1e2d3c4-b5a6-9788-1234-567890abcdef',
    '908123456781', 'C-41584',
    'Bachelor of Technology in Computer Engineering', 'Computer Engineering',
    5, '2024-2025',
    'ENC:AES256GCM:8.92', '8.92',
    'ENC:AES256GCM:8.84', '8.84',
    22.00, 110.00,
    'ENC:AES256GCM:[{"code":"CS501","title":"Distributed Systems","credits":4,"grade":"AA"},{"code":"CS502","title":"Compiler Design","credits":4,"grade":"AB"},{"code":"CS503","title":"Cryptography & Network Security","credits":4,"grade":"AA"},{"code":"CS504","title":"Machine Learning","credits":4,"grade":"AA"},{"code":"CS505","title":"Cloud Computing Lab","credits":2,"grade":"AA"},{"code":"CS506","title":"Minor Project","credits":4,"grade":"AA"}]',
    'in.gov.aicte.apaar:RECORD-2024-SEM5-COEP-908123456781',
    'SYNCED',
    'a94f6e1f0e2193b2a3165b4528c1f016d9b9c9f056d6d8495a6bfa9e1d8a43f8',
    '{
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://schema.org",
        "https://apaar.aicte-india.gov.in/contexts/v1"
      ],
      "id": "urn:uuid:f1e2d3c4-b5a6-9788-1234-567890abcdef",
      "type": ["VerifiableCredential", "AICTEAcademicCredential"],
      "issuer": "did:gov:in:aicte:institution:C-41584",
      "issuanceDate": "2025-01-15T10:30:00Z",
      "credentialSubject": {
        "id": "did:gov:in:apaar:908123456781",
        "institution": "COEP Technological University, Pune",
        "program": "Bachelor of Technology in Computer Engineering",
        "semester": 5,
        "academicYear": "2024-2025",
        "sgpa": "8.92",
        "cgpa": "8.84",
        "creditsEarned": 22.0,
        "totalCreditsAccumulated": 110.0,
        "abcAccountId": "ABC-IN-2023-098124"
      },
      "proof": {
        "type": "RsaSignature2018",
        "created": "2025-01-15T10:30:00Z",
        "proofPurpose": "assertionMethod",
        "verificationMethod": "did:gov:in:aicte:institution:C-41584#key-1",
        "jws": "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsic2siXX0...COEP_NODAL_SIGNATURE_JWS"
      }
    }'::jsonb,
    'COEP_NODAL_OFFICER_DSC_RSA_SHA256_SIGNATURE_BASE64==',
    'AICTE_ROOT_HSM_SIGNATURE_2026_AUTHORITY_BASE64==',
    'VERIFIED'
),
(
    'f2e3d4c5-b6a7-9899-2345-678901bcdefa',
    '908123456781', 'C-41584',
    'Bachelor of Technology in Computer Engineering', 'Computer Engineering',
    4, '2023-2024',
    'ENC:AES256GCM:8.75', '8.75',
    'ENC:AES256GCM:8.80', '8.80',
    22.00, 88.00,
    'ENC:AES256GCM:[{"code":"CS401","title":"Database Management Systems","credits":4,"grade":"AA"},{"code":"CS402","title":"Operating Systems","credits":4,"grade":"AB"}]',
    'in.gov.aicte.apaar:RECORD-2024-SEM4-COEP-908123456781',
    'SYNCED',
    'b85e5d0e1f3282a1b2054a3417b0e905c8a8b8e945c5c738495aeb8d0c7b32e7',
    '{
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      "id": "urn:uuid:f2e3d4c5-b6a7-9899-2345-678901bcdefa",
      "type": ["VerifiableCredential", "AICTEAcademicCredential"],
      "issuer": "did:gov:in:aicte:institution:C-41584",
      "issuanceDate": "2024-06-20T10:30:00Z",
      "credentialSubject": {
        "id": "did:gov:in:apaar:908123456781",
        "semester": 4,
        "sgpa": "8.75",
        "cgpa": "8.80",
        "creditsEarned": 22.0
      }
    }'::jsonb,
    'COEP_NODAL_OFFICER_DSC_RSA_SHA256_SIGNATURE_BASE64==',
    'AICTE_ROOT_HSM_SIGNATURE_2026_AUTHORITY_BASE64==',
    'VERIFIED'
),
(
    'f3e4d5c6-b7a8-9900-3456-789012cdefab',
    '908123456782', 'C-24953',
    'Bachelor of Technology in Electrical & Electronics Engineering', 'EEE',
    4, '2023-2024',
    'ENC:AES256GCM:9.40', '9.40',
    'ENC:AES256GCM:9.32', '9.32',
    24.00, 96.00,
    'ENC:AES256GCM:[{"code":"EE401","title":"Power Systems Analysis","credits":4,"grade":"O"},{"code":"EE402","title":"Control Systems Engineering","credits":4,"grade":"A+"}]',
    'in.gov.aicte.apaar:RECORD-2024-SEM4-CEG-908123456782',
    'SYNCED',
    'c96f6e1f2a4393b2c3165b4528c1f016d9b9c9f056d6d8495a6bfa9e1d8a43f9',
    '{
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      "id": "urn:uuid:f3e4d5c6-b7a8-9900-3456-789012cdefab",
      "type": ["VerifiableCredential", "AICTEAcademicCredential"],
      "issuer": "did:gov:in:aicte:institution:C-24953",
      "issuanceDate": "2024-07-10T11:00:00Z",
      "credentialSubject": {
        "id": "did:gov:in:apaar:908123456782",
        "semester": 4,
        "sgpa": "9.40",
        "cgpa": "9.32",
        "creditsEarned": 24.0
      }
    }'::jsonb,
    'CEG_NODAL_OFFICER_DSC_RSA_SHA256_SIGNATURE_BASE64==',
    'AICTE_ROOT_HSM_SIGNATURE_2026_AUTHORITY_BASE64==',
    'VERIFIED'
)
ON CONFLICT (record_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. SEED DEPA CONSENT ARTEFACTS
-- ----------------------------------------------------------------------------
INSERT INTO aicte_core.consent_artefacts (
    consent_id, apaar_id, requester_entity_id, requester_name, requester_type,
    purpose_code, purpose_description, allowed_fields,
    valid_from, expires_at, status, consent_handle, granted_at
) VALUES
(
    '0a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
    '908123456781',
    'ORG-TCS-RECRUITMENT-2026',
    'Tata Consultancy Services - Campus Hiring Cell',
    'EMPLOYER',
    'EMPLOYMENT_VERIFICATION',
    'Verification of CGPA, SGPA, and graduation eligibility for National Qualifier Test (NQT) onboarding.',
    '["FULL_NAME", "ENROLLMENT_STATUS", "CGPA", "SGPA", "TOTAL_CREDITS"]'::jsonb,
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    CURRENT_TIMESTAMP + INTERVAL '28 days',
    'GRANTED',
    'CONSENT-HANDLE-TCS-908123456781-2026',
    CURRENT_TIMESTAMP - INTERVAL '2 days'
),
(
    '1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
    '908123456781',
    'AISHE-U-0099',
    'Delhi Technological University - Post-Graduate Admissions',
    'INSTITUTION',
    'TRANSFER_ADMISSION',
    'Evaluation of credit accumulation for inter-university lateral transfer and M.Tech fellowship.',
    '["FULL_NAME", "ENROLLMENT_STATUS", "TRANSCRIPT_DETAILS", "CREDITS_EARNED"]'::jsonb,
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP + INTERVAL '14 days',
    'REQUESTED',
    'CONSENT-HANDLE-DTU-908123456781-2026',
    NULL
)
ON CONFLICT (consent_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 6. SEED ANOMALY ALERT (Demonstrating National AICTE Sentinel)
-- ----------------------------------------------------------------------------
INSERT INTO aicte_core.anomaly_alerts (
    alert_id, alert_type, severity, apaar_id, aishe_code, description, evidence_payload, status
) VALUES
(
    '99887766-5544-3322-1100-aabbccddeeff',
    'DUPLICATE_ENROLLMENT',
    'HIGH',
    '908123456783',
    'C-33827',
    'Automated Sentinel detected concurrent active regular semester enrollment attempt for APAAR 908123456783 across two distinct AICTE institutions (VJTI Mumbai and University of Pune).',
    '{"conflicting_institutions": ["C-33827", "U-0312"], "detected_at": "2026-03-12T09:15:00Z", "action_recommended": "Hold Semester 5 batch validation until Migration Certificate is uploaded."}'::jsonb,
    'ACTIVE'
)
ON CONFLICT (alert_id) DO NOTHING;
