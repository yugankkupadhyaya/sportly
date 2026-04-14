import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

function maskDatabaseUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.password) u.password = '***';
    return u.toString();
  } catch {
    return url.replace(/\/\/([^:/?#]+):([^@/?#]+)@/g, '//$1:***@');
  }
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  // Drizzle Kit commands should fail loudly if migrations are misconfigured.
  throw new Error('[drizzle] DATABASE_URL is not set. Set it to your Neon pooler URL with `?sslmode=require`.');
}

console.log(`[drizzle] using DATABASE_URL=${maskDatabaseUrl(DATABASE_URL)}`);

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
    // Neon requires SSL; rejectUnauthorized=false avoids local CA bundle issues.
    ssl: { rejectUnauthorized: false },
  },
});
