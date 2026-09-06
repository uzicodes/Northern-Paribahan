import 'dotenv/config';
import { PrismaClient, BusTier } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function getTier(modelName: string): BusTier {
  const superModels = ['MAN 24.460', 'Scania Legacy SR2', 'Mercedes-Benz OM 906'];
  const midModels = ['Volvo B9R', 'Hino RN8J', 'Hyundai Universe'];
  if (superModels.includes(modelName)) return BusTier.PREMIUM;
  if (midModels.includes(modelName)) return BusTier.BUSINESS;
  return BusTier.ECONOMY;
}

function unpackRegistrationNumbers(rangeString: string): string[] {
  const match = rangeString.match(/(.*)-(\d+)-(\d+)$/);
  if (!match) return [rangeString];
  const prefix = match[1];
  const start = parseInt(match[2], 10);
  const end = parseInt(match[3], 10);
  const regNumbers: string[] = [];
  for (let i = start; i <= end; i++) {
    regNumbers.push(`${prefix}-${i}`);
  }
  return regNumbers;
}

const fleetData = [
  {
    name: 'DINAJPUR', code: 'DNJ', city: 'Dinajpur',
    buses: [
      { model: 'MAN 24.460', range: 'DNJ-METRO-01-1001-1003' },
      { model: 'Scania Legacy SR2', range: 'DNJ-METRO-02-1004-1006' },
      { model: 'Mercedes-Benz OM 906', range: 'DNJ-METRO-03-1007-1009' },
      { model: 'Volvo B9R', range: 'DNJ-METRO-04-1010-1012' },
      { model: 'Hino RN8J', range: 'DNJ-METRO-06-1013-1015' },
      { model: 'Hyundai Universe', range: 'DNJ-METRO-05-1016-1018' },
      { model: 'Ashok Leyland Eagle', range: 'DNJ-METRO-07-1019-1021' },
      { model: 'Eicher Pro', range: 'DNJ-METRO-08-1022-1024' },
    ]
  },
  {
    name: 'SYLHET', code: 'SYL', city: 'Sylhet',
    buses: [
      { model: 'MAN 24.460', range: 'SYL-METRO-01-2001-2003' },
      { model: 'Scania Legacy SR2', range: 'SYL-METRO-02-2004-2006' },
      { model: 'Mercedes-Benz OM 906', range: 'SYL-METRO-03-2007-2009' },
      { model: 'Volvo B9R', range: 'SYL-METRO-04-2010-2012' },
      { model: 'Hino RN8J', range: 'SYL-METRO-06-2013-2015' },
      { model: 'Hyundai Universe', range: 'SYL-METRO-05-2016-2018' },
      { model: 'Ashok Leyland Eagle', range: 'SYL-METRO-07-2019-2021' },
      { model: 'Eicher Pro', range: 'SYL-METRO-08-2022-2024' },
    ]
  },
  {
    name: 'BOGURA', code: 'BOG', city: 'Bogura',
    buses: [
      { model: 'MAN 24.460', range: 'BOG-METRO-01-3001-3003' },
      { model: 'Scania Legacy SR2', range: 'BOG-METRO-02-3004-3006' },
      { model: 'Volvo B9R', range: 'BOG-METRO-04-3007-3009' },
      { model: 'Hino RN8J', range: 'BOG-METRO-06-3010-3012' },
      { model: 'Hyundai Universe', range: 'BOG-METRO-05-3013-3015' },
      { model: 'Ashok Leyland Eagle', range: 'BOG-METRO-07-3016-3018' },
      { model: 'Eicher Pro', range: 'BOG-METRO-08-3019-3021' },
      { model: 'Hino AK1J', range: 'BOG-METRO-09-3022-3024' },
    ]
  },
  {
    name: 'RAJSHAHI', code: 'RAJ', city: 'Rajshahi',
    buses: [
      { model: 'MAN 24.460', range: 'RAJ-METRO-01-4001-4003' },
      { model: 'Scania Legacy SR2', range: 'RAJ-METRO-02-4004-4006' },
      { model: 'Mercedes-Benz OM 906', range: 'RAJ-METRO-03-4007-4009' },
      { model: 'Volvo B9R', range: 'RAJ-METRO-04-4010-4012' },
      { model: 'Hino RN8J', range: 'RAJ-METRO-06-4013-4015' },
      { model: 'Ashok Leyland Eagle', range: 'RAJ-METRO-07-4016-4018' },
      { model: 'Eicher Pro', range: 'RAJ-METRO-08-4019-4021' },
      { model: 'Hino AK1J', range: 'RAJ-METRO-09-4022-4024' },
    ]
  },
  {
    name: 'DHAKA', code: 'DHK', city: 'Dhaka',
    buses: [
      { model: 'MAN 24.460', range: 'DHK-METRO-01-5001-5006' },
      { model: 'Scania Legacy SR2', range: 'DHK-METRO-02-5007-5012' },
      { model: 'Mercedes-Benz OM 906', range: 'DHK-METRO-03-5013-5015' },
      { model: 'Volvo B9R', range: 'DHK-METRO-04-5016-5018' },
      { model: 'Hino RN8J', range: 'DHK-METRO-06-5019-5021' },
      { model: 'Hyundai Universe', range: 'DHK-METRO-05-5022-5024' },
    ]
  },
  {
    name: 'KHULNA', code: 'KHL', city: 'Khulna',
    buses: [
      { model: 'MAN 24.460', range: 'KHL-METRO-01-6001-6003' },
      { model: 'Scania Legacy SR2', range: 'KHL-METRO-02-6004-6006' },
      { model: 'Volvo B9R', range: 'KHL-METRO-04-6007-6012' },
      { model: 'Hino RN8J', range: 'KHL-METRO-06-6013-6018' },
      { model: 'Hyundai Universe', range: 'KHL-METRO-05-6019-6021' },
      { model: 'Ashok Leyland Eagle', range: 'KHL-METRO-07-6022-6024' },
    ]
  },
  {
    name: 'BARISAL', code: 'BAR', city: 'Barisal',
    buses: [
      { model: 'MAN 24.460', range: 'BAR-METRO-01-7001-7003' },
      { model: 'Scania Legacy SR2', range: 'BAR-METRO-02-7004-7006' },
      { model: 'Volvo B9R', range: 'BAR-METRO-04-7007-7012' },
      { model: 'Hino RN8J', range: 'BAR-METRO-06-7013-7018' },
      { model: 'Hyundai Universe', range: 'BAR-METRO-05-7019-7021' },
      { model: 'Ashok Leyland Eagle', range: 'BAR-METRO-07-7022-7024' },
    ]
  },
  {
    name: "COX'S BAZAR", code: 'COX', city: "Cox's Bazar",
    buses: [
      { model: 'MAN 24.460', range: 'COX-METRO-01-8001-8009' },
      { model: 'Scania Legacy SR2', range: 'COX-METRO-02-8010-8015' },
      { model: 'Mercedes-Benz OM 906', range: 'COX-METRO-03-8016-8021' },
      { model: 'Volvo B9R', range: 'COX-METRO-04-8022-8024' },
    ]
  },
  {
    name: 'CHITTAGONG', code: 'CTG', city: 'Chittagong',
    buses: [
      { model: 'MAN 24.460', range: 'CTG-METRO-01-9001-9009' },
      { model: 'Scania Legacy SR2', range: 'CTG-METRO-02-9010-9015' },
      { model: 'Mercedes-Benz OM 906', range: 'CTG-METRO-03-9016-9021' },
      { model: 'Volvo B9R', range: 'CTG-METRO-04-9022-9024' },
    ]
  }
];

