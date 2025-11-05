import { Router } from 'express';
import { prisma } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
const adminOnly = [requireAuth, requireRole('ADMIN')];

router.post('/routes', ...adminOnly, async (req, res) => {
  const route = await prisma.route.create({ data: req.body });
  res.status(201).json(route);
});

router.post('/buses', ...adminOnly, async (req, res) => {
  const { name, number, routeId } = req.body;
  const bus = await prisma.bus.create({ data: { name, number, routeId } });
  res.status(201).json(bus);
});

router.post('/buses/:busId/seats', ...adminOnly, async (req, res) => {
  const { seats } = req.body; // array of seatNumbers
  const busId = req.params.busId;
  const created = await prisma.$transaction(
    seats.map((seatNumber) => prisma.seat.create({ data: { seatNumber, busId } }))
  );
  res.status(201).json(created);
});

export default router;

