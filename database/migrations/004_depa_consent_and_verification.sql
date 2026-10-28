-- ============================================================================
-- AICTE APAAR National Platform - Database Migration 004
-- Real-time DEPA Verification Engine & Inter-College Credit Mobility Schema
-- ============================================================================

SET search_path TO aicte_core, public;

-- ----------------------------------------------------------------------------
-- 1. CREDENTIAL VERIFICATION EVENTS (Sub-200ms Instant Auditing)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS aicte_core.credential_verification_events (
    verification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id UUID REFERENCES aicte_core.academic_records(record_id),
    apaar_id VARCHAR(12) NOT NULL,
    verifier_type VARCHAR(50) NOT NULL CHECK (verifier_type IN ('PUBLIC_QR_SCAN', 'EMPLOYER_API', 'INSTITUTION_TRANSFER', 'GOV_PORTAL')),
    verifier_identity VARCHAR(150) NOT NULL, -- Name or Entity ID of verifier
    verifier_ip VARCHAR(45) NOT NULL,
    result_status VARCHAR(20) NOT NULL CHECK (result_status IN ('VALID', 'TAMPERED', 'REVOKED', 'CONSENT_DENIED', 'RECORD_NOT_FOUND')),
    latency_ms NUMERIC(6,2) NOT NULL, -- Sub-200ms benchmark tracking
    consent_id UUID REFERENCES aicte_core.consent_artefacts(consent_id),
    verified_hash CHAR(64),
    payload_snapshot JSONB,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX IF NOT EXISTS idx_verify_apaar ON aicte_core.credential_verification_events(apaar_id);
CREATE INDEX IF NOT EXISTS idx_verify_status ON aicte_core.credential_verification_events(result_status);
CREATE INDEX IF NOT EXISTS idx_verify_timestamp ON aicte_core.credential_verification_events(verified_at);

-- ----------------------------------------------------------------------------
-- 2. INTER-COLLEGE STUDENT MIGRATION & CREDIT TRANSFER
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS aicte_core.student_transfers (
    transfer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apaar_id VARCHAR(12) NOT NULL REFERENCES aicte_core.students(apaar_id),
    from_aishe_code VARCHAR(20) NOT NULL REFERENCES aicte_core.institutions(aishe_code),
    to_aishe_code VARCHAR(20) NOT NULL REFERENCES aicte_core.institutions(aishe_code),
    program_name VARCHAR(150) NOT NULL,
    target_semester INT NOT NULL CHECK (target_semester BETWEEN 2 AND 12),
    credits_transferred NUMERIC(5,2) NOT NULL CHECK (credits_transferred >= 0),
    noc_document_hash CHAR(64) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'INITIATED' CHECK (status IN ('INITIATED', 'APPROVED_BY_SOURCE', 'APPROVED_BY_TARGET', 'COMPLETED', 'REJECTED')),
    source_nodal_signature TEXT,
    target_nodal_signature TEXT,
    initiated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_transfers_apaar ON aicte_core.student_transfers(apaar_id);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON aicte_core.student_transfers(status);

-- ----------------------------------------------------------------------------
-- 3. ANOMALY DETECTION ALERTS (AICTE National Sentinel)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS aicte_core.anomaly_alerts (
    alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('DUPLICATE_ENROLLMENT', 'TAMPERED_CREDENTIAL', 'ABNORMAL_CREDIT_VELOCITY', 'UNAUTHORIZED_BULK_ACCESS')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    apaar_id VARCHAR(12),
    aishe_code VARCHAR(20),
    description TEXT NOT NULL,
    evidence_payload JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE')),
    detected_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_anomaly_severity ON aicte_core.anomaly_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_anomaly_status ON aicte_core.anomaly_alerts(status);
