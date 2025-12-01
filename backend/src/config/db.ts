// backend/src/config/db.ts
import { PrismaClient } from '@prisma/client';

// Prisma 6 automatically loads DATABASE_URL from .env via schema.prisma
export const prisma = new PrismaClient();

export async function connectDB(): Promise<void> {
  await prisma.$connect();
}

export async function disconnectDB(): Promise<void> {
  await prisma.$disconnect();
}