async function main() {
  console.log('--- Starting Database Seeding (Northern Paribahan) ---');

  // Ensure PostgreSQL BusTier enum type contains the updated values
  const pgClient = await pool.connect();
  try {
    await pgClient.query('ALTER TYPE "BusTier" ADD VALUE IF NOT EXISTS \'PREMIUM\';');
    await pgClient.query('ALTER TYPE "BusTier" ADD VALUE IF NOT EXISTS \'BUSINESS\';');
    await pgClient.query('ALTER TYPE "BusTier" ADD VALUE IF NOT EXISTS \'ECONOMY\';');
  } catch (err) {
    console.warn('Postgres enum check:', err);
  } finally {
    pgClient.release();
  }

  // 1. Clear existing operational records
  await prisma.ticket.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.schedule.deleteMany({});
  await prisma.route.deleteMany({});
  await prisma.bus.deleteMany({});
  await prisma.depot.deleteMany({});

  console.log('1. Cleared all existing database records.');

  // 2. Seed Depots and Buses
  let totalBusesInserted = 0;

  for (const depotData of fleetData) {
    const depot = await prisma.depot.create({
      data: {
        name: depotData.name,
        code: depotData.code,
        city: depotData.city,
      },
    });

    const busesToCreate = [];
    for (const busGroup of depotData.buses) {
      const regNumbers = unpackRegistrationNumbers(busGroup.range);
      const tier = getTier(busGroup.model);

      for (const reg of regNumbers) {
        busesToCreate.push({
          modelName: busGroup.model,
          registrationNumber: reg,
          tier: tier,
          depotId: depot.id,
          capacity: tier === BusTier.PREMIUM ? 36 : (tier === BusTier.BUSINESS ? 40 : 45),
        });
      }
    }

    const inserted = await prisma.bus.createMany({ data: busesToCreate });
    totalBusesInserted += inserted.count;
  }

  console.log(`2. Inserted ${totalBusesInserted} buses across 9 Depots.`);

  // 3. Define All 72 Master Routes
  const routesData = [
    // From Dinajpur
    { routeId: "NP-DNJ-001", origin: "Dinajpur", destination: "Sylhet", estimatedHours: 11.0 },
    { routeId: "NP-DNJ-002", origin: "Dinajpur", destination: "Bogura", estimatedHours: 4.0 },
    { routeId: "NP-DNJ-003", origin: "Dinajpur", destination: "Rajshahi", estimatedHours: 5.0 },
    { routeId: "NP-DNJ-004", origin: "Dinajpur", destination: "Dhaka", estimatedHours: 8.0 },
    { routeId: "NP-DNJ-005", origin: "Dinajpur", destination: "Khulna", estimatedHours: 9.0 },
    { routeId: "NP-DNJ-006", origin: "Dinajpur", destination: "Barisal", estimatedHours: 10.0 },
    { routeId: "NP-DNJ-007", origin: "Dinajpur", destination: "Cox's Bazar", estimatedHours: 16.0 },
    { routeId: "NP-DNJ-008", origin: "Dinajpur", destination: "Chittagong", estimatedHours: 13.0 },

    // From Sylhet
    { routeId: "NP-SYL-009", origin: "Sylhet", destination: "Dinajpur", estimatedHours: 11.0 },
    { routeId: "NP-SYL-010", origin: "Sylhet", destination: "Bogura", estimatedHours: 8.0 },
    { routeId: "NP-SYL-011", origin: "Sylhet", destination: "Rajshahi", estimatedHours: 10.0 },
    { routeId: "NP-SYL-012", origin: "Sylhet", destination: "Dhaka", estimatedHours: 6.0 },
    { routeId: "NP-SYL-013", origin: "Sylhet", destination: "Khulna", estimatedHours: 11.0 },
    { routeId: "NP-SYL-014", origin: "Sylhet", destination: "Barisal", estimatedHours: 10.0 },
    { routeId: "NP-SYL-015", origin: "Sylhet", destination: "Cox's Bazar", estimatedHours: 11.0 },
    { routeId: "NP-SYL-016", origin: "Sylhet", destination: "Chittagong", estimatedHours: 8.0 },

    // From Bogura
    { routeId: "NP-BOG-017", origin: "Bogura", destination: "Dinajpur", estimatedHours: 4.0 },
    { routeId: "NP-BOG-018", origin: "Bogura", destination: "Sylhet", estimatedHours: 8.0 },
    { routeId: "NP-BOG-019", origin: "Bogura", destination: "Rajshahi", estimatedHours: 3.0 },
    { routeId: "NP-BOG-020", origin: "Bogura", destination: "Dhaka", estimatedHours: 5.0 },
    { routeId: "NP-BOG-021", origin: "Bogura", destination: "Khulna", estimatedHours: 7.0 },
    { routeId: "NP-BOG-022", origin: "Bogura", destination: "Barisal", estimatedHours: 8.0 },
    { routeId: "NP-BOG-023", origin: "Bogura", destination: "Cox's Bazar", estimatedHours: 13.0 },
    { routeId: "NP-BOG-024", origin: "Bogura", destination: "Chittagong", estimatedHours: 9.0 },

    // From Rajshahi
    { routeId: "NP-RAJ-025", origin: "Rajshahi", destination: "Dinajpur", estimatedHours: 5.0 },
    { routeId: "NP-RAJ-026", origin: "Rajshahi", destination: "Sylhet", estimatedHours: 10.0 },
    { routeId: "NP-RAJ-027", origin: "Rajshahi", destination: "Bogura", estimatedHours: 3.0 },
    { routeId: "NP-RAJ-028", origin: "Rajshahi", destination: "Dhaka", estimatedHours: 6.0 },
    { routeId: "NP-RAJ-029", origin: "Rajshahi", destination: "Khulna", estimatedHours: 6.0 },
    { routeId: "NP-RAJ-030", origin: "Rajshahi", destination: "Barisal", estimatedHours: 8.0 },
    { routeId: "NP-RAJ-031", origin: "Rajshahi", destination: "Cox's Bazar", estimatedHours: 14.0 },
    { routeId: "NP-RAJ-032", origin: "Rajshahi", destination: "Chittagong", estimatedHours: 11.0 },

    // From Dhaka
    { routeId: "NP-DHK-033", origin: "Dhaka", destination: "Dinajpur", estimatedHours: 8.0 },
    { routeId: "NP-DHK-034", origin: "Dhaka", destination: "Sylhet", estimatedHours: 6.0 },
    { routeId: "NP-DHK-035", origin: "Dhaka", destination: "Bogura", estimatedHours: 5.0 },
    { routeId: "NP-DHK-036", origin: "Dhaka", destination: "Rajshahi", estimatedHours: 6.0 },
    { routeId: "NP-DHK-037", origin: "Dhaka", destination: "Khulna", estimatedHours: 5.0 },
    { routeId: "NP-DHK-038", origin: "Dhaka", destination: "Barisal", estimatedHours: 4.0 },
    { routeId: "NP-DHK-039", origin: "Dhaka", destination: "Cox's Bazar", estimatedHours: 9.0 },
    { routeId: "NP-DHK-040", origin: "Dhaka", destination: "Chittagong", estimatedHours: 6.0 },

    // From Khulna
    { routeId: "NP-KHL-041", origin: "Khulna", destination: "Dinajpur", estimatedHours: 9.0 },
    { routeId: "NP-KHL-042", origin: "Khulna", destination: "Sylhet", estimatedHours: 11.0 },
    { routeId: "NP-KHL-043", origin: "Khulna", destination: "Bogura", estimatedHours: 7.0 },
    { routeId: "NP-KHL-044", origin: "Khulna", destination: "Rajshahi", estimatedHours: 6.0 },
    { routeId: "NP-KHL-045", origin: "Khulna", destination: "Dhaka", estimatedHours: 5.0 },
    { routeId: "NP-KHL-046", origin: "Khulna", destination: "Barisal", estimatedHours: 3.0 },
    { routeId: "NP-KHL-047", origin: "Khulna", destination: "Cox's Bazar", estimatedHours: 14.0 },
    { routeId: "NP-KHL-048", origin: "Khulna", destination: "Chittagong", estimatedHours: 11.0 },

    // From Barisal
    { routeId: "NP-BAR-049", origin: "Barisal", destination: "Dinajpur", estimatedHours: 10.0 },
    { routeId: "NP-BAR-050", origin: "Barisal", destination: "Sylhet", estimatedHours: 10.0 },
    { routeId: "NP-BAR-051", origin: "Barisal", destination: "Bogura", estimatedHours: 8.0 },
    { routeId: "NP-BAR-052", origin: "Barisal", destination: "Rajshahi", estimatedHours: 8.0 },
    { routeId: "NP-BAR-053", origin: "Barisal", destination: "Dhaka", estimatedHours: 4.0 },
    { routeId: "NP-BAR-054", origin: "Barisal", destination: "Khulna", estimatedHours: 3.0 },
    { routeId: "NP-BAR-055", origin: "Barisal", destination: "Cox's Bazar", estimatedHours: 12.0 },
    { routeId: "NP-BAR-056", origin: "Barisal", destination: "Chittagong", estimatedHours: 9.0 },

    // From Cox's Bazar
    { routeId: "NP-COX-057", origin: "Cox's Bazar", destination: "Dinajpur", estimatedHours: 16.0 },
    { routeId: "NP-COX-058", origin: "Cox's Bazar", destination: "Sylhet", estimatedHours: 11.0 },
    { routeId: "NP-COX-059", origin: "Cox's Bazar", destination: "Bogura", estimatedHours: 13.0 },
    { routeId: "NP-COX-060", origin: "Cox's Bazar", destination: "Rajshahi", estimatedHours: 14.0 },
    { routeId: "NP-COX-061", origin: "Cox's Bazar", destination: "Dhaka", estimatedHours: 9.0 },
    { routeId: "NP-COX-062", origin: "Cox's Bazar", destination: "Khulna", estimatedHours: 14.0 },
    { routeId: "NP-COX-063", origin: "Cox's Bazar", destination: "Barisal", estimatedHours: 12.0 },
    { routeId: "NP-COX-064", origin: "Cox's Bazar", destination: "Chittagong", estimatedHours: 3.0 },

    // From Chittagong
    { routeId: "NP-CTG-065", origin: "Chittagong", destination: "Dinajpur", estimatedHours: 13.0 },
    { routeId: "NP-CTG-066", origin: "Chittagong", destination: "Sylhet", estimatedHours: 8.0 },
    { routeId: "NP-CTG-067", origin: "Chittagong", destination: "Bogura", estimatedHours: 9.0 },
    { routeId: "NP-CTG-068", origin: "Chittagong", destination: "Rajshahi", estimatedHours: 11.0 },
    { routeId: "NP-CTG-069", origin: "Chittagong", destination: "Dhaka", estimatedHours: 6.0 },
    { routeId: "NP-CTG-070", origin: "Chittagong", destination: "Khulna", estimatedHours: 11.0 },
    { routeId: "NP-CTG-071", origin: "Chittagong", destination: "Barisal", estimatedHours: 9.0 },
    { routeId: "NP-CTG-072", origin: "Chittagong", destination: "Cox's Bazar", estimatedHours: 3.0 },
  ];

  await prisma.route.createMany({ 
    data: routesData, 
    skipDuplicates: true 
  });
  console.log(`3. Created ${routesData.length} master routes.`);

  // 4. Fetch Dinajpur buses for the schedules
  const dinajpurBuses = await prisma.bus.findMany({
    where: { depot: { code: 'DNJ' } },
    orderBy: { registrationNumber: 'asc' },
  });

  const busesByModel: Record<string, typeof dinajpurBuses> = {};
  for (const bus of dinajpurBuses) {
    if (!busesByModel[bus.modelName]) {
      busesByModel[bus.modelName] = [];
    }
    busesByModel[bus.modelName].push(bus);
  }

  // Fetch all inserted routes to get their generated CUIDs for foreign key linking
  const dbRoutes = await prisma.route.findMany();
  
  const getDbRouteId = (origin: string, destination: string) => {
    const route = dbRoutes.find(r => r.origin === origin && r.destination === destination);
    if (!route) throw new Error(`Route not found in DB: ${origin} -> ${destination}`);
    return route.id;
  };

  // 5. Generate 30-Day Rolling Timetable
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const TOTAL_DAYS = 31;
  const schedulesData = [];

  const routeConfigs = [
    { destination: "Cox's Bazar", modelName: 'MAN 24.460', fare: 2200, estimatedHours: 17.0, outboundDep: { hour: 15, minute: 0 }, inboundDep: { hour: 15, minute: 0 } },
    { destination: 'Chittagong', modelName: 'Scania Legacy SR2', fare: 1800, estimatedHours: 14.0, outboundDep: { hour: 17, minute: 0 }, inboundDep: { hour: 17, minute: 0 } },
    { destination: 'Barisal', modelName: 'Mercedes-Benz OM 906', fare: 1450, estimatedHours: 11.5, outboundDep: { hour: 19, minute: 0 }, inboundDep: { hour: 19, minute: 0 } },
    { destination: 'Sylhet', modelName: 'Volvo B9R', fare: 1450, estimatedHours: 11.5, outboundDep: { hour: 19, minute: 30 }, inboundDep: { hour: 19, minute: 30 } },
    { destination: 'Khulna', modelName: 'Hyundai Universe', fare: 1350, estimatedHours: 10.0, outboundDep: { hour: 20, minute: 30 }, inboundDep: { hour: 20, minute: 30 } },
    { destination: 'Dhaka', modelName: 'Hino RN8J', fare: 1000, estimatedHours: 7.5, outboundDep: { hour: 8, minute: 30 }, inboundDep: { hour: 8, minute: 30 } },
    { destination: 'Rajshahi', modelName: 'Ashok Leyland Eagle', fare: 550, estimatedHours: 4.5, outboundDep: { hour: 8, minute: 0 }, inboundDep: { hour: 8, minute: 0 } },
    { destination: 'Bogura', modelName: 'Eicher Pro', fare: 350, estimatedHours: 3.0, outboundDep: { hour: 9, minute: 0 }, inboundDep: { hour: 9, minute: 0 } },
  ];

  for (const config of routeConfigs) {
    const buses = busesByModel[config.modelName];
    if (!buses || buses.length < 3) {
      console.error(`Missing buses for model ${config.modelName} in Dinajpur!`);
      continue;
    }
    
    // Look up the specific database IDs for this route pair
    const outboundRouteId = getDbRouteId('Dinajpur', config.destination);
    const inboundRouteId = getDbRouteId(config.destination, 'Dinajpur');

    for (let dayOffset = 0; dayOffset < TOTAL_DAYS; dayOffset++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() + dayOffset);

      const outboundBus = buses[dayOffset % 3];
      const inboundBus = buses[(dayOffset + 1) % 3];

      // Outbound (Dinajpur -> Destination)
      const outboundDep = new Date(currentDay);
      outboundDep.setHours(config.outboundDep.hour, config.outboundDep.minute, 0, 0);
      const outboundArr = new Date(outboundDep.getTime() + config.estimatedHours * 60 * 60 * 1000);

      schedulesData.push({
        busId: outboundBus.id,
        routeId: outboundRouteId,
        origin: 'Dinajpur',
        destination: config.destination,
        busName: outboundBus.modelName,
        registrationNumber: outboundBus.registrationNumber,
        departureTime: outboundDep,
        arrivalTime: outboundArr,
        fare: config.fare,
      });

      // Inbound (Destination -> Dinajpur)
      const inboundDep = new Date(currentDay);
      inboundDep.setHours(config.inboundDep.hour, config.inboundDep.minute, 0, 0);
      const inboundArr = new Date(inboundDep.getTime() + config.estimatedHours * 60 * 60 * 1000);

      schedulesData.push({
        busId: inboundBus.id,
        routeId: inboundRouteId,
        origin: config.destination,
        destination: 'Dinajpur',
        busName: inboundBus.modelName,
        registrationNumber: inboundBus.registrationNumber,
        departureTime: inboundDep,
        arrivalTime: inboundArr,
        fare: config.fare,
      });
    }
  }

  await prisma.schedule.createMany({ data: schedulesData });

  console.log(`4. Successfully generated and saved ${schedulesData.length} schedules across 30 days!`);
  console.log('--- Database Seeding Completed Successfully ---');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });