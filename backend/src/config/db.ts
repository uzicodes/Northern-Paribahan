// backend/src/config/db.ts
import { PrismaClient } from '@prisma/client';

// We explicitly pass the Transaction URL here for the app to use
export const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL // This uses Port 6543 from .env
});

export async function connectDB(): Promise<void> {
  await prisma.$connect();
}

export async function disconnectDB(): Promise<void> {
  await prisma.$disconnect();
}