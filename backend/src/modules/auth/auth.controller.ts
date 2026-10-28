import { Router, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { extractClientIp, authenticate, AuthenticatedRequest } from './auth.middleware';

const router = Router();

/**
 * POST /api/v1/auth/student/login-otp
 * Step 1: Request MeriPehchaan SSO OTP for APAAR ID
 */
router.post('/student/request-otp', (req: Request, res: Response) => {
  const { apaarId } = req.body;
  const clientIp = extractClientIp(req);

  if (!apaarId || !/^[0-9]{12}$/.test(apaarId)) {
    return res.status(400).json({
      error: 'INVALID_APAAR_FORMAT',
      message: 'A valid 12-digit numerical APAAR ID is required.'
    });
  }

  // Trigger simulated national SMS dispatch
  return res.json({
    success: true,
    message: `National SSO OTP successfully dispatched to mobile registered with APAAR ID ${apaarId}.`,
    apaarId,
    demoOtp: '123456',
    expiresInSeconds: 600
  });
});

/**
 * POST /api/v1/auth/student/verify-otp
 * Step 2: Verify OTP and establish HttpOnly secure session
 */
router.post('/student/verify-otp', async (req: Request, res: Response) => {
  const { apaarId, otp } = req.body;
  const clientIp = extractClientIp(req);

  try {
    const { token, student } = await AuthService.authenticateStudentWithOtp(apaarId, otp, clientIp);

    // Mandated HttpOnly, Secure, SameSite=Strict cookie
    res.cookie('aicte_session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    return res.json({
      success: true,
      token,
      student,
      sessionExpiresIn: '15m'
    });
  } catch (err: any) {
    return res.status(401).json({ error: 'AUTH_FAILED', message: err.message });
  }
});

/**
 * POST /api/v1/auth/nodal/login
 * Institution Nodal Officer login via AISHE code & Nodal Officer ID
 */
router.post('/nodal/login', async (req: Request, res: Response) => {
  const { aisheCode, nodalOfficerId } = req.body;
  const clientIp = extractClientIp(req);

  try {
    const { token, institution } = await AuthService.authenticateNodalOfficer(aisheCode, nodalOfficerId, clientIp);

    res.cookie('aicte_session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    return res.json({
      success: true,
      token,
      institution: {
        aisheCode: institution.aisheCode,
        name: institution.name,
        nodalOfficerName: institution.nodalOfficerName,
        nodalOfficerEmail: institution.nodalOfficerEmail,
        status: institution.status
      }
    });
  } catch (err: any) {
    return res.status(401).json({ error: 'AUTH_FAILED', message: err.message });
  }
});

/**
 * POST /api/v1/auth/admin/login
 * AICTE Super-Admin Login
 */
router.post('/admin/login', async (req: Request, res: Response) => {
  const { adminId, passKey } = req.body;
  const clientIp = extractClientIp(req);

  try {
    const { token } = await AuthService.authenticateSuperAdmin(adminId, passKey, clientIp);

    res.cookie('aicte_session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    return res.json({
      success: true,
      token,
      role: 'AICTE_SUPERADMIN'
    });
  } catch (err: any) {
    return res.status(401).json({ error: 'AUTH_FAILED', message: err.message });
  }
});

/**
 * GET /api/v1/auth/me
 * Check current session state
 */
router.get('/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    authenticated: true,
    user: req.user
  });
});

/**
 * POST /api/v1/auth/logout
 * Revoke session and clear cookies
 */
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('aicte_session_token');
  return res.json({ success: true, message: 'Session terminated successfully.' });
});

export default router;
