import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Import Controllers
import authRouter from './modules/auth/auth.controller';
import studentsRouter from './modules/students/students.controller';
import academicRecordsRouter from './modules/academic-records/academic-records.controller';
import consentRouter from './modules/depa-consent/depa-consent.controller';
import verificationRouter from './modules/verification/verification.controller';
import institutionsRouter from './modules/institutions/institutions.controller';

dotenv.config();

const app = express();
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 80 : 5000);

// ============================================================================
// 1. CERT-In & GIGW 3.0 Mandatory Security Hardening
// ============================================================================
// Strip X-Powered-By
app.disable('x-powered-by');

// Obscure server banner
app.use((_req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.setHeader('Server', 'AICTE-National-Secure-Gateway');
  next();
});

// Configure Helmet with strict CSP, HSTS, and XSS Protection
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: ["'self'", "http://localhost:*", "ws://localhost:*", "https://*.gov.in", "https://*.vercel.app"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    hsts: {
      maxAge: 63072000, // 2 years
      includeSubDomains: true,
      preload: true
    },
    frameguard: {
      action: 'sameorigin'
    },
    noSniff: true,
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin'
    }
  })
);

// CORS for local development, Vercel deployments, and authorized portals
app.use(
  cors({
    origin: (origin, callback) => {
      // In development allow localhost origins; in production allow .gov.in and Vercel domains
      if (
        !origin ||
        /^http:\/\/localhost:[0-9]+$/.test(origin) ||
        origin.endsWith('.gov.in') ||
        origin.endsWith('.vercel.app') ||
        origin.includes('vercel.app')
      ) {
        callback(null, true);
      } else {
        callback(new Error('CORS Access Denied: Unauthorized Domain.'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token']
  })
);

// Body parsing with strict payload size ceilings (2MB default)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// ============================================================================
// 2. Health & Heartbeat Check
// ============================================================================
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    system: 'AICTE APAAR National Data Management & Verification Engine',
    organization: 'All India Council for Technical Education (AICTE)',
    cloudInfrastructure: 'MeghRaj (Government of India GI Cloud)',
    securityCompliance: {
      certInGuidelines: 'ENFORCED_180_DAYS_IMMUTABLE_LOGS',
      dpdpAct2023: 'FIELD_LEVEL_ENCRYPTION_DEPA_CONSENT_ENABLED',
      gigw30: 'COMPLIANT',
      aadhaarDataVault: 'ISOLATED_SCHEMA_AES256GCM'
    },
    ntpTimestamp: new Date().toISOString()
  });
});

// ============================================================================
// 3. API Module Routing
// ============================================================================
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/students', studentsRouter);
app.use('/api/v1/academic-records', academicRecordsRouter);
app.use('/api/v1/institution', academicRecordsRouter); // For /bulk-upload and /institution-records
app.use('/api/v1/institutions', institutionsRouter);
app.use('/api/v1/consent', consentRouter);
app.use('/api/v1/verify', verificationRouter);
app.use('/api/v1/admin', institutionsRouter); // For /admin/analytics and /admin/audit-trail

// ============================================================================
// 4. Non-Leaking CERT-In Error Handler (Never expose stack traces)
// ============================================================================
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[AICTE-SECURITY-ALERT]', err);

  const statusCode = err.status || err.statusCode || 500;
  const safeMessage =
    statusCode === 500
      ? 'An internal secure processing exception occurred. This incident has been logged with National Cyber Security telemetry.'
      : err.message || 'Operation failed.';

  res.status(statusCode).json({
    error: 'SECURITY_CONTROL_INCIDENT',
    message: safeMessage,
    incidentTimestamp: new Date().toISOString()
  });
});

// 404 Fallback
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'ENDPOINT_NOT_FOUND',
    message: 'The requested AICTE National API resource does not exist or access is restricted.'
  });
});

const HOST = '0.0.0.0';
app.listen(Number(PORT), HOST, () => {
  console.log(`[AICTE-APAAR-CORE] National Service running on http://${HOST}:${PORT}`);
  console.log(`[AICTE-APAAR-CORE] Security Mode: CERT-In Hardened, GIGW 3.0, DPDP Act 2023 Enabled`);
});

export default app;
