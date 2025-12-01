import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include user info
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  // FIX: corrected 'constBW' to 'const'
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Verify using Supabase JWT Secret from your .env file
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) throw new Error('SUPABASE_JWT_SECRET not set in backend env');

    const decoded = jwt.verify(token, secret) as any;

    // Attach user data to request.
    // Supabase stores the user ID in 'sub' and email in 'email'
    (req as AuthRequest).user = {
      id: decoded.sub,
      email: decoded.email,
      // Supabase stores roles in app_metadata. We default to 'USER' if missing.
      role: decoded.app_metadata?.role || 'USER'
    };

    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}

// Role based authorization
export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;

    // Check if user exists and has the required role
    if (!user || user.role !== role) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
}