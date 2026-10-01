import { prisma } from '@/lib/db';

interface RouteConfig {
  routeId: string;
  origin: string;
  destination: string;
  assignedModel: string;
  outboundTime: string;
  inboundTime: string;
}

export const ROUTE_CONFIGS: RouteConfig[] = [
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

function parse12HourTime(timeStr: string): { hour: number; minute: number } {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (hours === 12) hours = modifier === 'AM' ? 0 : 12;
  else if (modifier === 'PM') hours += 12;
  return { hour: hours, minute: minutes };
}

/**
 * Generates and inserts all 144 daily rotating schedules for a specific calendar date (YYYY-MM-DD in BST).
 * Loops through all 72 active routes and assigns rotating fleet buses.
 */
export async function generateDailySchedulesForDate(dateStr: string): Promise<number> {
  const [allBuses, routes] = await Promise.all([
    prisma.bus.findMany({
      include: { depot: true },
      orderBy: { registrationNumber: 'asc' },
    }),
    prisma.route.findMany(),
  ]);

  const busesMap: Record<string, Record<string, typeof allBuses>> = {};
  for (const bus of allBuses) {
    const depotName = bus.depot.city;
    if (!busesMap[depotName]) busesMap[depotName] = {};
    if (!busesMap[depotName][bus.modelName]) busesMap[depotName][bus.modelName] = [];
    busesMap[depotName][bus.modelName].push(bus);
  }

  // Deterministic 3-bus rotation offset relative to epoch (2026-09-11)
  const EPOCH = new Date('2026-09-11T00:00:00.000+06:00');
  const targetDate = new Date(`${dateStr}T00:00:00.000+06:00`);
  const diffDays = Math.round((targetDate.getTime() - EPOCH.getTime()) / (24 * 60 * 60 * 1000));
  const rotationOffset = ((diffDays % 3) + 3) % 3;

  const schedulesToInsert: Array<{
    busId: string;
    routeId: string;
    origin: string;
    destination: string;
    busName: string;
    registrationNumber: string;
    departureTime: Date;
    arrivalTime: Date;
  }> = [];

  for (const config of ROUTE_CONFIGS) {
    const depotBuses = busesMap[config.origin];
    if (!depotBuses) continue;

    const assignedBuses = depotBuses[config.assignedModel];
    if (!assignedBuses || assignedBuses.length < 3) continue;

    const outboundRoute = routes.find(
      (r) => r.origin === config.origin && r.destination === config.destination
    );
    const inboundRoute = routes.find(
      (r) => r.origin === config.destination && r.destination === config.origin
    );
    if (!outboundRoute || !inboundRoute) continue;

    const outboundBus = assignedBuses[rotationOffset % 3];
    const inboundBus = assignedBuses[(rotationOffset + 1) % 3];

    const outTime = parse12HourTime(config.outboundTime);
    const inTime = parse12HourTime(config.inboundTime);

    // Outbound schedule in BST (+06:00)
    const outHour = String(outTime.hour).padStart(2, '0');
    const outMin = String(outTime.minute).padStart(2, '0');
    const outboundDep = new Date(`${dateStr}T${outHour}:${outMin}:00.000+06:00`);
    const outboundArr = new Date(
      outboundDep.getTime() + (outboundRoute.estimatedHours || 0) * 3600000
    );

    schedulesToInsert.push({
      busId: outboundBus.id,
      routeId: outboundRoute.id,
      origin: config.origin,
      destination: config.destination,
      busName: outboundBus.modelName,
      registrationNumber: outboundBus.registrationNumber,
      departureTime: outboundDep,
      arrivalTime: outboundArr,
    });

    // Inbound schedule in BST (+06:00)
    const inHour = String(inTime.hour).padStart(2, '0');
    const inMin = String(inTime.minute).padStart(2, '0');
    const inboundDep = new Date(`${dateStr}T${inHour}:${inMin}:00.000+06:00`);
    const inboundArr = new Date(
      inboundDep.getTime() + (inboundRoute.estimatedHours || 0) * 3600000
    );

    schedulesToInsert.push({
      busId: inboundBus.id,
      routeId: inboundRoute.id,
      origin: config.destination,
      destination: config.origin,
      busName: inboundBus.modelName,
      registrationNumber: inboundBus.registrationNumber,
      departureTime: inboundDep,
      arrivalTime: inboundArr,
    });
  }

  if (schedulesToInsert.length > 0) {
    await prisma.schedule.createMany({ data: schedulesToInsert });
  }

  return schedulesToInsert.length;
}
