import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const adminPass = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, password: adminPass, name: 'Admin', role: 'ADMIN' },
  });

  const route1 = await prisma.route.upsert({
    where: { id: 'seed-route-1' },
    update: {},
    create: {
      id: 'seed-route-1',
      origin: 'City A',
      destination: 'City B',
      departure: new Date(Date.now() + 3600_000),
      arrival: new Date(Date.now() + 5 * 3600_000),
    },
  });

  const route2 = await prisma.route.upsert({
    where: { id: 'seed-route-2' },
    update: {},
    create: {
      id: 'seed-route-2',
      origin: 'City B',
      destination: 'City C',
      departure: new Date(Date.now() + 2 * 3600_000),
      arrival: new Date(Date.now() + 7 * 3600_000),
    },
  });

  const bus1 = await prisma.bus.upsert({
    where: { number: 'AB-1001' },
    update: {},
    create: { name: 'Express A', number: 'AB-1001', routeId: route1.id },
  });

  const bus2 = await prisma.bus.upsert({
    where: { number: 'BC-2002' },
    update: {},
    create: { name: 'Express B', number: 'BC-2002', routeId: route2.id },
  });

  async function ensureSeats(busId) {
    const count = await prisma.seat.count({ where: { busId } });
    if (count >= 40) return;
    const ops = [];
    for (let i = 1; i <= 40; i++) {
      ops.push(prisma.seat.upsert({
        where: { id: `${busId}-seat-${i}` },
        update: {},
        create: { id: `${busId}-seat-${i}`, seatNumber: `S${i.toString().padStart(2, '0')}`, busId },
      }));
    }
    await prisma.$transaction(ops);
  }

  await ensureSeats(bus1.id);
  await ensureSeats(bus2.id);

  console.log('Seed completed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});

