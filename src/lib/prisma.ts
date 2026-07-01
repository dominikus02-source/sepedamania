import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  let url = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL;
  if (!url) {
    return 'postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public';
  }
  url = url.replace(/[?&]sslmode=[^&]+/g, '');
  url = url.replace(/\/[^?]+/, (m) => m.replace(/[&]/, '?'));
  return url;
}

function createPrismaClient() {
  const pool = new Pool({
    connectionString: getDatabaseUrl(),
    ssl: { rejectUnauthorized: false },
    max: 3,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
