import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { Server as SocketIOServer } from 'socket.io';
import { env } from './config/env.js';
import { connectDB, prisma } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import busesRoutes from './routes/buses.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { registerSeatNamespace } from './sockets/index.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: env.clientOrigin, credentials: true }
});

const { broadcastSeatUpdate } = registerSeatNamespace(io);

app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(helmet());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/buses', busesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/admin', adminRoutes);

prisma.$use(async (params, next) => {
  const result = await next(params);
  if (params.model === 'Booking' && (params.action === 'create' || params.action === 'update')) {
    const busId = (result as any).busId as string;
    broadcastSeatUpdate(busId, { busId });
  }
  if (params.model === 'Seat' && params.action === 'update') {
    const busId = (result as any).busId as string;
    broadcastSeatUpdate(busId, { busId });
  }
  return result;
});

async function start() {
  try {
    await connectDB();
    server.listen(env.port, () => {
      console.log(`API listening on http://localhost:${env.port}`);
    });
  } catch (e) {
    console.error('Failed to start server', e);
    process.exit(1);
  }
}

start();

