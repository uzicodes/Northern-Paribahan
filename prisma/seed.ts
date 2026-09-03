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
    console.log('--- Starting Database Seeding ---');

    // 1. Clear existing operational records in correct foreign key order
    await prisma.ticket.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.schedule.deleteMany({});
    await prisma.route.deleteMany({});
    await prisma.bus.deleteMany({});

    console.log('Cleared existing database records.');

    // 2. Define 24 Buses across 8 distinct models (3 buses per model for 3-bus rotation)
    const busesData = [
        // 1. Volvo B9R (AC, 40 seats)
        { name: "Volvo B9R", registrationNumber: "DHAKA METRO-BA 15-1001", type: BusType.AC, capacity: 40 },
        { name: "Volvo B9R", registrationNumber: "DHAKA METRO-BA 15-1002", type: BusType.AC, capacity: 40 },
        { name: "Volvo B9R", registrationNumber: "DHAKA METRO-BA 15-1003", type: BusType.AC, capacity: 40 },

        // 2. Mercedes-Benz OM 906 (AC, 41 seats)
        { name: "Mercedes-Benz OM 906", registrationNumber: "DHAKA METRO-BA 15-2001", type: BusType.AC, capacity: 41 },
        { name: "Mercedes-Benz OM 906", registrationNumber: "DHAKA METRO-BA 15-2002", type: BusType.AC, capacity: 41 },
        { name: "Mercedes-Benz OM 906", registrationNumber: "DHAKA METRO-BA 15-2003", type: BusType.AC, capacity: 41 },

        // 3. Scania Legacy SR2 (AC, 46 seats)
        { name: "Scania Legacy SR2", registrationNumber: "DHAKA METRO-BA 15-3001", type: BusType.AC, capacity: 46 },
        { name: "Scania Legacy SR2", registrationNumber: "DHAKA METRO-BA 15-3002", type: BusType.AC, capacity: 46 },
        { name: "Scania Legacy SR2", registrationNumber: "DHAKA METRO-BA 15-3003", type: BusType.AC, capacity: 46 },

        // 4. Hino RN8J (AC, 36 seats)
        { name: "Hino RN8J", registrationNumber: "DHAKA METRO-BA 15-4001", type: BusType.AC, capacity: 36 },
        { name: "Hino RN8J", registrationNumber: "DHAKA METRO-BA 15-4002", type: BusType.AC, capacity: 36 },
        { name: "Hino RN8J", registrationNumber: "DHAKA METRO-BA 15-4003", type: BusType.AC, capacity: 36 },

        // 5. MAN 24.460 (Sleeper, 40 seats)
        { name: "MAN 24.460", registrationNumber: "DHAKA METRO-BA 15-5001", type: BusType.SLEEPER, capacity: 40 },
        { name: "MAN 24.460", registrationNumber: "DHAKA METRO-BA 15-5002", type: BusType.SLEEPER, capacity: 40 },
        { name: "MAN 24.460", registrationNumber: "DHAKA METRO-BA 15-5003", type: BusType.SLEEPER, capacity: 40 },

        // 6. Ashok Leyland Eagle (Non-AC, 45 seats)
        { name: "Ashok Leyland Eagle", registrationNumber: "DHAKA METRO-BA 15-6001", type: BusType.NON_AC, capacity: 45 },
        { name: "Ashok Leyland Eagle", registrationNumber: "DHAKA METRO-BA 15-6002", type: BusType.NON_AC, capacity: 45 },
        { name: "Ashok Leyland Eagle", registrationNumber: "DHAKA METRO-BA 15-6003", type: BusType.NON_AC, capacity: 45 },

        // 7. Hyundai Universe (AC, 40 seats) - New Model
        { name: "Hyundai Universe", registrationNumber: "DHAKA METRO-BA 15-7001", type: BusType.AC, capacity: 40 },
        { name: "Hyundai Universe", registrationNumber: "DHAKA METRO-BA 15-7002", type: BusType.AC, capacity: 40 },
        { name: "Hyundai Universe", registrationNumber: "DHAKA METRO-BA 15-7003", type: BusType.AC, capacity: 40 },

        // 8. Eicher Pro (Non-AC, 45 seats) - New Model
        { name: "Eicher Pro", registrationNumber: "DHAKA METRO-BA 15-8001", type: BusType.NON_AC, capacity: 45 },
        { name: "Eicher Pro", registrationNumber: "DHAKA METRO-BA 15-8002", type: BusType.NON_AC, capacity: 45 },
        { name: "Eicher Pro", registrationNumber: "DHAKA METRO-BA 15-8003", type: BusType.NON_AC, capacity: 45 },
    ];

    // Insert all 24 buses
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

    console.log(`Inserted ${allBuses.length} buses across ${Object.keys(busesByModel).length} models.`);

    // 3. Define 8 Point-to-Point Destination Route Configurations with Dinajpur as Central Hub
    const routeConfigs = [
        {
            destination: "Cox's Bazar",
            estimatedHours: 17.0,
            modelName: "MAN 24.460", // Luxury Sleeper for the longest journey
            fare: 2200,
            outboundDep: { hour: 18, minute: 0 },  // 06:00 PM
            inboundDep: { hour: 18, minute: 0 },   // 06:00 PM
        },
        {
            destination: "Chittagong",
            estimatedHours: 14.0,
            modelName: "Scania Legacy SR2", // Multi-Axle AC
            fare: 1800,
            outboundDep: { hour: 19, minute: 0 },  // 07:00 PM
            inboundDep: { hour: 19, minute: 0 },   // 07:00 PM
        },
        {
            destination: "Barisal",
            estimatedHours: 11.5,
            modelName: "Volvo B9R", // Premium AC
            fare: 1500,
            outboundDep: { hour: 20, minute: 0 },  // 08:00 PM
            inboundDep: { hour: 20, minute: 0 },   // 08:00 PM
        },
        {
            destination: "Sylhet",
            estimatedHours: 11.5,
            modelName: "Hyundai Universe", // Modern AC
            fare: 1500,
            outboundDep: { hour: 20, minute: 30 }, // 08:30 PM
            inboundDep: { hour: 20, minute: 30 },  // 08:30 PM
        },
        {
            destination: "Khulna",
            estimatedHours: 10.0,
            modelName: "Mercedes-Benz OM 906", // Comfort AC
            fare: 1350,
            outboundDep: { hour: 21, minute: 0 },  // 09:00 PM
            inboundDep: { hour: 21, minute: 0 },   // 09:00 PM
        },
        {
            destination: "Dhaka",
            estimatedHours: 8.0,
            modelName: "Hino RN8J", // Executive AC
            fare: 1100,
            outboundDep: { hour: 22, minute: 0 },  // 10:00 PM
            inboundDep: { hour: 22, minute: 0 },   // 10:00 PM
        },
        {
            destination: "Rajshahi",
            estimatedHours: 4.5,
            modelName: "Ashok Leyland Eagle", // Economy Non-AC
            fare: 550,
            outboundDep: { hour: 8, minute: 0 },   // 08:00 AM
            inboundDep: { hour: 14, minute: 30 },  // 02:30 PM
        },
        {
            destination: "Bogura",
            estimatedHours: 3.0,
            modelName: "Eicher Pro", // Express Non-AC
            fare: 350,
            outboundDep: { hour: 9, minute: 0 },   // 09:00 AM
            inboundDep: { hour: 15, minute: 0 },   // 03:00 PM
        },
    ];

    // 4. Create Outbound & Inbound Route records
    const routesMap: Record<string, { outboundId: string; inboundId: string }> = {};

    for (const config of routeConfigs) {
        // Outbound: Dinajpur -> Destination
        const outbound = await prisma.route.create({
            data: {
                origin: "Dinajpur",
                destination: config.destination,
                estimatedHours: config.estimatedHours,
            },
        });

        // Inbound: Destination -> Dinajpur
        const inbound = await prisma.route.create({
            data: {
                origin: config.destination,
                destination: "Dinajpur",
                estimatedHours: config.estimatedHours,
            },
        });

        routesMap[config.destination] = {
            outboundId: outbound.id,
            inboundId: inbound.id,
        };
    }

    console.log(`Created 16 point-to-point routes (8 outbound + 8 return).`);

    // 5. Generate 3-Day Timetable with strict 3-Bus Rotation
    // Day 0 = Today, Day 1 = Tomorrow, Day 2 = Day after tomorrow
    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);

    const schedulesData: {
        busId: string;
        routeId: string;
        departureTime: Date;
        arrivalTime: Date;
        fare: number;
    }[] = [];

    for (const config of routeConfigs) {
        const assignedBuses = busesByModel[config.modelName];
        if (!assignedBuses || assignedBuses.length < 3) {
            throw new Error(`Model ${config.modelName} does not have 3 buses for rotation.`);
        }

        const { outboundId, inboundId } = routesMap[config.destination];

        for (let day = 0; day < 3; day++) {
            const currentDay = new Date(baseDate);
            currentDay.setDate(baseDate.getDate() + day);

            // 3-Bus Rotation Pattern:
            // Bus 1 (index (day + 0) % 3): Outbound (Departs Dinajpur)
            // Bus 2 (index (day + 1) % 3): Inbound (Departs Destination)
            // Bus 3 (index (day + 2) % 3): Resting / Maintenance
            const outboundBus = assignedBuses[day % 3];
            const inboundBus = assignedBuses[(day + 1) % 3];

            // 1. Outbound Departure (Dinajpur -> Destination)
            const outboundDep = new Date(currentDay);
            outboundDep.setHours(config.outboundDep.hour, config.outboundDep.minute, 0, 0);
            const outboundArr = new Date(outboundDep.getTime() + config.estimatedHours * 60 * 60 * 1000);

            schedulesData.push({
                busId: outboundBus.id,
                routeId: outboundId,
                departureTime: outboundDep,
                arrivalTime: outboundArr,
                fare: config.fare,
            });

            // 2. Inbound Departure (Destination -> Dinajpur)
            const inboundDep = new Date(currentDay);
            inboundDep.setHours(config.inboundDep.hour, config.inboundDep.minute, 0, 0);
            const inboundArr = new Date(inboundDep.getTime() + config.estimatedHours * 60 * 60 * 1000);

            schedulesData.push({
                busId: inboundBus.id,
                routeId: inboundId,
                departureTime: inboundDep,
                arrivalTime: inboundArr,
                fare: config.fare,
            });
        }
    }

    // Insert all generated schedules
    await prisma.schedule.createMany({
        data: schedulesData,
    });

    console.log(`Successfully generated and saved ${schedulesData.length} schedules across 3 days!`);
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