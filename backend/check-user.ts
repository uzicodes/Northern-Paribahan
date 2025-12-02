import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
    const user = await prisma.user.findUnique({
        where: { email: 'john.doe@example.com' },
        select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            createdAt: true,
            role: true,
            bookings: true,
        },
    });

    console.log('User found in database:');
    console.log(JSON.stringify(user, null, 2));

    await prisma.$disconnect();
}

checkUser().catch(console.error);
