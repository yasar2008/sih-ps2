-- ============================================================================
-- AICTE APAAR National Platform - Database Migration 002
-- Aadhaar Data Vault (ADV) - UIDAI Circular & Aadhaar Act Compliant Isolated Schema
-- Strict Physical/Logical Isolation: Primary application tables ONLY store reference_token (UUID)
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS aadhaar_vault_schema;

SET search_path TO aadhaar_vault_schema, public;

-- ----------------------------------------------------------------------------
-- 1. AADHAAR DATA VAULT CORE TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS aadhaar_vault_schema.aadhaar_vault (
    reference_token UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Encrypted Aadhaar Number (AES-256-GCM with Dedicated HSM / KMS Master Key)
    -- Format: {"iv": "<hex>", "ciphertext": "<hex>", "tag": "<hex>", "keyVersion": 1}
    encrypted_aadhaar_payload TEXT NOT NULL,
    
    -- HSM / KMS Key Identifier for Zero-Downtime Key Rotation
    kms_key_id VARCHAR(50) NOT NULL DEFAULT 'HSM-UIDAI-VAULT-KEY-v1',
    
    -- Truncated Aadhaar Display (Only Last 4 Digits are permitted by UIDAI)
    aadhaar_last_four CHAR(4) NOT NULL CHECK (aadhaar_last_four ~ '^[0-9]{4}$'),
    
    -- Deterministic Blind Index (HMAC-SHA256 with Secret Pepper)
    -- Allows duplicate detection without ever decrypting or indexing plaintext Aadhaar
    aadhaar_hash_hmac CHAR(64) UNIQUE NOT NULL,
    
    -- Linked APAAR ID
    linked_apaar_id VARCHAR(12) NOT NULL,
    
    -- Vault Metadata & Access Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMPTZ,
    access_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_adv_hmac ON aadhaar_vault_schema.aadhaar_vault(aadhaar_hash_hmac);
CREATE INDEX IF NOT EXISTS idx_adv_apaar ON aadhaar_vault_schema.aadhaar_vault(linked_apaar_id);

-- ----------------------------------------------------------------------------
-- 2. ISOLATED VAULT ACCESS AUDIT LOG (UIDAI Mandatory Access Trail)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS aadhaar_vault_schema.vault_access_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_token UUID NOT NULL,
    accessor_service VARCHAR(100) NOT NULL, -- e.g., 'AIC-APAAR-KYC-WORKER'
    accessor_ip VARCHAR(45) NOT NULL,
    purpose VARCHAR(150) NOT NULL, -- e.g., 'MERIPEHCHAAN_AUTH_VALIDATION'
    access_type VARCHAR(20) NOT NULL CHECK (access_type IN ('TOKENIZE', 'DETOKENIZE', 'VERIFY_LAST4')),
    accessed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_adv_logs_token ON aadhaar_vault_schema.vault_access_logs(reference_token);
CREATE INDEX IF NOT EXISTS idx_adv_logs_timestamp ON aadhaar_vault_schema.vault_access_logs(accessed_at);

-- ----------------------------------------------------------------------------
-- 3. VAULT ACCESS TRIGGER: Auto-Update Last Accessed Time and Counter
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION aadhaar_vault_schema.record_vault_access()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE aadhaar_vault_schema.aadhaar_vault
    SET last_accessed_at = CURRENT_TIMESTAMP,
        access_count = access_count + 1
    WHERE reference_token = NEW.reference_token;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_vault_access_logged
AFTER INSERT ON aadhaar_vault_schema.vault_access_logs
FOR EACH ROW
EXECUTE FUNCTION aadhaar_vault_schema.record_vault_access();
