import { z } from 'zod';

const EnvSchema = z.object({
  // Optional: server can boot without DB (DB features disabled)
  DATABASE_URL: z.string().min(1).optional(),
  CLIENT_URL: z.string().min(1),
  // Optional (only required if enabling auth features)
  JWT_SECRET: z.string().min(1).optional(),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  // Optional runtime config
  HOST: z.string().min(1).optional(),
  PORT: z.coerce.number().int().positive().optional(),
  NODE_ENV: z.string().min(1).optional(),
});

export type Env = z.infer<typeof EnvSchema>;

export function validateEnv(): Env {
  const raw = {
    DATABASE_URL: process.env.DATABASE_URL,
    CLIENT_URL: process.env.CLIENT_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
  };

  const parsed = EnvSchema.safeParse(raw);
  if (parsed.success) return parsed.data;

  const requiredKeys: (keyof typeof raw)[] = ['CLIENT_URL'];
  const missing = requiredKeys.filter((k) => !raw[k] || String(raw[k]).trim() === '').map(String).sort();

  console.error('[env] invalid or missing environment variables');
  if (missing.length > 0) {
    console.error(`[env] missing: ${missing.join(', ')}`);
  }
  console.error('[env] full validation errors:', parsed.error.flatten().fieldErrors);
  console.error('[env] set these in Render service env vars (or a local .env) and restart');
  process.exit(1);
}
