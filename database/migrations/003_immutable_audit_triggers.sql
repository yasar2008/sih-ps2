-- ============================================================================
-- AICTE APAAR National Platform - Database Migration 003
-- CERT-In Compliance: 180-Day Immutable Security Audit Trail & Anti-Tamper Triggers
-- Mandatory Directive: No UPDATE or DELETE permitted on audit trail under any circumstance
-- ============================================================================

SET search_path TO aicte_core, public;

-- ----------------------------------------------------------------------------
-- 1. IMMUTABLE SECURITY AUDIT LOGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS aicte_core.security_audit_logs (
    log_id BIGSERIAL PRIMARY KEY,
    event_id UUID NOT NULL DEFAULT gen_random_uuid(),
    actor_id VARCHAR(100) NOT NULL, -- User ID, Nodal Officer AISHE, or Service Account
    actor_role VARCHAR(50) NOT NULL, -- 'STUDENT', 'INSTITUTION_NODAL', 'AICTE_SUPERADMIN', 'VERIFIER_API'
    actor_ip VARCHAR(45) NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- 'READ', 'WRITE', 'VERIFY', 'BULK_INGEST', 'CONSENT_GRANT', 'CONSENT_REVOKE', 'ADV_ACCESS'
    entity_type VARCHAR(50) NOT NULL, -- 'STUDENT', 'ACADEMIC_RECORD', 'CONSENT_ARTEFACT', 'INSTITUTION'
    entity_id VARCHAR(100) NOT NULL,
    consent_token_id UUID, -- If accessing student data, the DEPA consent token utilized
    details JSONB DEFAULT '{}'::jsonb,
    prev_log_hash CHAR(64), -- Cryptographic hash chain for log integrity verification
    record_signature CHAR(64) NOT NULL, -- SHA-256 HMAC of log payload ensuring non-repudiation
    ntp_timestamp TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp() -- High-precision monotonically increasing clock
);

CREATE INDEX IF NOT EXISTS idx_audit_event_id ON aicte_core.security_audit_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON aicte_core.security_audit_logs(actor_id, actor_role);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON aicte_core.security_audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON aicte_core.security_audit_logs(ntp_timestamp);

-- ----------------------------------------------------------------------------
-- 2. ANTI-TAMPER TRIGGER FUNCTION: STRICTLY FORBID UPDATE OR DELETE
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION aicte_core.enforce_audit_immutability()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'CERT-In & National Cyber Security Compliance Violation: Modifications (UPDATE or DELETE) to security_audit_logs are strictly prohibited by Indian law.'
    USING ERRCODE = '55000';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger for UPDATE or DELETE on security_audit_logs
DROP TRIGGER IF EXISTS trg_prevent_audit_update ON aicte_core.security_audit_logs;
CREATE TRIGGER trg_prevent_audit_update
BEFORE UPDATE OR DELETE ON aicte_core.security_audit_logs
FOR EACH ROW
EXECUTE FUNCTION aicte_core.enforce_audit_immutability();

-- Also forbid tampering on Aadhaar Vault logs
DROP TRIGGER IF EXISTS trg_prevent_vault_log_update ON aadhaar_vault_schema.vault_access_logs;
CREATE TRIGGER trg_prevent_vault_log_update
BEFORE UPDATE OR DELETE ON aadhaar_vault_schema.vault_access_logs
FOR EACH ROW
EXECUTE FUNCTION aicte_core.enforce_audit_immutability();

-- ----------------------------------------------------------------------------
-- 3. AUTOMATIC AUDIT TRIGGER ON ACADEMIC RECORDS MUTATIONS
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION aicte_core.audit_academic_records_mutation()
RETURNS TRIGGER AS $$
DECLARE
    v_actor_id VARCHAR(100);
    v_actor_role VARCHAR(50);
    v_client_ip VARCHAR(45);
    v_prev_hash CHAR(64);
    v_sig CHAR(64);
BEGIN
    -- Extract session variables or provide default fallback
    v_actor_id := coalesce(current_setting('aicte.current_actor_id', true), 'SYSTEM_WORKER');
    v_actor_role := coalesce(current_setting('aicte.current_actor_role', true), 'INSTITUTION_NODAL');
    v_client_ip := coalesce(current_setting('aicte.client_ip', true), '127.0.0.1');

    -- Compute deterministic hash of the action
    v_sig := encode(digest(TG_OP || NEW.record_id::text || NEW.record_hash_sha256 || clock_timestamp()::text, 'sha256'), 'hex');

    INSERT INTO aicte_core.security_audit_logs (
        actor_id, actor_role, actor_ip, action_type, entity_type, entity_id, details, record_signature
    ) VALUES (
        v_actor_id,
        v_actor_role,
        v_client_ip,
        TG_OP,
        'ACADEMIC_RECORD',
        NEW.record_id::text,
        jsonb_build_object(
            'apaar_id', NEW.apaar_id,
            'aishe_code', NEW.aishe_code,
            'semester', NEW.semester,
            'credits_earned', NEW.credits_earned,
            'record_hash', NEW.record_hash_sha256,
            'digilocker_uri', NEW.digilocker_uri
        ),
        v_sig
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_audit_academic_records_insert
AFTER INSERT ON aicte_core.academic_records
FOR EACH ROW
EXECUTE FUNCTION aicte_core.audit_academic_records_mutation();

-- ----------------------------------------------------------------------------
-- 4. AUTOMATIC AUDIT TRIGGER ON CONSENT ARTEFACTS STATE CHANGES
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION aicte_core.audit_consent_mutation()
RETURNS TRIGGER AS $$
DECLARE
    v_sig CHAR(64);
BEGIN
    v_sig := encode(digest('CONSENT_' || NEW.status || NEW.consent_id::text || clock_timestamp()::text, 'sha256'), 'hex');

    INSERT INTO aicte_core.security_audit_logs (
        actor_id, actor_role, actor_ip, action_type, entity_type, entity_id, consent_token_id, details, record_signature
    ) VALUES (
        NEW.apaar_id,
        'STUDENT',
        coalesce(current_setting('aicte.client_ip', true), '127.0.0.1'),
        'CONSENT_' || NEW.status,
        'CONSENT_ARTEFACT',
        NEW.consent_id::text,
        NEW.consent_id,
        jsonb_build_object(
            'requester_entity_id', NEW.requester_entity_id,
            'requester_name', NEW.requester_name,
            'purpose_code', NEW.purpose_code,
            'allowed_fields', NEW.allowed_fields,
            'valid_from', NEW.valid_from,
            'expires_at', NEW.expires_at,
            'status', NEW.status
        ),
        v_sig
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_audit_consent_mutation
AFTER INSERT OR UPDATE ON aicte_core.consent_artefacts
FOR EACH ROW
EXECUTE FUNCTION aicte_core.audit_consent_mutation();
