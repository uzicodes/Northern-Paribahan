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

    // 2. Define the Expanded Fleet (27 Buses total across 8 models)
    const busesData = [
        // 4x MAN 24.460 (Sleeper, 40 seats) - Dedicated to Cox's Bazar & Dhaka Sleeper Express
        { name: "MAN 24.460", registrationNumber: "DHAKA METRO-BA 15-5001", type: BusType.SLEEPER, capacity: 40 },
        { name: "MAN 24.460", registrationNumber: "DHAKA METRO-BA 15-5002", type: BusType.SLEEPER, capacity: 40 },
        { name: "MAN 24.460", registrationNumber: "DHAKA METRO-BA 15-5003", type: BusType.SLEEPER, capacity: 40 },
        { name: "MAN 24.460", registrationNumber: "DHAKA METRO-BA 15-5004", type: BusType.SLEEPER, capacity: 40 },

        // 4x Scania Legacy SR2 (AC, 46 seats) - Dedicated to Chittagong & Dhaka Scania Express
        { name: "Scania Legacy SR2", registrationNumber: "DHAKA METRO-BA 15-3001", type: BusType.AC, capacity: 46 },
        { name: "Scania Legacy SR2", registrationNumber: "DHAKA METRO-BA 15-3002", type: BusType.AC, capacity: 46 },
        { name: "Scania Legacy SR2", registrationNumber: "DHAKA METRO-BA 15-3003", type: BusType.AC, capacity: 46 },
        { name: "Scania Legacy SR2", registrationNumber: "DHAKA METRO-BA 15-3004", type: BusType.AC, capacity: 46 },

        // 4x Mercedes-Benz OM 906 (AC, 41 seats) - Dedicated to Barisal & Dhaka Mercedes Express
        { name: "Mercedes-Benz OM 906", registrationNumber: "DHAKA METRO-BA 15-2001", type: BusType.AC, capacity: 41 },
        { name: "Mercedes-Benz OM 906", registrationNumber: "DHAKA METRO-BA 15-2002", type: BusType.AC, capacity: 41 },
        { name: "Mercedes-Benz OM 906", registrationNumber: "DHAKA METRO-BA 15-2003", type: BusType.AC, capacity: 41 },
        { name: "Mercedes-Benz OM 906", registrationNumber: "DHAKA METRO-BA 15-2004", type: BusType.AC, capacity: 41 },

        // 3x Volvo B9R (AC, 40 seats) - Dedicated to Khulna
        { name: "Volvo B9R", registrationNumber: "DHAKA METRO-BA 15-1001", type: BusType.AC, capacity: 40 },
        { name: "Volvo B9R", registrationNumber: "DHAKA METRO-BA 15-1002", type: BusType.AC, capacity: 40 },
        { name: "Volvo B9R", registrationNumber: "DHAKA METRO-BA 15-1003", type: BusType.AC, capacity: 40 },

        // 3x Hyundai Universe (AC, 40 seats) - Dedicated to Sylhet
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

    console.log(`2. Inserted ${allBuses.length} buses across 8 models.`);

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

    // 4. Generate 3-Day Timetable with Strict Rotations
    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);

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
    // A. Standard 3-Bus Rotation (Sylhet, Khulna, Dhaka Primary, Rajshahi, Bogura)
    // Daily Cycle:
    // - Bus 1: Outbound (Dinajpur -> Destination)
    // - Bus 2: Inbound (Destination -> Dinajpur)
    // - Bus 3: Rests
    // -------------------------------------------------------------
    const standard3BusConfigs = [
        {
            destination: "Sylhet",
            modelName: "Hyundai Universe",
            fare: 1450,
            outboundDep: { hour: 20, minute: 30 }, // 08:30 PM
            inboundDep: { hour: 20, minute: 30 },  // 08:30 PM
        },
        {
            destination: "Khulna",
            modelName: "Volvo B9R",
            fare: 1350,
            outboundDep: { hour: 21, minute: 0 },  // 09:00 PM
            inboundDep: { hour: 21, minute: 0 },   // 09:00 PM
        },
        {
            destination: "Dhaka",
            modelName: "Hino RN8J",
            fare: 1000, // Standard AC fare
            outboundDep: { hour: 22, minute: 0 },  // 10:00 PM
            inboundDep: { hour: 22, minute: 0 },   // 10:00 PM
        },
        {
            destination: "Rajshahi",
            modelName: "Ashok Leyland Eagle",
            fare: 550, // Non-AC fare
            outboundDep: { hour: 8, minute: 0 },   // 08:00 AM
            inboundDep: { hour: 14, minute: 30 },  // 02:30 PM
        },
        {
            destination: "Bogura",
            modelName: "Eicher Pro",
            fare: 350, // Non-AC fare
            outboundDep: { hour: 9, minute: 0 },   // 09:00 AM
            inboundDep: { hour: 15, minute: 0 },   // 03:00 PM
        },
    ];

    for (const config of standard3BusConfigs) {
        const buses = busesByModel[config.modelName];
        const routeInfo = routesMap[config.destination];

        for (let day = 0; day < 3; day++) {
            const currentDay = new Date(baseDate);
            currentDay.setDate(baseDate.getDate() + day);

            // 3-Bus Rotation Cycle
            const outboundBus = buses[day % 3];
            const inboundBus  = buses[(day + 1) % 3];
            // Resting Bus: buses[(day + 2) % 3]

            // 1. Outbound (Dinajpur -> Destination)
            const outboundDep = new Date(currentDay);
            outboundDep.setHours(config.outboundDep.hour, config.outboundDep.minute, 0, 0);
            const outboundArr = new Date(outboundDep.getTime() + routeInfo.estimatedHours * 60 * 60 * 1000);

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
            const inboundArr = new Date(inboundDep.getTime() + routeInfo.estimatedHours * 60 * 60 * 1000);

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

    // -------------------------------------------------------------
    // B. Premium 4-Bus Rotation (Cox's Bazar, Chittagong, Barisal + Dhaka Express)
    // Daily Cycle:
    // - Bus 1: Outbound to main destination (e.g., Cox's Bazar / Chittagong / Barisal)
    // - Bus 2: Inbound from main destination
    // - Bus 3: Round Trip Dinajpur <-> Dhaka Express (Outbound morning, Inbound evening)
    // - Bus 4: Rests (Strict 1-day rest)
    // -------------------------------------------------------------
    const dhakaRouteInfo = routesMap["Dhaka"];

    const premium4BusConfigs = [
        {
            destination: "Cox's Bazar",
            modelName: "MAN 24.460",
            mainFare: 2200, // Luxury Sleeper to Cox's Bazar
            dhakaFare: 1600, // Premium Sleeper to Dhaka
            mainOutboundDep: { hour: 18, minute: 0 }, // 06:00 PM
            mainInboundDep:  { hour: 18, minute: 0 }, // 06:00 PM
            dhakaOutboundDep: { hour: 7, minute: 0 }, // 07:00 AM (Morning Sleeper to Dhaka)
            dhakaInboundDep:  { hour: 21, minute: 30 }, // 09:30 PM (Night Sleeper back from Dhaka)
        },
        {
            destination: "Chittagong",
            modelName: "Scania Legacy SR2",
            mainFare: 1800, // Multi-Axle AC to Chittagong
            dhakaFare: 1350, // Multi-Axle AC to Dhaka
            mainOutboundDep: { hour: 19, minute: 0 }, // 07:00 PM
            mainInboundDep:  { hour: 19, minute: 0 }, // 07:00 PM
            dhakaOutboundDep: { hour: 8, minute: 30 }, // 08:30 AM (Morning AC to Dhaka)
            dhakaInboundDep:  { hour: 22, minute: 30 }, // 10:30 PM (Night AC back from Dhaka)
        },
        {
            destination: "Barisal",
            modelName: "Mercedes-Benz OM 906",
            mainFare: 1450, // Executive AC to Barisal
            dhakaFare: 1300, // Executive AC to Dhaka
            mainOutboundDep: { hour: 20, minute: 0 }, // 08:00 PM
            mainInboundDep:  { hour: 20, minute: 0 }, // 08:00 PM
            dhakaOutboundDep: { hour: 10, minute: 0 }, // 10:00 AM (Day AC to Dhaka)
            dhakaInboundDep:  { hour: 23, minute: 30 }, // 11:30 PM (Night AC back from Dhaka)
        },
    ];

    for (const config of premium4BusConfigs) {
        const buses = busesByModel[config.modelName];
        const mainRouteInfo = routesMap[config.destination];

        for (let day = 0; day < 3; day++) {
            const currentDay = new Date(baseDate);
            currentDay.setDate(baseDate.getDate() + day);

            // 4-Bus Rotation Cycle
            const mainOutboundBus = buses[day % 4];
            const mainInboundBus  = buses[(day + 1) % 4];
            const dhakaExpressBus = buses[(day + 2) % 4];
            // Resting Bus: buses[(day + 3) % 4]

            // 1. Outbound to Main Destination (Dinajpur -> Cox's/Chittagong/Barisal)
            const mainOutDep = new Date(currentDay);
            mainOutDep.setHours(config.mainOutboundDep.hour, config.mainOutboundDep.minute, 0, 0);
            const mainOutArr = new Date(mainOutDep.getTime() + mainRouteInfo.estimatedHours * 60 * 60 * 1000);

            schedulesData.push({
                busId: mainOutboundBus.id,
                routeId: mainRouteInfo.outboundId,
                origin: "Dinajpur",
                destination: config.destination,
                busName: mainOutboundBus.name,
                registrationNumber: mainOutboundBus.registrationNumber,
                departureTime: mainOutDep,
                arrivalTime: mainOutArr,
                fare: config.mainFare,
            });

            // 2. Inbound from Main Destination (Cox's/Chittagong/Barisal -> Dinajpur)
            const mainInDep = new Date(currentDay);
            mainInDep.setHours(config.mainInboundDep.hour, config.mainInboundDep.minute, 0, 0);
            const mainInArr = new Date(mainInDep.getTime() + mainRouteInfo.estimatedHours * 60 * 60 * 1000);

            schedulesData.push({
                busId: mainInboundBus.id,
                routeId: mainRouteInfo.inboundId,
                origin: config.destination,
                destination: "Dinajpur",
                busName: mainInboundBus.name,
                registrationNumber: mainInboundBus.registrationNumber,
                departureTime: mainInDep,
                arrivalTime: mainInArr,
                fare: config.mainFare,
            });

            // 3. Dhaka Express Outbound (Dinajpur -> Dhaka)
            const dhakaOutDep = new Date(currentDay);
            dhakaOutDep.setHours(config.dhakaOutboundDep.hour, config.dhakaOutboundDep.minute, 0, 0);
            const dhakaOutArr = new Date(dhakaOutDep.getTime() + dhakaRouteInfo.estimatedHours * 60 * 60 * 1000);

            schedulesData.push({
                busId: dhakaExpressBus.id,
                routeId: dhakaRouteInfo.outboundId,
                origin: "Dinajpur",
                destination: "Dhaka",
                busName: dhakaExpressBus.name,
                registrationNumber: dhakaExpressBus.registrationNumber,
                departureTime: dhakaOutDep,
                arrivalTime: dhakaOutArr,
                fare: config.dhakaFare,
            });

            // 4. Dhaka Express Inbound (Dhaka -> Dinajpur)
            const dhakaInDep = new Date(currentDay);
            dhakaInDep.setHours(config.dhakaInboundDep.hour, config.dhakaInboundDep.minute, 0, 0);
            const dhakaInArr = new Date(dhakaInDep.getTime() + dhakaRouteInfo.estimatedHours * 60 * 60 * 1000);

            schedulesData.push({
                busId: dhakaExpressBus.id,
                routeId: dhakaRouteInfo.inboundId,
                origin: "Dhaka",
                destination: "Dinajpur",
                busName: dhakaExpressBus.name,
                registrationNumber: dhakaExpressBus.registrationNumber,
                departureTime: dhakaInDep,
                arrivalTime: dhakaInArr,
                fare: config.dhakaFare,
            });
        }
    }

    // Insert all schedules in bulk
    await prisma.schedule.createMany({
        data: schedulesData,
    });

    console.log(`4. Successfully generated and saved ${schedulesData.length} schedules across 3 days!`);
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