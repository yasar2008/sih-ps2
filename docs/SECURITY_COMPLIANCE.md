# National Government Enterprise Security & Architecture Compliance
## AICTE APAAR Student Data Management & Verification Platform
**Document Reference:** AICTE-APAAR-SEC-2026-V1  
**Target Environment:** MeghRaj (Government of India GI Cloud)  
**Regulatory Standards:** GIGW 3.0, Digital Brand Identity Manual (DBIM), DPDP Act 2023, UIDAI Aadhaar Regulations, and CERT-In Directives.

---

## 1. Executive Summary & Architectural Overview
The **AICTE APAAR National Platform** is an enterprise-grade digital public infrastructure designed to unify, manage, and cryptographically verify academic records across 11,000+ AICTE-approved institutions in India.

```
                           [ Indian Citizen / Institution / Employer ]
                                                │
                                                ▼
                   ┌─────────────────────────────────────────────────────────┐
                   │    NGINX Government API Gateway (CERT-In Hardened)      │
                   │  - Rate Limiting (Token Bucket: 5-60 req/min)           │
                   │  - Strict CSP, HSTS (2-Year Max-Age), Non-Leaking 404/500│
                   │  - Institutional Whitelisted IP CIDR Enforcement        │
                   │  - Payload Ceiling: 50MB (DSC Bulk), 2MB (Default)      │
                   └────────────────────────────┬────────────────────────────┘
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 ▼                                                             ▼
  ┌──────────────────────────────┐                              ┌──────────────────────────────┐
  │  GIGW 3.0 Compliant Frontend │                              │   Backend Core Microservice  │
  │  - Tricolor Top Utility Bar  │                              │  - Node.js 20 & TypeScript   │
  │  - Font Scaler (A-, A, A+)   │                              │  - 15-min HttpOnly Secure JWT│
  │  - High-Contrast Theme       │                              │  - Zero-Trust RBAC & ABAC    │
  │  - Bhashini i18n (EN/HI)     │                              │  - DEPA Consent Engine       │
  │  - 4 Role-Based Portals      │                              │  - Sub-200ms Verify Engine   │
  └──────────────────────────────┘                              └──────────────┬───────────────┘
                                                                               │
                ┌──────────────────────────────────────────────────────────────┴───────────────┐
                ▼                                                                              ▼
┌───────────────────────────────────────────────┐                             ┌───────────────────────────────────┐
│ Primary Relational Store: `aicte_core`        │                             │ Aadhaar Data Vault (ADV) Isolated │
│ - `institutions` (AISHE, DSC Public Keys)     │                             │ Schema: `aadhaar_vault_schema`    │
│ - `students` (12-Digit APAAR, AES-256 PII)   │                             │ - Encrypted Aadhaar Payload (AES) │
│ - `academic_records` (SHA-256 Transcript Hash)│                             │ - Blind Index (HMAC-SHA256 Pepper)│
│ - `consent_artefacts` (DEPA Granular Grants)  │                             │ - UUID Reference Token Mapping    │
│ - `security_audit_logs` (CERT-In Immutable)   │                             │ - Exclusive Isolated DB User      │
└───────────────────────────────────────────────┘                             └───────────────────────────────────┘
```

---

## 2. CERT-In Cyber Security Guidelines Compliance Matrix

| Requirement | Statutory Mandate | Implementation in Codebase | Compliance Status |
| :--- | :--- | :--- | :--- |
| **180-Day Immutable Logs** | CERT-In Directive No. 20(3)/2022-CERT-In | `aicte_core.security_audit_logs` with PostgreSQL Trigger `enforce_audit_immutability()` strictly blocking `UPDATE` and `DELETE`. | **FULLY COMPLIANT** |
| **NTP Synchronized Time** | Indian Standard Time (IST) / NTP sync | `ntp_timestamp TIMESTAMPTZ DEFAULT clock_timestamp()` recorded on every security event. | **FULLY COMPLIANT** |
| **Log Integrity & Chaining** | Non-repudiation of event logs | `prev_log_hash` and `record_signature` (HMAC-SHA256) cryptographically chain all events. | **FULLY COMPLIANT** |
| **Server Obfuscation** | OWASP & CERT-In Securing Web Servers | `server_tokens off;` in NGINX, `X-Powered-By` stripped via Helmet, generic error handlers. | **FULLY COMPLIANT** |
| **Strict Error Sanitization** | Non-leaking exception handling | Express custom error middleware suppresses internal stack traces and outputs generic ticket IDs. | **FULLY COMPLIANT** |
| **Rate Limiting & Anti-DoS** | Protection against brute-force | NGINX rate-limiting zones (`auth_limit: 5r/m`, `public_verify_limit: 15r/m`). | **FULLY COMPLIANT** |

