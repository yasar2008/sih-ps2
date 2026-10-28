#!/bin/bash
set -e

# ============================================================================
# AICTE APAAR Database Initialization Script (UIDAI & CERT-In Compliant)
# ============================================================================

echo "[AICTE-INIT] Initializing AICTE APAAR National Database & Aadhaar Data Vault..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create Dedicated Isolated User for Aadhaar Data Vault Service
    CREATE USER adv_vault_user WITH ENCRYPTED PASSWORD 'AdvHsmSecurePass2026!';
EOSQL

echo "[AICTE-INIT] Applying Migrations..."
for f in /docker-entrypoint-initdb.d/migrations/*.sql; do
    echo "[AICTE-INIT] Running migration: $f"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$f"
done

echo "[AICTE-INIT] Applying Isolation Grants on Aadhaar Data Vault Schema..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Grant exclusive access to Aadhaar Data Vault for adv_vault_user
    GRANT USAGE ON SCHEMA aadhaar_vault_schema TO adv_vault_user;
    GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA aadhaar_vault_schema TO adv_vault_user;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA aadhaar_vault_schema TO adv_vault_user;

    -- Revoke direct permissions on aadhaar_vault from standard application user
    REVOKE ALL ON SCHEMA aadhaar_vault_schema FROM PUBLIC;
    REVOKE ALL ON ALL TABLES IN SCHEMA aadhaar_vault_schema FROM PUBLIC;
    REVOKE ALL ON TABLE aadhaar_vault_schema.aadhaar_vault FROM aicte_admin;

    -- Grant aicte_admin full access only to primary aicte_core schema
    GRANT USAGE ON SCHEMA aicte_core TO aicte_admin;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA aicte_core TO aicte_admin;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA aicte_core TO aicte_admin;
EOSQL

echo "[AICTE-INIT] Loading Seed Data..."
for s in /docker-entrypoint-initdb.d/seeds/*.sql; do
    echo "[AICTE-INIT] Running seed file: $s"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$s"
done

echo "[AICTE-INIT] Database Initialization and UIDAI Schema Isolation Complete!"
