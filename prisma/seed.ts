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

    // 4. Generate 30-Day Rolling Timetable (Day 0 through Day 30) with Strict Rotation & Snapshots
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
    // A. Standard 3-Bus Rotation (Sylhet, Khulna, Dhaka Regular, Rajshahi, Bogura)
    // Daily Rotation (modulo 3):
    // - Bus (dayOffset % 3): Outbound (Dinajpur -> Destination)
    // - Bus ((dayOffset + 1) % 3): Inbound (Destination -> Dinajpur)
    // - Bus ((dayOffset + 2) % 3): Resting
    // -------------------------------------------------------------
    const standard3BusConfigs = [
        // 1. Sylhet (Volvo AC, 11.5h) - Depart 19:30 (7:30 PM)
        {
            destination: "Sylhet",
            modelName: "Volvo B9R",
            fare: 1450,
            estimatedHours: 11.5,
            outboundDep: { hour: 19, minute: 30 },
            inboundDep:  { hour: 19, minute: 30 },
        },
        // 2. Khulna (Hyundai AC, 10.0h) - Depart 20:30 (8:30 PM)
        {
            destination: "Khulna",
            modelName: "Hyundai Universe",
            fare: 1350,
            estimatedHours: 10.0,
            outboundDep: { hour: 20, minute: 30 },
            inboundDep:  { hour: 20, minute: 30 },
        },
        // 3. Dhaka Regular (Hino AC, 7.5h) - Depart 08:30 (8:30 AM)
        {
            destination: "Dhaka",
            modelName: "Hino RN8J",
            fare: 1000,
            estimatedHours: 7.5,
            outboundDep: { hour: 8, minute: 30 },
            inboundDep:  { hour: 8, minute: 30 },
        },
        // 4. Rajshahi (Ashok Non-AC, 4.5h) - Depart 08:00 (8:00 AM)
        {
            destination: "Rajshahi",
            modelName: "Ashok Leyland Eagle",
            fare: 550,
            estimatedHours: 4.5,
            outboundDep: { hour: 8, minute: 0 },
            inboundDep:  { hour: 8, minute: 0 },
        },
        // 5. Bogura (Eicher Non-AC, 3.0h) - Depart 09:00 (9:00 AM)
        {
            destination: "Bogura",
            modelName: "Eicher Pro",
            fare: 350,
            estimatedHours: 3.0,
            outboundDep: { hour: 9, minute: 0 },
            inboundDep:  { hour: 9, minute: 0 },
        },
    ];

    for (const config of standard3BusConfigs) {
        const buses = busesByModel[config.modelName];
        const routeInfo = routesMap[config.destination];

        for (let dayOffset = 0; dayOffset < TOTAL_DAYS; dayOffset++) {
            const currentDay = new Date(today);
            currentDay.setDate(today.getDate() + dayOffset);

            // 3-Bus Rotation Cycle
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

    // -------------------------------------------------------------
    // B. Premium 4-Bus Rotation (Cox's Bazar, Chittagong, Barisal + Dhaka Express)
    // Daily Rotation (modulo 4):
    // - Bus (dayOffset % 4): Outbound to main destination
    // - Bus ((dayOffset + 1) % 4): Inbound from main destination
    // - Bus ((dayOffset + 2) % 4): Round-Trip Dinajpur <-> Dhaka Express
    // - Bus ((dayOffset + 3) % 4): Resting (Strict 1-day rest)
    // -------------------------------------------------------------
    const dhakaRouteInfo = routesMap["Dhaka"];

    const premium4BusConfigs = [
        // 1. Cox's Bazar (MAN Sleeper, 17.0h) - Depart 15:00 (3:00 PM)
        //    Dhaka Sleeper Express (7.5h) - Outbound: 22:30, Inbound: 09:00 next day
        {
            destination: "Cox's Bazar",
            modelName: "MAN 24.460",
            mainFare: 2200,
            dhakaFare: 1600,
            mainHours: 17.0,
            dhakaHours: 7.5,
            mainOutboundDep:  { hour: 15, minute: 0 },  // 03:00 PM
            mainInboundDep:   { hour: 15, minute: 0 },  // 03:00 PM
            dhakaOutboundDep: { hour: 22, minute: 30 }, // 10:30 PM (Night Sleeper to Dhaka)
            dhakaInboundDep:  { hour: 9,  minute: 0, nextDay: true },  // 09:00 AM next day (Morning Sleeper from Dhaka)
        },
        // 2. Chittagong (Scania AC, 14.0h) - Depart 17:00 (5:00 PM)
        //    Dhaka Scania Express (7.5h) - Outbound: 11:00 AM, Inbound: 20:00 (8:00 PM)
        {
            destination: "Chittagong",
            modelName: "Scania Legacy SR2",
            mainFare: 1800,
            dhakaFare: 1350,
            mainHours: 14.0,
            dhakaHours: 7.5,
            mainOutboundDep:  { hour: 17, minute: 0 },  // 05:00 PM
            mainInboundDep:   { hour: 17, minute: 0 },  // 05:00 PM
            dhakaOutboundDep: { hour: 11, minute: 0 },  // 11:00 AM (Day AC to Dhaka)
            dhakaInboundDep:  { hour: 20, minute: 0 },  // 08:00 PM (Evening AC from Dhaka)
        },
        // 3. Barisal (Mercedes AC, 11.5h) - Depart 19:00 (7:00 PM)
        //    Dhaka Mercedes Express (7.5h) - Outbound: 06:00 AM, Inbound: 15:00 (3:00 PM)
        {
            destination: "Barisal",
            modelName: "Mercedes-Benz OM 906",
            mainFare: 1450,
            dhakaFare: 1300,
            mainHours: 11.5,
            dhakaHours: 7.5,
            mainOutboundDep:  { hour: 19, minute: 0 },  // 07:00 PM
            mainInboundDep:   { hour: 19, minute: 0 },  // 07:00 PM
            dhakaOutboundDep: { hour: 6,  minute: 0 },  // 06:00 AM (Morning AC to Dhaka)
            dhakaInboundDep:  { hour: 15, minute: 0 },  // 03:00 PM (Afternoon AC from Dhaka)
        },
    ];

    for (const config of premium4BusConfigs) {
        const buses = busesByModel[config.modelName];
        const mainRouteInfo = routesMap[config.destination];

        for (let dayOffset = 0; dayOffset < TOTAL_DAYS; dayOffset++) {
            const currentDay = new Date(today);
            currentDay.setDate(today.getDate() + dayOffset);

            // 4-Bus Rotation Cycle
            const mainOutboundBus = buses[dayOffset % 4];
            const mainInboundBus  = buses[(dayOffset + 1) % 4];
            const dhakaExpressBus = buses[(dayOffset + 2) % 4];
            // Resting Bus: buses[(dayOffset + 3) % 4]

            // 1. Outbound to Main Destination (Dinajpur -> Cox's / Chittagong / Barisal)
            const mainOutDep = new Date(currentDay);
            mainOutDep.setHours(config.mainOutboundDep.hour, config.mainOutboundDep.minute, 0, 0);
            const mainOutArr = new Date(mainOutDep.getTime() + config.mainHours * 60 * 60 * 1000);

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

            // 2. Inbound from Main Destination (Cox's / Chittagong / Barisal -> Dinajpur)
            const mainInDep = new Date(currentDay);
            mainInDep.setHours(config.mainInboundDep.hour, config.mainInboundDep.minute, 0, 0);
            const mainInArr = new Date(mainInDep.getTime() + config.mainHours * 60 * 60 * 1000);

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
            const dhakaOutArr = new Date(dhakaOutDep.getTime() + config.dhakaHours * 60 * 60 * 1000);

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
            if (config.dhakaInboundDep.nextDay) {
                dhakaInDep.setDate(dhakaInDep.getDate() + 1);
            }
            dhakaInDep.setHours(config.dhakaInboundDep.hour, config.dhakaInboundDep.minute, 0, 0);
            const dhakaInArr = new Date(dhakaInDep.getTime() + config.dhakaHours * 60 * 60 * 1000);

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