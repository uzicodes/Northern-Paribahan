import jwt, { type Secret } from 'jsonwebtoken';
import { env } from '../config/env.js';

const secret: Secret = env.jwtSecret as unknown as Secret;

export function signToken(payload: object): string {
  return jwt.sign(payload as any, secret, { expiresIn: env.jwtExpiresIn as any });
}

export function verifyToken(token: string): object | string {
  return jwt.verify(token, secret);
}

