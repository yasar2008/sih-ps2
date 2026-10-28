import crypto from 'crypto';
import { CryptoService } from './crypto.service';

export interface AadhaarVaultEntry {
  referenceToken: string;
  encryptedAadhaarPayload: string;
  kmsKeyId: string;
  aadhaarLastFour: string;
  aadhaarHashHmac: string;
  linkedApaarId: string;
  createdAt: string;
  lastAccessedAt?: string;
  accessCount: number;
}

export class AadhaarDataVaultService {
  // In-memory isolated store mirror (complemented by PostgreSQL aadhaar_vault_schema in production)
  private static vaultStore: Map<string, AadhaarVaultEntry> = new Map([
    [
      'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      {
        referenceToken: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        encryptedAadhaarPayload: CryptoService.encryptField('981245678912'),
        kmsKeyId: 'HSM-UIDAI-VAULT-KEY-v1',
        aadhaarLastFour: '8912',
        aadhaarHashHmac: CryptoService.computeBlindIndex('981245678912'),
        linkedApaarId: '908123456781',
        createdAt: new Date().toISOString(),
        accessCount: 3
      }
    ],
    [
      'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      {
        referenceToken: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
        encryptedAadhaarPayload: CryptoService.encryptField('543167890123'),
        kmsKeyId: 'HSM-UIDAI-VAULT-KEY-v1',
        aadhaarLastFour: '0123',
        aadhaarHashHmac: CryptoService.computeBlindIndex('543167890123'),
        linkedApaarId: '908123456782',
        createdAt: new Date().toISOString(),
        accessCount: 1
      }
    ]
  ]);

  private static accessLogs: Array<{
    logId: string;
    referenceToken: string;
    accessorService: string;
    accessorIp: string;
    purpose: string;
    accessType: string;
    accessedAt: string;
  }> = [];

  /**
   * Tokenizes a raw 12-digit Aadhaar number per UIDAI ADV Guidelines.
   * NEVER stores raw Aadhaar in application tables; returns a UUID reference token.
   */
  public static tokenizeAadhaar(params: {
    rawAadhaar: string;
    apaarId: string;
    accessorService: string;
    accessorIp: string;
    purpose: string;
  }): { referenceToken: string; aadhaarLastFour: string } {
    const { rawAadhaar, apaarId, accessorService, accessorIp, purpose } = params;

    if (!/^[0-9]{12}$/.test(rawAadhaar)) {
      throw new Error('UIDAI Compliance Error: Aadhaar must be exactly 12 numerical digits.');
    }

    const blindIndex = CryptoService.computeBlindIndex(rawAadhaar);
    const lastFour = rawAadhaar.slice(-4);

    // Check if already tokenized
    for (const [_, entry] of this.vaultStore.entries()) {
      if (entry.aadhaarHashHmac === blindIndex) {
        this.recordAccess(entry.referenceToken, accessorService, accessorIp, purpose, 'VERIFY_LAST4');
        return {
          referenceToken: entry.referenceToken,
          aadhaarLastFour: entry.aadhaarLastFour
        };
      }
    }

    // Encrypt with dedicated KMS / HSM Key
    const encryptedPayload = CryptoService.encryptField(rawAadhaar);
    const referenceToken = crypto.randomUUID();

    const newEntry: AadhaarVaultEntry = {
      referenceToken,
      encryptedAadhaarPayload: encryptedPayload,
      kmsKeyId: 'HSM-UIDAI-VAULT-KEY-v1',
      aadhaarLastFour: lastFour,
      aadhaarHashHmac: blindIndex,
      linkedApaarId: apaarId,
      createdAt: new Date().toISOString(),
      accessCount: 1
    };

    this.vaultStore.set(referenceToken, newEntry);
    this.recordAccess(referenceToken, accessorService, accessorIp, purpose, 'TOKENIZE');

    return { referenceToken, aadhaarLastFour: lastFour };
  }

  /**
   * Retrieves masked verification details from the Aadhaar Data Vault.
   * Strictly forbids returning full unmasked Aadhaar to application layers.
   */
  public static getMaskedAadhaar(
    referenceToken: string,
    accessorService: string,
    accessorIp: string,
    purpose: string
  ): { referenceToken: string; maskedAadhaar: string; linkedApaarId: string } {
    const entry = this.vaultStore.get(referenceToken);
    if (!entry) {
      throw new Error('Aadhaar Data Vault reference token not found.');
    }

    this.recordAccess(referenceToken, accessorService, accessorIp, purpose, 'VERIFY_LAST4');

    return {
      referenceToken,
      maskedAadhaar: `XXXX-XXXX-${entry.aadhaarLastFour}`,
      linkedApaarId: entry.linkedApaarId
    };
  }

  /**
   * Internal audit trail recording for UIDAI compliance
   */
  private static recordAccess(
    referenceToken: string,
    accessorService: string,
    accessorIp: string,
    purpose: string,
    accessType: string
  ): void {
    const log = {
      logId: crypto.randomUUID(),
      referenceToken,
      accessorService,
      accessorIp,
      purpose,
      accessType,
      accessedAt: new Date().toISOString()
    };
    this.accessLogs.push(log);
    
    // Update counter on vault entry
    const entry = this.vaultStore.get(referenceToken);
    if (entry) {
      entry.lastAccessedAt = log.accessedAt;
      entry.accessCount += 1;
    }
  }

  public static getVaultAccessLogs(): any[] {
    return [...this.accessLogs];
  }
}
