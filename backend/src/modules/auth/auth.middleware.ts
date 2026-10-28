import { Request, Response, NextFunction } from 'express';
import { AuthService, AuthTokenPayload } from './auth.service';

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
  clientIp?: string;
}

export function extractClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  req.clientIp = extractClientIp(req);

  let token = req.cookies?.['aicte_session_token'];
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Authentication session token is required to access this AICTE service.'
    });
  }

  try {
    const payload = AuthService.verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'SESSION_EXPIRED_OR_INVALID',
      message: 'Your national session has expired. Please re-authenticate via MeriPehchaan SSO.'
    });
  }
}

export function requireRole(...allowedRoles: Array<'STUDENT' | 'INSTITUTION_NODAL' | 'AICTE_SUPERADMIN' | 'PUBLIC_VERIFIER'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'FORBIDDEN_ROLE_ACCESS',
        message: 'Your assigned role does not have authorization to perform this operation.'
      });
    }
    next();
  };
}

/**
 * ABAC (Attribute-Based Access Control) Enforcement:
 * Institutional nodal officers can only query students actively enrolled under their own AISHE code
 * unless an approved DEPA consent artefact exists.
 */
export function enforceInstitutionalIsolation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user?.role === 'AICTE_SUPERADMIN') {
    return next(); // Super-admin has cross-institutional oversight
  }

  if (req.user?.role === 'INSTITUTION_NODAL') {
    const targetAisheCode = req.params.aisheCode || req.body.aisheCode || req.query.aisheCode;
    if (targetAisheCode && targetAisheCode !== req.user.aisheCode) {
      return res.status(403).json({
        error: 'INSTITUTIONAL_DATA_ISOLATION_VIOLATION',
        message: 'Security policy prohibits accessing student records outside your assigned AISHE institution.'
      });
    }
  }

  next();
}
