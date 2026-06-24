import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url:
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.DATABASE_URL ||
      'postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public',
  },
  schema: './prisma/schema.prisma',
});
