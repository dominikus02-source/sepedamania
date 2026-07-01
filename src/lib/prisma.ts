import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    'postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public'
  );
}

function cleanDatabaseUrl(url: string): string {
  const cleaned = url.replace(/[?&]sslmode=[^&]+/g, '');
  return cleaned.replace(/^(.+?:\/\/[^?]+)&/, '$1?');
}

function createPrismaClient() {
  const rawUrl = getDatabaseUrl();

  const pool = new Pool({
    connectionString: cleanDatabaseUrl(rawUrl),
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
