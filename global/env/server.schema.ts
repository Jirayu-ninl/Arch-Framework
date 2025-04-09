import { z } from 'zod'

/** Specify your server-side environment variables schema here. **/

export const serverSchema = {
  // ** ENVIRONMENT
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === 'production'
      ? z.string().min(1)
      : z.string().min(1).optional(),
  NEXTAUTH_URL: z.preprocess(
    // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    // Since NextAuth.js automatically uses the VERCEL_URL if present.
    (str) => process.env.VERCEL_URL ?? str,
    // VERCEL_URL doesn't include `https` so it cant be validated as a URL
    process.env.VERCEL ? z.string().min(1) : z.string().url(),
  ),
  BASE_URL: z.preprocess(
    () => {
      if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
      if (process.env.RAILWAY_PUBLIC_DOMAIN)
        return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
      if (process.env.RENDER_INTERNAL_HOSTNAME)
        return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
      return `http://localhost:${process.env.PORT ?? 8080}`
    },
    z
      .string()
      .url(), // Ensure it's a valid URL
  ),
  // DATABASE
  MONGODB_URI: z.string().url(),
  // AUTH
  AUTH_SECRET: z.string(),
  AUTH_FB_APP_ID: z.string(),
  AUTH_FB_APP_SECRET: z.string(),
  AUTH_GITHUB_CLIENT_ID: z.string(),
  AUTH_GITHUB_CLIENT_SECRET: z.string(),
  AUTH_GOOGLE_CLIENT_ID: z.string(),
  AUTH_GOOGLE_CLIENT_SECRET: z.string(),
  AUTH_DISCORD_CLIENT_ID: z.string(),
  AUTH_DISCORD_CLIENT_SECRET: z.string(),
  // S3
  S3_ORIGINS: z.preprocess((value) => {
    const str = String(value)
    return str.split(',')
  }, z.array(z.string()).optional()),
  S3_UPLOAD_ENDPOINT: z.string(),
  S3_UPLOAD_KEY: z.string(),
  S3_UPLOAD_SECRET: z.string(),
  S3_UPLOAD_REGION: z.string(),
  S3_UPLOAD_BUCKET: z.string(),
  // EMAIL
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.preprocess((x) => Number.parseInt(String(x)), z.number()),
  EMAIL_SECURE: z.preprocess(
    (val) => val === true || val === 'true',
    z.boolean(),
  ),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
  EMAIL_FROM: z.string(),
  // PAYMENT
  // STRIPE_SECRET_KEY: z.string(),
  // STRIPE_WEBHOOK_SECRET: z.string(),
  // STRIPE_DONATE_ID: z.string(),
  // STRIPE_METADATA_KEY: z.string(),
  // FIREBASE
  // FIREBASE_API_KEY: z.string().min(1),
  // FIREBASE_AUTH_DOMAIN: z.string().min(1),
  // FIREBASE_DATABASE_URL: z.string().min(1),
  // FIREBASE_PROJECT_ID: z.string().min(1),
  // FIREBASE_STORAGE_BUCKET: z.string().min(1),
  // FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  // FIREBASE_APP_ID: z.string().min(1),
  // FIREBASE_MEASUREMENT_ID: z.string().min(1),
}
