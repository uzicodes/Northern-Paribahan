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
    // Clear existing data to prevent duplicates 
    await prisma.ticket.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.schedule.deleteMany({});
    await prisma.route.deleteMany({});
    await prisma.bus.deleteMany({});

    console.log('Cleared existing database records.');

    // 18 buses (3 of each type)
    const busesData = [
        // Volvo B9R (AC, 40 seats)
        { name: "Volvo B9R", registrationNumber: "DHAKA METRO-BA 15-1001", type: BusType.AC, capacity: 40 },
        { name: "Volvo B9R", registrationNumber: "DHAKA METRO-BA 15-1002", type: BusType.AC, capacity: 40 },
        { name: "Volvo B9R", registrationNumber: "DHAKA METRO-BA 15-1003", type: BusType.AC, capacity: 40 },

        // Mercedes-Benz OM 906 (AC, 41 seats)
        { name: "Mercedes-Benz OM 906", registrationNumber: "DHAKA METRO-BA 15-2001", type: BusType.AC, capacity: 41 },
        { name: "Mercedes-Benz OM 906", registrationNumber: "DHAKA METRO-BA 15-2002", type: BusType.AC, capacity: 41 },
        { name: "Mercedes-Benz OM 906", registrationNumber: "DHAKA METRO-BA 15-2003", type: BusType.AC, capacity: 41 },

        // Scania Legacy SR2 (AC, 46 seats)
        { name: "Scania Legacy SR2", registrationNumber: "DHAKA METRO-BA 15-3001", type: BusType.AC, capacity: 46 },
        { name: "Scania Legacy SR2", registrationNumber: "DHAKA METRO-BA 15-3002", type: BusType.AC, capacity: 46 },
        { name: "Scania Legacy SR2", registrationNumber: "DHAKA METRO-BA 15-3003", type: BusType.AC, capacity: 46 },

        // Hino RN8J (AC, 36 seats)
        { name: "Hino RN8J", registrationNumber: "DHAKA METRO-BA 15-4001", type: BusType.AC, capacity: 36 },
        { name: "Hino RN8J", registrationNumber: "DHAKA METRO-BA 15-4002", type: BusType.AC, capacity: 36 },
        { name: "Hino RN8J", registrationNumber: "DHAKA METRO-BA 15-4003", type: BusType.AC, capacity: 36 },

        // MAN 24.460 (Sleeper, 40 seats)
        { name: "MAN 24.460", registrationNumber: "DHAKA METRO-BA 15-5001", type: BusType.SLEEPER, capacity: 40 },
        { name: "MAN 24.460", registrationNumber: "DHAKA METRO-BA 15-5002", type: BusType.SLEEPER, capacity: 40 },
        { name: "MAN 24.460", registrationNumber: "DHAKA METRO-BA 15-5003", type: BusType.SLEEPER, capacity: 40 },

        // Ashok Leyland Eagle (Non-AC, 45 seats)
        { name: "Ashok Leyland Eagle", registrationNumber: "DHAKA METRO-BA 15-6001", type: BusType.NON_AC, capacity: 45 },
        { name: "Ashok Leyland Eagle", registrationNumber: "DHAKA METRO-BA 15-6002", type: BusType.NON_AC, capacity: 45 },
        { name: "Ashok Leyland Eagle", registrationNumber: "DHAKA METRO-BA 15-6003", type: BusType.NON_AC, capacity: 45 },
    ];

    // 3. Insert into the database
    for (const bus of busesData) {
        await prisma.bus.create({
            data: bus
        });
    }

    console.log(`Successfully seeded ${busesData.length} buses into the fleet!`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
    });