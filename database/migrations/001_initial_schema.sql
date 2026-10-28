-- ============================================================================
-- AICTE APAAR National Platform - Database Migration 001
-- Primary Relational Schema for Institutions, Students & Academic Records
-- Compliance: GIGW 3.0, Academic Bank of Credits (ABC), DEPA Framework
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS aicte_core;

-- Enable Cryptographic & UUID Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set default search path
SET search_path TO aicte_core, public;

-- ----------------------------------------------------------------------------
-- 1. INSTITUTIONS TABLE (AICTE & AISHE Registry)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS aicte_core.institutions (
    aishe_code VARCHAR(20) PRIMARY KEY, -- e.g., 'C-12345', 'U-0543'
    aicte_permanent_id VARCHAR(30) UNIQUE NOT NULL, -- e.g., '1-3324567891'
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Engineering & Technology', 'Management', 'Pharmacy', 'MCA'
    state VARCHAR(50) NOT NULL,
    district VARCHAR(100) NOT NULL,
    pincode VARCHAR(6) NOT NULL,
    nodal_officer_id VARCHAR(50) NOT NULL,
    nodal_officer_name VARCHAR(120) NOT NULL,
    nodal_officer_email VARCHAR(150) NOT NULL,
    nodal_officer_mobile VARCHAR(20) NOT NULL,
    public_key_pem TEXT NOT NULL, -- Institutional DSC RSA Public Key for batch validation
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'UNDER_AUDIT')),
    whitelisted_ip_range VARCHAR(100) DEFAULT '10.0.0.0/8,172.16.0.0/12,192.168.0.0/16',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_institutions_state ON aicte_core.institutions(state);
CREATE INDEX IF NOT EXISTS idx_institutions_aicte_id ON aicte_core.institutions(aicte_permanent_id);

-- ----------------------------------------------------------------------------
-- 2. STUDENTS TABLE (APAAR ID Registry with PII Encryption at Rest)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS aicte_core.students (
    -- APAAR ID: 12-digit unique national student ID mandated by NEP 2020 / AICTE
    apaar_id VARCHAR(12) PRIMARY KEY CHECK (apaar_id ~ '^[0-9]{12}$'),
    
    -- Field-Level Encrypted PII (AES-256-GCM ciphertext + IV + Tag)
    full_name_encrypted TEXT NOT NULL,
    full_name_masked VARCHAR(100) NOT NULL, -- e.g., 'R***h K***r'
    
    dob_encrypted TEXT NOT NULL,
    dob_masked VARCHAR(20) NOT NULL, -- e.g., '**/**/2003'
    
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'TRANSGENDER', 'OTHER')),
    
    mobile_encrypted TEXT NOT NULL,
    mobile_masked VARCHAR(20) NOT NULL, -- e.g., 'XXXXXX9821'
    
    email_encrypted TEXT NOT NULL,
    email_masked VARCHAR(150) NOT NULL, -- e.g., 'r****@gmail.com'
    
    current_aishe_code VARCHAR(20) NOT NULL REFERENCES aicte_core.institutions(aishe_code) ON DELETE RESTRICT,
    enrollment_status VARCHAR(20) NOT NULL DEFAULT 'ENROLLED' CHECK (enrollment_status IN ('ENROLLED', 'TRANSFERRED', 'GRADUATED', 'SUSPENDED')),
    
    -- Academic Bank of Credits (ABC) Unified Account
    abc_account_id VARCHAR(50) UNIQUE NOT NULL,
    
    -- Aadhaar Data Vault Reference Pointer (Strictly NO raw Aadhaar stored in primary DB)
    aadhaar_reference_token UUID UNIQUE NOT NULL,
    
    -- DPDP Act 2023 Child Consent Flags (< 18 requires verifiable parental consent)
    is_minor BOOLEAN NOT NULL DEFAULT FALSE,
    parental_consent_verified BOOLEAN NOT NULL DEFAULT FALSE,
    parent_guardian_name_encrypted TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_students_aishe ON aicte_core.students(current_aishe_code);
CREATE INDEX IF NOT EXISTS idx_students_abc ON aicte_core.students(abc_account_id);
CREATE INDEX IF NOT EXISTS idx_students_adv_token ON aicte_core.students(aadhaar_reference_token);

