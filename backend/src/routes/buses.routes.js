import { Router } from 'express';
import { prisma } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  const buses = await prisma.bus.findMany({
    include: { route: true, seats: true }
  });
  res.json(buses);
});

router.get('/:id', async (req, res) => {
  const bus = await prisma.bus.findUnique({ where: { id: req.params.id }, include: { route: true, seats: true } });
  if (!bus) return res.status(404).json({ message: 'Bus not found' });
  res.json(bus);
});

router.post('/:id/book', requireAuth, async (req, res) => {
  const { seatId } = req.body;
  const busId = req.params.id;
  try {
    const booking = await prisma.$transaction(async (tx) => {
      const seat = await tx.seat.findUnique({ where: { id: seatId } });
      if (!seat || seat.busId !== busId || seat.isBooked) throw new Error('Seat unavailable');
      await tx.seat.update({ where: { id: seatId }, data: { isBooked: true } });
      return tx.booking.create({ data: { userId: req.user.id, busId, seatId } });
    });
    res.status(201).json(booking);
  } catch (e) {
    res.status(400).json({ message: e.message || 'Booking failed' });
  }
});

router.post('/:id/cancel', requireAuth, async (req, res) => {
  const { bookingId } = req.body;
  try {
    const booking = await prisma.booking.update({ where: { id: bookingId }, data: { status: 'CANCELED' } });
    await prisma.seat.update({ where: { id: booking.seatId }, data: { isBooked: false } });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ message: 'Cancel failed' });
  }
});

export default router;

