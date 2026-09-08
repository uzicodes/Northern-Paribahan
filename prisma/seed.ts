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

function parse12HourTime(timeStr: string): { hour: number; minute: number } {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (hours === 12) hours = modifier === 'AM' ? 0 : 12;
  else if (modifier === 'PM') hours += 12;
  return { hour: hours, minute: minutes };
}

function getArrivalTime(departureDate: Date, estimatedHours: number): Date {
  const msToAdd = estimatedHours * 60 * 60 * 1000;
  return new Date(departureDate.getTime() + msToAdd);
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
  await prisma.fare.deleteMany({});
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

  // 3. Define Master Routes with MANUAL PRICING (Updated with KM Distance)
  const routesData = [
    // From Dinajpur
    { routeId: "NP-DNJ-001", origin: "Dinajpur", destination: "Sylhet", estimatedHours: 9, distanceKm: 547, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-DNJ-002", origin: "Dinajpur", destination: "Bogura", estimatedHours: 3, distanceKm: 141, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-DNJ-003", origin: "Dinajpur", destination: "Rajshahi", estimatedHours: 4, distanceKm: 205, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-DNJ-004", origin: "Dinajpur", destination: "Dhaka", estimatedHours: 7, distanceKm: 338, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-DNJ-005", origin: "Dinajpur", destination: "Khulna", estimatedHours: 8, distanceKm: 434, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-DNJ-006", origin: "Dinajpur", destination: "Barisal", estimatedHours: 9, distanceKm: 505, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-DNJ-007", origin: "Dinajpur", destination: "Cox's Bazar", estimatedHours: 14, distanceKm: 728, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-DNJ-008", origin: "Dinajpur", destination: "Chittagong", estimatedHours: 11, distanceKm: 578, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },

    // From Sylhet
    { routeId: "NP-SYL-009", origin: "Sylhet", destination: "Dinajpur", estimatedHours: 9, distanceKm: 547, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-SYL-010", origin: "Sylhet", destination: "Bogura", estimatedHours: 6, distanceKm: 406, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-SYL-011", origin: "Sylhet", destination: "Rajshahi", estimatedHours: 7, distanceKm: 431, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-SYL-012", origin: "Sylhet", destination: "Dhaka", estimatedHours: 5, distanceKm: 241, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-SYL-013", origin: "Sylhet", destination: "Khulna", estimatedHours: 9, distanceKm: 416, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-SYL-014", origin: "Sylhet", destination: "Barisal", estimatedHours: 7, distanceKm: 405, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-SYL-015", origin: "Sylhet", destination: "Cox's Bazar", estimatedHours: 9, distanceKm: 530, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-SYL-016", origin: "Sylhet", destination: "Chittagong", estimatedHours: 7, distanceKm: 380, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },

    // From Bogura
    { routeId: "NP-BOG-017", origin: "Bogura", destination: "Dinajpur", estimatedHours: 3, distanceKm: 141, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-BOG-018", origin: "Bogura", destination: "Sylhet", estimatedHours: 6, distanceKm: 406, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-BOG-019", origin: "Bogura", destination: "Rajshahi", estimatedHours: 2, distanceKm: 114, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-BOG-020", origin: "Bogura", destination: "Dhaka", estimatedHours: 4, distanceKm: 197, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-BOG-021", origin: "Bogura", destination: "Khulna", estimatedHours: 6, distanceKm: 295, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-BOG-022", origin: "Bogura", destination: "Barisal", estimatedHours: 6, distanceKm: 366, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-BOG-023", origin: "Bogura", destination: "Cox's Bazar", estimatedHours: 11, distanceKm: 587, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-BOG-024", origin: "Bogura", destination: "Chittagong", estimatedHours: 8, distanceKm: 437, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },

    // From Rajshahi
    { routeId: "NP-RAJ-025", origin: "Rajshahi", destination: "Dinajpur", estimatedHours: 4, distanceKm: 205, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-RAJ-026", origin: "Rajshahi", destination: "Sylhet", estimatedHours: 7, distanceKm: 431, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-RAJ-027", origin: "Rajshahi", destination: "Bogura", estimatedHours: 2, distanceKm: 114, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-RAJ-028", origin: "Rajshahi", destination: "Dhaka", estimatedHours: 5, distanceKm: 256, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-RAJ-029", origin: "Rajshahi", destination: "Khulna", estimatedHours: 5, distanceKm: 272, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-RAJ-030", origin: "Rajshahi", destination: "Barisal", estimatedHours: 7, distanceKm: 344, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-RAJ-031", origin: "Rajshahi", destination: "Cox's Bazar", estimatedHours: 12, distanceKm: 646, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-RAJ-032", origin: "Rajshahi", destination: "Chittagong", estimatedHours: 9, distanceKm: 496, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },

    // From Dhaka
    { routeId: "NP-DHK-033", origin: "Dhaka", destination: "Dinajpur", estimatedHours: 7, distanceKm: 338, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-DHK-034", origin: "Dhaka", destination: "Sylhet", estimatedHours: 5, distanceKm: 241, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-DHK-035", origin: "Dhaka", destination: "Bogura", estimatedHours: 4, distanceKm: 197, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-DHK-036", origin: "Dhaka", destination: "Rajshahi", estimatedHours: 5, distanceKm: 256, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-DHK-037", origin: "Dhaka", destination: "Khulna", estimatedHours: 4, distanceKm: 180, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-DHK-038", origin: "Dhaka", destination: "Barisal", estimatedHours: 3, distanceKm: 169, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-DHK-039", origin: "Dhaka", destination: "Cox's Bazar", estimatedHours: 7, distanceKm: 392, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-DHK-040", origin: "Dhaka", destination: "Chittagong", estimatedHours: 4, distanceKm: 242, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },

    // From Khulna
    { routeId: "NP-KHL-041", origin: "Khulna", destination: "Dinajpur", estimatedHours: 8, distanceKm: 434, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-KHL-042", origin: "Khulna", destination: "Sylhet", estimatedHours: 9, distanceKm: 416, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-KHL-043", origin: "Khulna", destination: "Bogura", estimatedHours: 6, distanceKm: 295, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-KHL-044", origin: "Khulna", destination: "Rajshahi", estimatedHours: 5, distanceKm: 272, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-KHL-045", origin: "Khulna", destination: "Dhaka", estimatedHours: 4, distanceKm: 180, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-KHL-046", origin: "Khulna", destination: "Barisal", estimatedHours: 2, distanceKm: 109, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-KHL-047", origin: "Khulna", destination: "Cox's Bazar", estimatedHours: 11, distanceKm: 516, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-KHL-048", origin: "Khulna", destination: "Chittagong", estimatedHours: 8, distanceKm: 366, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },

    // From Barisal
    { routeId: "NP-BAR-049", origin: "Barisal", destination: "Dinajpur", estimatedHours: 9, distanceKm: 505, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-BAR-050", origin: "Barisal", destination: "Sylhet", estimatedHours: 7, distanceKm: 405, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-BAR-051", origin: "Barisal", destination: "Bogura", estimatedHours: 6, distanceKm: 366, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-BAR-052", origin: "Barisal", destination: "Rajshahi", estimatedHours: 7, distanceKm: 344, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-BAR-053", origin: "Barisal", destination: "Dhaka", estimatedHours: 3, distanceKm: 169, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-BAR-054", origin: "Barisal", destination: "Khulna", estimatedHours: 2, distanceKm: 109, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-BAR-055", origin: "Barisal", destination: "Cox's Bazar", estimatedHours: 10, distanceKm: 467, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-BAR-056", origin: "Barisal", destination: "Chittagong", estimatedHours: 7, distanceKm: 317, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },

    // From Cox's Bazar
    { routeId: "NP-COX-057", origin: "Cox's Bazar", destination: "Dinajpur", estimatedHours: 14, distanceKm: 728, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-COX-058", origin: "Cox's Bazar", destination: "Sylhet", estimatedHours: 9, distanceKm: 530, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-COX-059", origin: "Cox's Bazar", destination: "Bogura", estimatedHours: 11, distanceKm: 587, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-COX-060", origin: "Cox's Bazar", destination: "Rajshahi", estimatedHours: 12, distanceKm: 646, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-COX-061", origin: "Cox's Bazar", destination: "Dhaka", estimatedHours: 7, distanceKm: 392, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-COX-062", origin: "Cox's Bazar", destination: "Khulna", estimatedHours: 11, distanceKm: 516, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-COX-063", origin: "Cox's Bazar", destination: "Barisal", estimatedHours: 10, distanceKm: 467, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-COX-064", origin: "Cox's Bazar", destination: "Chittagong", estimatedHours: 3, distanceKm: 150, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },

    // From Chittagong
    { routeId: "NP-CTG-065", origin: "Chittagong", destination: "Dinajpur", estimatedHours: 11, distanceKm: 578, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-CTG-066", origin: "Chittagong", destination: "Sylhet", estimatedHours: 7, distanceKm: 380, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-CTG-067", origin: "Chittagong", destination: "Bogura", estimatedHours: 8, distanceKm: 437, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-CTG-068", origin: "Chittagong", destination: "Rajshahi", estimatedHours: 9, distanceKm: 496, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-CTG-069", origin: "Chittagong", destination: "Dhaka", estimatedHours: 4, distanceKm: 242, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-CTG-070", origin: "Chittagong", destination: "Khulna", estimatedHours: 8, distanceKm: 366, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-CTG-071", origin: "Chittagong", destination: "Barisal", estimatedHours: 7, distanceKm: 317, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
    { routeId: "NP-CTG-072", origin: "Chittagong", destination: "Cox's Bazar", estimatedHours: 3, distanceKm: 150, fares: { PREMIUM: 0, BUSINESS: 0, ECONOMY: 0 } },
  ];

  const routesToInsert = routesData.map(r => ({
    routeId: r.routeId,
    origin: r.origin,
    destination: r.destination,
    estimatedHours: r.estimatedHours,
    distanceKm: r.distanceKm,
  }));

  await prisma.route.createMany({ 
    data: routesToInsert, 
    skipDuplicates: true 
  });
  console.log(`3. Created ${routesData.length} master routes.`);

// 4. Generate the Manual Fares Matrix
  const dbRoutes = await prisma.route.findMany();
  
  const getDbRouteId = (origin: string, destination: string) => {
    const route = dbRoutes.find(r => r.origin === origin && r.destination === destination);
    if (!route) throw new Error(`Route not found in DB: ${origin} -> ${destination}`);
    return route.id;
  };

  const faresToCreate = [];

  for (const r of routesData) {
    const internalRouteId = getDbRouteId(r.origin, r.destination);
    
    faresToCreate.push({ 
      routeId: internalRouteId, 
      origin: r.origin,             // <-- Injected here
      destination: r.destination,   // <-- Injected here
      tier: BusTier.PREMIUM, 
      price: r.fares.PREMIUM 
    });
    
    faresToCreate.push({ 
      routeId: internalRouteId, 
      origin: r.origin,             // <-- Injected here
      destination: r.destination,   // <-- Injected here
      tier: BusTier.BUSINESS, 
      price: r.fares.BUSINESS 
    });
    
    faresToCreate.push({ 
      routeId: internalRouteId, 
      origin: r.origin,             // <-- Injected here
      destination: r.destination,   // <-- Injected here
      tier: BusTier.ECONOMY, 
      price: r.fares.ECONOMY 
    });
  }

  await prisma.fare.createMany({ data: faresToCreate });
  console.log(`4. Manually set 216 Fare rules across all routes and tiers.`);

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. Advanced 3-Day Fleet Rotation Schedule Engine (All 9 Depots)
  // ═══════════════════════════════════════════════════════════════════════════

  // 5a. Fetch all buses grouped by depot city + modelName
  const allBuses = await prisma.bus.findMany({
    include: { depot: true },
    orderBy: { registrationNumber: 'asc' },
  });

  const busesMap: Record<string, Record<string, typeof allBuses>> = {};
  for (const bus of allBuses) {
    const depotName = bus.depot.city;
    if (!busesMap[depotName]) busesMap[depotName] = {};
    if (!busesMap[depotName][bus.modelName]) busesMap[depotName][bus.modelName] = [];
    busesMap[depotName][bus.modelName].push(bus);
  }

  // 5b. 72-Route Schedule Configuration
  const routeConfigs = [
    // From Dinajpur (8 routes)
    { routeId: "NP-DNJ-001", origin: "Dinajpur", destination: "Sylhet", assignedModel: "Scania Legacy SR2", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-DNJ-002", origin: "Dinajpur", destination: "Bogura", assignedModel: "Eicher Pro", outboundTime: "08:00 AM", inboundTime: "04:00 PM" },
    { routeId: "NP-DNJ-003", origin: "Dinajpur", destination: "Rajshahi", assignedModel: "Ashok Leyland Eagle", outboundTime: "08:30 AM", inboundTime: "03:00 PM" },
    { routeId: "NP-DNJ-004", origin: "Dinajpur", destination: "Dhaka", assignedModel: "Volvo B9R", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-DNJ-005", origin: "Dinajpur", destination: "Khulna", assignedModel: "Hyundai Universe", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-DNJ-006", origin: "Dinajpur", destination: "Barisal", assignedModel: "Hino RN8J", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-DNJ-007", origin: "Dinajpur", destination: "Cox's Bazar", assignedModel: "MAN 24.460", outboundTime: "03:00 PM", inboundTime: "03:00 PM" },
    { routeId: "NP-DNJ-008", origin: "Dinajpur", destination: "Chittagong", assignedModel: "Mercedes-Benz OM 906", outboundTime: "03:00 PM", inboundTime: "03:00 PM" },

    // From Sylhet (8 routes)
    { routeId: "NP-SYL-009", origin: "Sylhet", destination: "Dinajpur", assignedModel: "MAN 24.460", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-SYL-010", origin: "Sylhet", destination: "Bogura", assignedModel: "Volvo B9R", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-SYL-011", origin: "Sylhet", destination: "Rajshahi", assignedModel: "Hino RN8J", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-SYL-012", origin: "Sylhet", destination: "Dhaka", assignedModel: "Eicher Pro", outboundTime: "08:30 AM", inboundTime: "03:00 PM" },
    { routeId: "NP-SYL-013", origin: "Sylhet", destination: "Khulna", assignedModel: "Mercedes-Benz OM 906", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-SYL-014", origin: "Sylhet", destination: "Barisal", assignedModel: "Hyundai Universe", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-SYL-015", origin: "Sylhet", destination: "Cox's Bazar", assignedModel: "Scania Legacy SR2", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-SYL-016", origin: "Sylhet", destination: "Chittagong", assignedModel: "Ashok Leyland Eagle", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },

    // From Bogura (8 routes)
    { routeId: "NP-BOG-017", origin: "Bogura", destination: "Dinajpur", assignedModel: "Eicher Pro", outboundTime: "08:00 AM", inboundTime: "04:00 PM" },
    { routeId: "NP-BOG-018", origin: "Bogura", destination: "Sylhet", assignedModel: "Hino RN8J", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-BOG-019", origin: "Bogura", destination: "Rajshahi", assignedModel: "Hino AK1J", outboundTime: "08:00 AM", inboundTime: "04:00 PM" },
    { routeId: "NP-BOG-020", origin: "Bogura", destination: "Dhaka", assignedModel: "Ashok Leyland Eagle", outboundTime: "08:30 AM", inboundTime: "03:00 PM" },
    { routeId: "NP-BOG-021", origin: "Bogura", destination: "Khulna", assignedModel: "Volvo B9R", outboundTime: "08:30 AM", inboundTime: "03:00 PM" },
    { routeId: "NP-BOG-022", origin: "Bogura", destination: "Barisal", assignedModel: "Hyundai Universe", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-BOG-023", origin: "Bogura", destination: "Cox's Bazar", assignedModel: "MAN 24.460", outboundTime: "03:00 PM", inboundTime: "03:00 PM" },
    { routeId: "NP-BOG-024", origin: "Bogura", destination: "Chittagong", assignedModel: "Scania Legacy SR2", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },

    // From Rajshahi (8 routes)
    { routeId: "NP-RAJ-025", origin: "Rajshahi", destination: "Dinajpur", assignedModel: "Eicher Pro", outboundTime: "08:30 AM", inboundTime: "03:00 PM" },
    { routeId: "NP-RAJ-026", origin: "Rajshahi", destination: "Sylhet", assignedModel: "Scania Legacy SR2", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-RAJ-027", origin: "Rajshahi", destination: "Bogura", assignedModel: "Hino AK1J", outboundTime: "08:00 AM", inboundTime: "04:00 PM" },
    { routeId: "NP-RAJ-028", origin: "Rajshahi", destination: "Dhaka", assignedModel: "Volvo B9R", outboundTime: "08:30 AM", inboundTime: "03:00 PM" },
    { routeId: "NP-RAJ-029", origin: "Rajshahi", destination: "Khulna", assignedModel: "Ashok Leyland Eagle", outboundTime: "08:30 AM", inboundTime: "03:00 PM" },
    { routeId: "NP-RAJ-030", origin: "Rajshahi", destination: "Barisal", assignedModel: "Hino RN8J", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-RAJ-031", origin: "Rajshahi", destination: "Cox's Bazar", assignedModel: "MAN 24.460", outboundTime: "03:00 PM", inboundTime: "03:00 PM" },
    { routeId: "NP-RAJ-032", origin: "Rajshahi", destination: "Chittagong", assignedModel: "Mercedes-Benz OM 906", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },

    // From Dhaka (8 routes)
    { routeId: "NP-DHK-033", origin: "Dhaka", destination: "Dinajpur", assignedModel: "MAN 24.460", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-DHK-034", origin: "Dhaka", destination: "Sylhet", assignedModel: "Mercedes-Benz OM 906", outboundTime: "08:30 AM", inboundTime: "03:00 PM" },
    { routeId: "NP-DHK-035", origin: "Dhaka", destination: "Bogura", assignedModel: "Hino RN8J", outboundTime: "08:30 AM", inboundTime: "03:00 PM" },
    { routeId: "NP-DHK-036", origin: "Dhaka", destination: "Rajshahi", assignedModel: "Scania Legacy SR2", outboundTime: "08:30 AM", inboundTime: "03:00 PM" },
    { routeId: "NP-DHK-037", origin: "Dhaka", destination: "Khulna", assignedModel: "Hyundai Universe", outboundTime: "08:30 AM", inboundTime: "03:00 PM" },
    { routeId: "NP-DHK-038", origin: "Dhaka", destination: "Barisal", assignedModel: "Volvo B9R", outboundTime: "08:00 AM", inboundTime: "04:00 PM" },
    { routeId: "NP-DHK-039", origin: "Dhaka", destination: "Cox's Bazar", assignedModel: "MAN 24.460", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-DHK-040", origin: "Dhaka", destination: "Chittagong", assignedModel: "Scania Legacy SR2", outboundTime: "08:30 AM", inboundTime: "03:00 PM" },

    // From Khulna (8 routes)
    { routeId: "NP-KHL-041", origin: "Khulna", destination: "Dinajpur", assignedModel: "Hino RN8J", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-KHL-042", origin: "Khulna", destination: "Sylhet", assignedModel: "Scania Legacy SR2", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-KHL-043", origin: "Khulna", destination: "Bogura", assignedModel: "Hyundai Universe", outboundTime: "08:30 AM", inboundTime: "03:00 PM" },
    { routeId: "NP-KHL-044", origin: "Khulna", destination: "Rajshahi", assignedModel: "Volvo B9R", outboundTime: "08:30 AM", inboundTime: "03:00 PM" },
    { routeId: "NP-KHL-045", origin: "Khulna", destination: "Dhaka", assignedModel: "Volvo B9R", outboundTime: "08:30 AM", inboundTime: "03:00 PM" },
    { routeId: "NP-KHL-046", origin: "Khulna", destination: "Barisal", assignedModel: "Ashok Leyland Eagle", outboundTime: "08:00 AM", inboundTime: "04:00 PM" },
    { routeId: "NP-KHL-047", origin: "Khulna", destination: "Cox's Bazar", assignedModel: "MAN 24.460", outboundTime: "03:00 PM", inboundTime: "03:00 PM" },
    { routeId: "NP-KHL-048", origin: "Khulna", destination: "Chittagong", assignedModel: "Hino RN8J", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },

    // From Barisal (8 routes)
    { routeId: "NP-BAR-049", origin: "Barisal", destination: "Dinajpur", assignedModel: "Scania Legacy SR2", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-BAR-050", origin: "Barisal", destination: "Sylhet", assignedModel: "Hino RN8J", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-BAR-051", origin: "Barisal", destination: "Bogura", assignedModel: "Hyundai Universe", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-BAR-052", origin: "Barisal", destination: "Rajshahi", assignedModel: "Volvo B9R", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-BAR-053", origin: "Barisal", destination: "Dhaka", assignedModel: "Volvo B9R", outboundTime: "08:00 AM", inboundTime: "04:00 PM" },
    { routeId: "NP-BAR-054", origin: "Barisal", destination: "Khulna", assignedModel: "Ashok Leyland Eagle", outboundTime: "08:00 AM", inboundTime: "04:00 PM" },
    { routeId: "NP-BAR-055", origin: "Barisal", destination: "Cox's Bazar", assignedModel: "MAN 24.460", outboundTime: "03:00 PM", inboundTime: "03:00 PM" },
    { routeId: "NP-BAR-056", origin: "Barisal", destination: "Chittagong", assignedModel: "Hino RN8J", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },

    // From Cox's Bazar (8 routes)
    { routeId: "NP-COX-057", origin: "Cox's Bazar", destination: "Dinajpur", assignedModel: "MAN 24.460", outboundTime: "03:00 PM", inboundTime: "03:00 PM" },
    { routeId: "NP-COX-058", origin: "Cox's Bazar", destination: "Sylhet", assignedModel: "Scania Legacy SR2", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-COX-059", origin: "Cox's Bazar", destination: "Bogura", assignedModel: "Mercedes-Benz OM 906", outboundTime: "03:00 PM", inboundTime: "03:00 PM" },
    { routeId: "NP-COX-060", origin: "Cox's Bazar", destination: "Rajshahi", assignedModel: "MAN 24.460", outboundTime: "03:00 PM", inboundTime: "03:00 PM" },
    { routeId: "NP-COX-061", origin: "Cox's Bazar", destination: "Dhaka", assignedModel: "Scania Legacy SR2", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-COX-062", origin: "Cox's Bazar", destination: "Khulna", assignedModel: "MAN 24.460", outboundTime: "03:00 PM", inboundTime: "03:00 PM" },
    { routeId: "NP-COX-063", origin: "Cox's Bazar", destination: "Barisal", assignedModel: "Mercedes-Benz OM 906", outboundTime: "03:00 PM", inboundTime: "03:00 PM" },
    { routeId: "NP-COX-064", origin: "Cox's Bazar", destination: "Chittagong", assignedModel: "Volvo B9R", outboundTime: "08:00 AM", inboundTime: "04:00 PM" },

    // From Chittagong (8 routes)
    { routeId: "NP-CTG-065", origin: "Chittagong", destination: "Dinajpur", assignedModel: "MAN 24.460", outboundTime: "03:00 PM", inboundTime: "03:00 PM" },
    { routeId: "NP-CTG-066", origin: "Chittagong", destination: "Sylhet", assignedModel: "Scania Legacy SR2", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-CTG-067", origin: "Chittagong", destination: "Bogura", assignedModel: "Mercedes-Benz OM 906", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-CTG-068", origin: "Chittagong", destination: "Rajshahi", assignedModel: "MAN 24.460", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-CTG-069", origin: "Chittagong", destination: "Dhaka", assignedModel: "Scania Legacy SR2", outboundTime: "08:30 AM", inboundTime: "03:00 PM" },
    { routeId: "NP-CTG-070", origin: "Chittagong", destination: "Khulna", assignedModel: "MAN 24.460", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-CTG-071", origin: "Chittagong", destination: "Barisal", assignedModel: "Mercedes-Benz OM 906", outboundTime: "08:00 PM", inboundTime: "08:00 PM" },
    { routeId: "NP-CTG-072", origin: "Chittagong", destination: "Cox's Bazar", assignedModel: "Volvo B9R", outboundTime: "08:00 AM", inboundTime: "04:00 PM" },
  ];

  // 5c. Generate 31-day rolling timetable with 3-bus rotation
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const TOTAL_DAYS = 31;
  const schedulesData: Array<{
    busId: string;
    routeId: string;
    origin: string;
    destination: string;
    busName: string;
    registrationNumber: string;
    departureTime: Date;
    arrivalTime: Date;
  }> = [];

  let skippedRoutes = 0;

  for (const config of routeConfigs) {
    // Find the bus pool for this route's origin depot and assigned model
    const depotBuses = busesMap[config.origin];
    if (!depotBuses) {
      skippedRoutes++;
      continue;
    }
    const assignedBuses = depotBuses[config.assignedModel];
    if (!assignedBuses || assignedBuses.length < 3) {
      skippedRoutes++;
      continue;
    }

    // Find outbound and inbound route records from DB
    const outboundRoute = dbRoutes.find(r => r.origin === config.origin && r.destination === config.destination);
    const inboundRoute = dbRoutes.find(r => r.origin === config.destination && r.destination === config.origin);
    if (!outboundRoute || !inboundRoute) {
      skippedRoutes++;
      continue;
    }

    // Parse AM/PM departure times
    const outTimeParsed = parse12HourTime(config.outboundTime);
    const inTimeParsed = parse12HourTime(config.inboundTime);

    for (let dayOffset = 0; dayOffset < TOTAL_DAYS; dayOffset++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() + dayOffset);

      // 3-bus rotation: Bus 0 → outbound, Bus 1 → inbound, Bus 2 → resting (rotates daily)
      const outboundBus = assignedBuses[dayOffset % 3];
      const inboundBus = assignedBuses[(dayOffset + 1) % 3];
      // assignedBuses[(dayOffset + 2) % 3] is resting this day

      // Outbound schedule
      const outboundDepDate = new Date(currentDay);
      outboundDepDate.setHours(outTimeParsed.hour, outTimeParsed.minute, 0, 0);
      const outboundArrDate = getArrivalTime(outboundDepDate, outboundRoute.estimatedHours || 0);

      schedulesData.push({
        busId: outboundBus.id,
        routeId: outboundRoute.id,
        origin: config.origin,
        destination: config.destination,
        busName: outboundBus.modelName,
        registrationNumber: outboundBus.registrationNumber,
        departureTime: outboundDepDate,
        arrivalTime: outboundArrDate,
      });

      // Inbound schedule (return trip)
      const inboundDepDate = new Date(currentDay);
      inboundDepDate.setHours(inTimeParsed.hour, inTimeParsed.minute, 0, 0);
      const inboundArrDate = getArrivalTime(inboundDepDate, inboundRoute.estimatedHours || 0);

      schedulesData.push({
        busId: inboundBus.id,
        routeId: inboundRoute.id,
        origin: config.destination,
        destination: config.origin,
        busName: inboundBus.modelName,
        registrationNumber: inboundBus.registrationNumber,
        departureTime: inboundDepDate,
        arrivalTime: inboundArrDate,
      });
    }
  }

  // 5d. Bulk insert all schedules
  await prisma.schedule.createMany({ data: schedulesData });

  console.log(`5. Generated ${schedulesData.length} schedules across ${TOTAL_DAYS} days (${routeConfigs.length} route configs, ${skippedRoutes} skipped).`);
  console.log('--- Database Seeding Completed Successfully ---');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error('Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });