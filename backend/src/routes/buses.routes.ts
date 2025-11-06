import { Router, Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const buses = await prisma.bus.findMany({ include: { route: true, seats: true } });
  res.json(buses);
});

router.get('/:id', async (req: Request, res: Response) => {
  const bus = await prisma.bus.findUnique({ where: { id: req.params.id }, include: { route: true, seats: true } });
  if (!bus) return res.status(404).json({ message: 'Bus not found' });
  res.json(bus);
});

router.post('/:id/book', requireAuth, async (req: Request, res: Response) => {
  const { seatId } = req.body as { seatId: string };
  const busId = req.params.id;
  try {
    const booking = await prisma.$transaction(async (tx: any) => {
      // Optimistic concurrency guard: update if not already booked
      const updated = await tx.seat.updateMany({
        where: { id: seatId, busId, isBooked: false },
        data: { isBooked: true },
      });
      if (updated.count !== 1) throw new Error('Seat unavailable');
      return tx.booking.create({ data: { userId: (req as any).user.id, busId, seatId } });
    });
    res.status(201).json(booking);
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Booking failed' });
  }
});

router.post('/:id/cancel', requireAuth, async (req: Request, res: Response) => {
  const { bookingId } = req.body as { bookingId: string };
  try {
    const booking = await prisma.booking.update({ where: { id: bookingId }, data: { status: 'CANCELED' } });
    await prisma.seat.update({ where: { id: booking.seatId }, data: { isBooked: false } });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ message: 'Cancel failed' });
  }
});

export default router;

