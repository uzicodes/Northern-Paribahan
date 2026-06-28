import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

async function main() {
    // Create admin user
    // Password should be hashed in production

    // Create Buses
    const buses = [
        {
            name: "Northern Express",
            plateNumber: "DHAKA-METRO-KA-1234",
            type: "AC",
            price: 1200,
        },
        {
            name: "Paribahan Deluxe",
            plateNumber: "CHITTAGONG-ZA-5678",
            type: "Non-AC",
            price: 800,
        },
    ];

    await Promise.all(
        buses.map(async (busData) => {
            const bus = await prisma.bus.create({
                data: busData,
            });

            // Create 40 seats for each bus
            const seatPromises = Array.from({ length: 40 }, (_, index) => {
                const i = index + 1;
                return prisma.seat.create({
                    data: {
                        seatNumber: `${String.fromCharCode(65 + Math.floor((i - 1) / 4))}${((i - 1) % 4) + 1}`, // A1, A2, ... J4
                        busId: bus.id,
                    },
                });
            });

            await Promise.all(seatPromises);

            console.log(`Created bus: ${bus.name} with seats`);
        })
    );
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

export type SeedScript = typeof main;
