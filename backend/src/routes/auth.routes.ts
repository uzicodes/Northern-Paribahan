import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../config/db.js';
import { signToken } from '../utils/tokens.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password, name, phoneNumber } = req.body as { email: string; password: string; name: string; phoneNumber: string };
  if (!email || !password || !name || !phoneNumber) return res.status(400).json({ message: 'Missing fields' });
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({ data: { email, password: hashed, name, phoneNumber } });
    return res.status(201).json({ id: user.id, email: user.email, name: user.name, phoneNumber: user.phoneNumber });
  } catch (e) {
    return res.status(409).json({ message: 'Email already in use' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken({ id: user.id, role: user.role, email: user.email });
  return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

export default router;

