import type { Server } from 'socket.io';

export function registerSeatNamespace(io: Server) {
  const nsp = io.of('/seats');
  nsp.on('connection', (socket) => {
    socket.on('join-bus', (busId: string) => {
      socket.join(`bus:${busId}`);
    });
  });

  function broadcastSeatUpdate(busId: string, payload: unknown) {
    nsp.to(`bus:${busId}`).emit('seat-update', payload);
  }

  return { broadcastSeatUpdate };
}

