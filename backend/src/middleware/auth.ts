import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // Verify using Supabase's JWT Secret
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET as string) as any;

    // Supabase stores the user ID in 'sub'
    (req as any).user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.app_metadata?.role || 'USER' // You can set custom roles in Supabase later
    };

    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}