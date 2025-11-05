export function registerSeatNamespace(io) {
  const nsp = io.of('/seats');
  nsp.on('connection', (socket) => {
    socket.on('join-bus', (busId) => {
      socket.join(`bus:${busId}`);
    });
  });

  function broadcastSeatUpdate(busId, payload) {
    nsp.to(`bus:${busId}`).emit('seat-update', payload);
  }

  return { broadcastSeatUpdate };
}

