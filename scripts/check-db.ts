import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

function getDatabaseUrl(): string {
  let url = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL;
  if (!url) throw new Error('No database URL found');
  url = url.replace(/[?&]sslmode=[^&]+/g, '');
  return url;
}

async function main() {
  const pool = new Pool({ connectionString: getDatabaseUrl(), ssl: { rejectUnauthorized: false }, max: 3 });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const users = await prisma.user.findMany({ take: 5, select: { id: true, name: true, email: true, role: true } });
  console.log('USERS:', JSON.stringify(users, null, 2));

  const orders = await prisma.order.findMany({ take: 10, orderBy: { createdAt: 'desc' }, select: { id: true, orderNumber: true, userId: true, status: true, paymentStatus: true, paidAt: true, completedAt: true, createdAt: true, total: true } });
  console.log('ORDERS:', JSON.stringify(orders, null, 2));

  await prisma.$disconnect();
  await pool.end();
}
main().catch(console.error);
