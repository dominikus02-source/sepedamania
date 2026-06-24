import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

async function main() {
  console.log('Applying Prisma migrations...');
  try {
    execSync('npx prisma db push --accept-data-loss', {
      stdio: 'inherit',
      env: { ...process.env },
    });
    console.log('Schema synced successfully!');
  } catch (err) {
    console.error('Failed to sync schema:', err);
    process.exit(1);
  }
}

main();
