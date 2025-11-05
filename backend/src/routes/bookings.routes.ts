import { Router } from 'express';
import { prisma } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  const bookings = await prisma.booking.findMany({ where: { userId: (req as any).user.id }, include: { bus: true, seat: true } });
  res.json(bookings);
});

export default router;