-- ----------------------------------------------------------------------------
-- 3. ACADEMIC RECORDS & W3C VERIFIABLE CREDENTIALS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS aicte_core.academic_records (
    record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apaar_id VARCHAR(12) NOT NULL REFERENCES aicte_core.students(apaar_id) ON DELETE RESTRICT,
    aishe_code VARCHAR(20) NOT NULL REFERENCES aicte_core.institutions(aishe_code) ON DELETE RESTRICT,
    program_name VARCHAR(150) NOT NULL, -- e.g., 'Bachelor of Technology in Computer Science & Engineering'
    department VARCHAR(100) NOT NULL,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 12),
    academic_year VARCHAR(15) NOT NULL, -- e.g., '2024-2025'
    
    -- Encrypted Academic Performance (DPDP Act Data Minimization)
    sgpa_encrypted TEXT NOT NULL,
    sgpa_masked VARCHAR(10) NOT NULL,
    cgpa_encrypted TEXT NOT NULL,
    cgpa_masked VARCHAR(10) NOT NULL,
    credits_earned NUMERIC(5,2) NOT NULL CHECK (credits_earned >= 0),
    total_credits_accumulated NUMERIC(6,2) NOT NULL CHECK (total_credits_accumulated >= 0),
    
    -- Normalized transcript subjects in structured JSONB
    transcript_payload_encrypted TEXT NOT NULL, -- Encrypted JSON list of course codes, credits, and grades
    
    -- National Repositories (DigiLocker & ABC)
    digilocker_uri VARCHAR(255) UNIQUE, -- e.g., 'in.gov.aicte.apaar:RECORD-2024-SEM5-983271'
    abc_sync_status VARCHAR(20) NOT NULL DEFAULT 'SYNCED' CHECK (abc_sync_status IN ('PENDING', 'SYNCED', 'FAILED')),
    abc_synced_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Cryptographic Proof & Integrity Hashes
    record_hash_sha256 CHAR(64) NOT NULL, -- Deterministic SHA-256 of canonical transcript
    w3c_verifiable_credential JSONB NOT NULL, -- Complete W3C VC JSON-LD payload with cryptographic proof
    issuer_digital_signature TEXT NOT NULL, -- Signed by Institution Nodal Officer DSC
    platform_signature TEXT NOT NULL, -- Signed by AICTE Platform Root Key
    
    status VARCHAR(20) NOT NULL DEFAULT 'VERIFIED' CHECK (status IN ('VERIFIED', 'REVOKED', 'DISPUTED')),
    verified_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Unique constraint: A student cannot have multiple records for the same semester at the same institution
    CONSTRAINT uq_student_semester UNIQUE (apaar_id, semester, academic_year)
);

CREATE INDEX IF NOT EXISTS idx_records_apaar ON aicte_core.academic_records(apaar_id);
CREATE INDEX IF NOT EXISTS idx_records_hash ON aicte_core.academic_records(record_hash_sha256);
CREATE INDEX IF NOT EXISTS idx_records_digilocker_uri ON aicte_core.academic_records(digilocker_uri);

-- ----------------------------------------------------------------------------
-- 4. CONSENT ARTEFACTS TABLE (DEPA & DPDP Act 2023 Compliant)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS aicte_core.consent_artefacts (
    consent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apaar_id VARCHAR(12) NOT NULL REFERENCES aicte_core.students(apaar_id) ON DELETE CASCADE,
    requester_entity_id VARCHAR(100) NOT NULL, -- e.g., 'ORG-TCS-RECRUITMENT-2026' or 'AISHE-U-0123'
    requester_name VARCHAR(150) NOT NULL,
    requester_type VARCHAR(50) NOT NULL CHECK (requester_type IN ('EMPLOYER', 'INSTITUTION', 'GOVERNMENT_AGENCY', 'VERIFIER')),
    
    purpose_code VARCHAR(50) NOT NULL, -- e.g., 'EMPLOYMENT_VERIFICATION', 'TRANSFER_ADMISSION', 'SCHOLARSHIP'
    purpose_description TEXT NOT NULL,
    
    -- Granular Field Tokens Allowed: ["FULL_NAME", "ENROLLMENT_STATUS", "SGPA", "CGPA", "CREDITS_EARNED", "TRANSCRIPT_DETAILS"]
    allowed_fields JSONB NOT NULL,
    
    valid_from TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    
    status VARCHAR(20) NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'GRANTED', 'REVOKED', 'EXPIRED')),
    
    student_signature TEXT, -- Cryptographic signature generated by Student key/MeriPehchaan on consent grant
    consent_handle VARCHAR(100) UNIQUE NOT NULL,
    
    granted_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consent_apaar ON aicte_core.consent_artefacts(apaar_id);
CREATE INDEX IF NOT EXISTS idx_consent_status ON aicte_core.consent_artefacts(status);
CREATE INDEX IF NOT EXISTS idx_consent_handle ON aicte_core.consent_artefacts(consent_handle);