---

## 3. DPDP Act 2023 (Digital Personal Data Protection Act) Compliance Matrix

| Requirement | Section of DPDP Act 2023 | Implementation in Codebase |
| :--- | :--- | :--- |
| **Field-Level Encryption at Rest** | Section 8(5) (Security Safeguards) | All sensitive PII columns (`full_name`, `dob`, `mobile`, `email`, `sgpa`, `cgpa`) encrypted with `AES-256-GCM` using HSM/KMS keys before DB write. |
| **Data Masking in APIs** | Data Minimization Principle | APIs default to masked values (`XXXX-XXXX-8912`, `A***v S****a`, `**/**/2003`) unless elevated consent or self-access applies. |
| **DEPA Consent Architecture** | Section 6 (Consent Manager) | `aicte_core.consent_artefacts` table with granular field permissions, purpose codes, and validity dates. |
| **Right to Withdraw Consent** | Section 6(4) (Revocation) | Endpoint `POST /api/v1/consent/:consentId/revoke` terminates third-party access instantaneously. |
| **Child Consent Safeguards** | Section 9 (Processing of Children's Data) | `is_minor` and `parental_consent_verified` flags checked; access gated if student is under 18. |

---

## 4. UIDAI Aadhaar Data Vault (ADV) Regulatory Compliance

Per UIDAI Circulars (Ref: F. No. 11020/205/2017-UIDAI):
1. **Physical/Logical Schema Isolation:** Aadhaar numbers are isolated inside `aadhaar_vault_schema.aadhaar_vault`. The primary application database tables (`students`, `academic_records`) **NEVER** store 12-digit Aadhaar numbers.
2. **UUID Reference Tokenization:** Primary student records reference only an opaque UUID `aadhaar_reference_token`.
3. **Blind HMAC Index:** Duplicate prevention is accomplished via deterministic HMAC-SHA256 with a KMS pepper, preventing plaintext Aadhaar indexing or searching.
4. **Access Control & Auditing:** The database user `adv_vault_user` alone possesses SELECT/INSERT on the vault schema; all access attempts are logged in `aadhaar_vault_schema.vault_access_logs`.

---

## 5. Guidelines for Indian Government Websites (GIGW 3.0) & DBIM Checklist

- [x] **Top Utility Banner:** Official Government of India Tricolor ribbon and National Emblem.
- [x] **Accessibility Controls:**
  - "Skip to Main Content" primary anchor link (`#main-content`).
  - Screen-reader text contrast ratio $\ge 4.5:1$ (WCAG 2.1 AA compliant).
  - Dynamic font-size adjusters: Decrease (`A-`), Normal (`A`), Increase (`A+`).
  - High-Contrast mode toggle (Deep Navy / Pure Black with high-contrast text).
- [x] **Bilingual Support (Bhashini API):** Instant localization switching between English and Hindi (`हिन्दी`).
- [x] **National Brand Colors (DBIM):**
  - Primary: Deep Bharat Navy (`#1e3a8a`)
  - Accent 1: Tiranga Saffron (`#f97316`)
  - Accent 2: Ashoka Chakra / India Green (`#15803d`)
  - Neutral Background: Sand / Slate off-white (`#f8fafc`)

---

## 6. End-to-End Verification Pipeline & Testing Workflow

### Scenario A: Institutional Bulk Upload with DSC Signature
1. Institution Nodal Officer logs in via AISHE Code (`C-41584`) and Nodal ID (`NODAL-COEP-01`).
2. Institution uploads semester records payload. The payload is signed with the Nodal Officer's RSA Private Key.
3. The platform verifies the institutional public key, hashes each canonical transcript deterministically via `SHA-256`, creates a W3C Verifiable Credential JSON-LD, pushes credits to ABC, and indexes in DigiLocker.

### Scenario B: Zero-Red-Tape Third-Party Verification (< 200ms)
1. Employer / Verifier submits credential verification request:
   ```bash
   curl -X POST http://localhost:5000/api/v1/verify/credential \
     -H "Content-Type: application/json" \
     -d '{
       "apaarId": "908123456781",
       "recordId": "f1e2d3c4-b5a6-9788-1234-567890abcdef"
     }'
   ```
2. Response returns in **< 150ms** confirming cryptographic integrity (`VALID`, `hashMatched: true`, platform signature verified).
3. If requesting full semester grades, DEPA consent validation is automatically triggered.

### Scenario C: DEPA Real-Time Consent Revocation
1. Student views pending requests on their dashboard.
2. Student grants consent to employer (e.g., TCS Recruitment).
3. Student clicks **"Revoke Consent"** — status updates to `REVOKED` in under 1 second, and subsequent third-party confidential queries return `CONSENT_DENIED`.
