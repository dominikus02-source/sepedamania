import { z } from 'zod'

const envSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),
  NEXTAUTH_URL: z.string().optional(),
  NEXT_PUBLIC_URL: z.string().url().default('https://sepedamania.com'),
  DATABASE_URL: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  MIDTRANS_SERVER_KEY: z.string().optional(),
  NEXT_PUBLIC_MIDTRANS_CLIENT_KEY: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.warn(
    '⚠️ Environment validation warnings:',
    parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n'),
  )
}

export const env = parsed.data ?? {
  NEXTAUTH_SECRET: 'fallback-dev-secret-do-not-use-in-production',
  NEXT_PUBLIC_URL: 'https://sepedamania.com',
}
