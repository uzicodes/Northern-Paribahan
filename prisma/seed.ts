import 'dotenv/config'; // Required so the seed script can read your .env file
import { PrismaClient, BusType } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Set up the Prisma 7 Postgres adapter
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Instantiate the client with the adapter
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('--- Starting Database Seeding (Northern Paribahan) ---');

    // 1. Clear existing operational records in correct foreign key order
    await prisma.ticket.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.schedule.deleteMany({});
    await prisma.route.deleteMany({});
    await prisma.bus.deleteMany({});

    console.log('1. Cleared all existing database records.');

    // 2. Define the Fleet (27 Buses total across 9 models, 3 buses each)
    const busesData = [
        // 3x MAN 24.460 (Sleeper, 40 seats) - Dedicated to Cox's Bazar
        { name: "MAN 24.460", registrationNumber: "DHAKA METRO-BA 15-5001", type: BusType.SLEEPER, capacity: 40 },
        { name: "MAN 24.460", registrationNumber: "DHAKA METRO-BA 15-5002", type: BusType.SLEEPER, capacity: 40 },
        { name: "MAN 24.460", registrationNumber: "DHAKA METRO-BA 15-5003", type: BusType.SLEEPER, capacity: 40 },

        // 3x Scania Legacy SR2 (AC, 46 seats) - Dedicated to Chittagong
        { name: "Scania Legacy SR2", registrationNumber: "DHAKA METRO-BA 15-3001", type: BusType.AC, capacity: 46 },
        { name: "Scania Legacy SR2", registrationNumber: "DHAKA METRO-BA 15-3002", type: BusType.AC, capacity: 46 },
        { name: "Scania Legacy SR2", registrationNumber: "DHAKA METRO-BA 15-3003", type: BusType.AC, capacity: 46 },

        // 3x Mercedes-Benz OM 906 (AC, 41 seats) - Dedicated to Barisal
        { name: "Mercedes-Benz OM 906", registrationNumber: "DHAKA METRO-BA 15-2001", type: BusType.AC, capacity: 41 },
        { name: "Mercedes-Benz OM 906", registrationNumber: "DHAKA METRO-BA 15-2002", type: BusType.AC, capacity: 41 },
        { name: "Mercedes-Benz OM 906", registrationNumber: "DHAKA METRO-BA 15-2003", type: BusType.AC, capacity: 41 },

        // 3x Volvo B9R (AC, 40 seats) - Dedicated to Sylhet
        { name: "Volvo B9R", registrationNumber: "DHAKA METRO-BA 15-1001", type: BusType.AC, capacity: 40 },
        { name: "Volvo B9R", registrationNumber: "DHAKA METRO-BA 15-1002", type: BusType.AC, capacity: 40 },
        { name: "Volvo B9R", registrationNumber: "DHAKA METRO-BA 15-1003", type: BusType.AC, capacity: 40 },

        // 3x Hyundai Universe (AC, 40 seats) - Dedicated to Khulna
        { name: "Hyundai Universe", registrationNumber: "DHAKA METRO-BA 15-7001", type: BusType.AC, capacity: 40 },
        { name: "Hyundai Universe", registrationNumber: "DHAKA METRO-BA 15-7002", type: BusType.AC, capacity: 40 },
        { name: "Hyundai Universe", registrationNumber: "DHAKA METRO-BA 15-7003", type: BusType.AC, capacity: 40 },

        // 3x Hino RN8J (AC, 36 seats) - Dedicated to Dhaka Regular AC
        { name: "Hino RN8J", registrationNumber: "DHAKA METRO-BA 15-4001", type: BusType.AC, capacity: 36 },
        { name: "Hino RN8J", registrationNumber: "DHAKA METRO-BA 15-4002", type: BusType.AC, capacity: 36 },
        { name: "Hino RN8J", registrationNumber: "DHAKA METRO-BA 15-4003", type: BusType.AC, capacity: 36 },

        // 3x Ashok Leyland Eagle (Non-AC, 45 seats) - Dedicated to Rajshahi
        { name: "Ashok Leyland Eagle", registrationNumber: "DHAKA METRO-BA 15-6001", type: BusType.NON_AC, capacity: 45 },
        { name: "Ashok Leyland Eagle", registrationNumber: "DHAKA METRO-BA 15-6002", type: BusType.NON_AC, capacity: 45 },
        { name: "Ashok Leyland Eagle", registrationNumber: "DHAKA METRO-BA 15-6003", type: BusType.NON_AC, capacity: 45 },

        // 3x Eicher Pro (Non-AC, 45 seats) - Dedicated to Bogura
        { name: "Eicher Pro", registrationNumber: "DHAKA METRO-BA 15-8001", type: BusType.NON_AC, capacity: 45 },
        { name: "Eicher Pro", registrationNumber: "DHAKA METRO-BA 15-8002", type: BusType.NON_AC, capacity: 45 },
        { name: "Eicher Pro", registrationNumber: "DHAKA METRO-BA 15-8003", type: BusType.NON_AC, capacity: 45 },

        // 3x Hino AK1J (Non-AC, 45 seats) - New Model
        { name: "Hino AK1J", registrationNumber: "DHAKA METRO-BA 15-9001", type: BusType.NON_AC, capacity: 45 },
        { name: "Hino AK1J", registrationNumber: "DHAKA METRO-BA 15-9002", type: BusType.NON_AC, capacity: 45 },
        { name: "Hino AK1J", registrationNumber: "DHAKA METRO-BA 15-9003", type: BusType.NON_AC, capacity: 45 },
    ];

    for (const bus of busesData) {
        await prisma.bus.create({ data: bus });
    }

    const allBuses = await prisma.bus.findMany({
        orderBy: { registrationNumber: 'asc' }
    });

    // Group buses by model name
    const busesByModel: Record<string, typeof allBuses> = {};
    for (const bus of allBuses) {
        if (!busesByModel[bus.name]) {
            busesByModel[bus.name] = [];
        }
        busesByModel[bus.name].push(bus);
    }

    console.log(`2. Inserted ${allBuses.length} buses across 9 models.`);

    // 3. Define Point-to-Point Destination Routes with Dinajpur as Central Hub
    const destinationConfigs = [
        { destination: "Cox's Bazar", estimatedHours: 17.0 },
        { destination: "Chittagong",   estimatedHours: 14.0 },
        { destination: "Barisal",      estimatedHours: 11.5 },
        { destination: "Sylhet",       estimatedHours: 11.5 },
        { destination: "Khulna",       estimatedHours: 10.0 },
        { destination: "Dhaka",        estimatedHours: 7.5 },
        { destination: "Rajshahi",     estimatedHours: 4.5 },
        { destination: "Bogura",       estimatedHours: 3.0 },
    ];

    const routesMap: Record<string, { outboundId: string; inboundId: string; estimatedHours: number }> = {};

    for (const item of destinationConfigs) {
        // Outbound: Dinajpur -> Destination
        const outbound = await prisma.route.create({
            data: {
                origin: "Dinajpur",
                destination: item.destination,
                estimatedHours: item.estimatedHours,
            },
        });

        // Inbound: Destination -> Dinajpur
        const inbound = await prisma.route.create({
            data: {
                origin: item.destination,
                destination: "Dinajpur",
                estimatedHours: item.estimatedHours,
            },
        });

        routesMap[item.destination] = {
            outboundId: outbound.id,
            inboundId: inbound.id,
            estimatedHours: item.estimatedHours,
        };
    }

    console.log(`3. Created 16 point-to-point routes (8 outbound + 8 return).`);

    // 4. Generate 30-Day Rolling Timetable (Day 0 through Day 30) with Standardized 3-Bus Rotation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const TOTAL_DAYS = 31; // Days 0 through 30 (31 days total)

    const schedulesData: {
        busId: string;
        routeId: string;
        origin: string;
        destination: string;
        busName: string;
        registrationNumber: string;
        departureTime: Date;
        arrivalTime: Date;
        fare: number;
    }[] = [];

    // -------------------------------------------------------------
    // Standardized 3-Bus Rotation for All Routes
    // Daily Rotation (modulo 3):
    // - Bus (dayOffset % 3): Outbound (Dinajpur -> Destination)
    // - Bus ((dayOffset + 1) % 3): Inbound (Destination -> Dinajpur)
    // - Bus ((dayOffset + 2) % 3): Resting (1-Day Strict Rest)
    // -------------------------------------------------------------
    const routeConfigs = [
        // 1. Cox's Bazar (MAN Sleeper, 17.0h) - Depart 15:00 (3:00 PM)
        {
            destination: "Cox's Bazar",
            modelName: "MAN 24.460",
            fare: 2200,
            estimatedHours: 17.0,
            outboundDep: { hour: 15, minute: 0 },
            inboundDep:  { hour: 15, minute: 0 },
        },
        // 2. Chittagong (Scania AC, 14.0h) - Depart 17:00 (5:00 PM)
        {
            destination: "Chittagong",
            modelName: "Scania Legacy SR2",
            fare: 1800,
            estimatedHours: 14.0,
            outboundDep: { hour: 17, minute: 0 },
            inboundDep:  { hour: 17, minute: 0 },
        },
        // 3. Barisal (Mercedes AC, 11.5h) - Depart 19:00 (7:00 PM)
        {
            destination: "Barisal",
            modelName: "Mercedes-Benz OM 906",
            fare: 1450,
            estimatedHours: 11.5,
            outboundDep: { hour: 19, minute: 0 },
            inboundDep:  { hour: 19, minute: 0 },
        },
        // 4. Sylhet (Volvo AC, 11.5h) - Depart 19:30 (7:30 PM)
        {
            destination: "Sylhet",
            modelName: "Volvo B9R",
            fare: 1450,
            estimatedHours: 11.5,
            outboundDep: { hour: 19, minute: 30 },
            inboundDep:  { hour: 19, minute: 30 },
        },
        // 5. Khulna (Hyundai AC, 10.0h) - Depart 20:30 (8:30 PM)
        {
            destination: "Khulna",
            modelName: "Hyundai Universe",
            fare: 1350,
            estimatedHours: 10.0,
            outboundDep: { hour: 20, minute: 30 },
            inboundDep:  { hour: 20, minute: 30 },
        },
        // 6. Dhaka (Hino AC, 7.5h) - Depart 08:30 (8:30 AM)
        {
            destination: "Dhaka",
            modelName: "Hino RN8J",
            fare: 1000,
            estimatedHours: 7.5,
            outboundDep: { hour: 8, minute: 30 },
            inboundDep:  { hour: 8, minute: 30 },
        },
        // 7. Rajshahi (Ashok Non-AC, 4.5h) - Depart 08:00 (8:00 AM)
        {
            destination: "Rajshahi",
            modelName: "Ashok Leyland Eagle",
            fare: 550,
            estimatedHours: 4.5,
            outboundDep: { hour: 8, minute: 0 },
            inboundDep:  { hour: 8, minute: 0 },
        },
        // 8. Bogura (Eicher Non-AC, 3.0h) - Depart 09:00 (9:00 AM)
        {
            destination: "Bogura",
            modelName: "Eicher Pro",
            fare: 350,
            estimatedHours: 3.0,
            outboundDep: { hour: 9, minute: 0 },
            inboundDep:  { hour: 9, minute: 0 },
        },
    ];

    for (const config of routeConfigs) {
        const buses = busesByModel[config.modelName];
        const routeInfo = routesMap[config.destination];

        for (let dayOffset = 0; dayOffset < TOTAL_DAYS; dayOffset++) {
            const currentDay = new Date(today);
            currentDay.setDate(today.getDate() + dayOffset);

            // Strict 3-Bus Rotation Cycle: (dayOffset + busIndex) % 3
            const outboundBus = buses[dayOffset % 3];
            const inboundBus  = buses[(dayOffset + 1) % 3];
            // Resting Bus: buses[(dayOffset + 2) % 3]

            // 1. Outbound (Dinajpur -> Destination)
            const outboundDep = new Date(currentDay);
            outboundDep.setHours(config.outboundDep.hour, config.outboundDep.minute, 0, 0);
            const outboundArr = new Date(outboundDep.getTime() + config.estimatedHours * 60 * 60 * 1000);

            schedulesData.push({
                busId: outboundBus.id,
                routeId: routeInfo.outboundId,
                origin: "Dinajpur",
                destination: config.destination,
                busName: outboundBus.name,
                registrationNumber: outboundBus.registrationNumber,
                departureTime: outboundDep,
                arrivalTime: outboundArr,
                fare: config.fare,
            });

            // 2. Inbound (Destination -> Dinajpur)
            const inboundDep = new Date(currentDay);
            inboundDep.setHours(config.inboundDep.hour, config.inboundDep.minute, 0, 0);
            const inboundArr = new Date(inboundDep.getTime() + config.estimatedHours * 60 * 60 * 1000);

            schedulesData.push({
                busId: inboundBus.id,
                routeId: routeInfo.inboundId,
                origin: config.destination,
                destination: "Dinajpur",
                busName: inboundBus.name,
                registrationNumber: inboundBus.registrationNumber,
                departureTime: inboundDep,
                arrivalTime: inboundArr,
                fare: config.fare,
            });
        }
    }

    // Insert all schedules in bulk
    await prisma.schedule.createMany({
        data: schedulesData,
    });

    console.log(`4. Successfully generated and saved ${schedulesData.length} schedules across 30 days (Day 0 through Day 30)!`);
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