import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().default("http://127.0.0.1:3000"),
  AUTH_URL: z.string().default("http://127.0.0.1:3000"),
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 characters"),
  SEED_ADMIN_EMAIL: z.string().email().optional(),
  SEED_ADMIN_PASSWORD: z.string().min(12).optional(),
  SEED_ADMIN_NAME: z.string().optional(),
});

export function validateEnv(environment: NodeJS.ProcessEnv) {
  return envSchema.parse(environment);
}

const parsed = envSchema.safeParse(process.env);
export const env = parsed.success
  ? parsed.data
  : {
      DATABASE_URL: process.env.DATABASE_URL || "file:./data/pdms.db",
      NODE_ENV: (process.env.NODE_ENV as "development" | "production" | "test") || "production",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://127.0.0.1:3000",
      AUTH_URL: process.env.AUTH_URL || "http://127.0.0.1:3000",
      AUTH_SECRET: process.env.AUTH_SECRET || "pdms-fallback-secret",
      SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL,
      SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,
      SEED_ADMIN_NAME: process.env.SEED_ADMIN_NAME,
    };
