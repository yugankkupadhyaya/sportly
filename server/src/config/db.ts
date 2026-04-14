import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';

const { Pool } = pkg;

export type DbStatus = 'disabled' | 'connecting' | 'ready' | 'error';

let pool: InstanceType<typeof Pool> | null = null;
let db: ReturnType<typeof drizzle> | null = null;
let status: DbStatus = 'disabled';
let lastError: unknown = null;

function maskDatabaseUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.password) u.password = '***';
    return u.toString();
  } catch {
    // Fallback: try to hide password in "user:pass@" patterns.
    return url.replace(/\/\/([^:/?#]+):([^@/?#]+)@/g, '//$1:***@');
  }
}

function hasSslModeRequire(url: string): boolean {
  try {
    const u = new URL(url);
    return (u.searchParams.get('sslmode') ?? '').toLowerCase() === 'require';
  } catch {
    return false;
  }
}

function shouldEnableSsl(url: string): boolean {
  // Neon requires SSL. If sslmode=require is set, definitely enable.
  // Even without it, enabling SSL is safe for Neon and most managed PGs.
  return true;
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

export function getDbStatus(): { status: DbStatus; lastError: unknown } {
  return { status, lastError };
}

export function isDbEnabled(): boolean {
  return Boolean(process.env.DATABASE_URL && String(process.env.DATABASE_URL).trim() !== '');
}

export class DbUnavailableError extends Error {
  override name = 'DbUnavailableError';
}

function initDbOnce() {
  if (db && pool) return;

  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    status = 'disabled';
    return;
  }

  const sanitized = maskDatabaseUrl(url);
  console.log(`[db] configuring pool url=${sanitized}`);

  if (!hasSslModeRequire(url)) {
    console.warn('[db] DATABASE_URL missing `sslmode=require` (recommended for Neon/managed Postgres)');
  }

  status = 'connecting';
  pool = new Pool({
    connectionString: url,
    ssl: shouldEnableSsl(url) ? { rejectUnauthorized: false } : undefined,
    // Fail fast instead of hanging for ~minutes on bad routing/DNS.
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
    max: 10,
    allowExitOnIdle: true,
  });

  pool.on('error', (err) => {
    // A client error in the pool; keep process alive but record health.
    lastError = err;
    status = 'error';
    console.error('[db] pool error', err);
  });

  db = drizzle(pool);
}

export function getDb() {
  initDbOnce();
  if (!db || !pool) {
    throw new DbUnavailableError('Database is disabled (missing DATABASE_URL)');
  }
  return db;
}

export async function ensureDbConnected(opts?: { retries?: number; baseDelayMs?: number }) {
  initDbOnce();

  if (!pool) {
    status = 'disabled';
    throw new DbUnavailableError('Database is disabled (missing DATABASE_URL)');
  }

  const retries = opts?.retries ?? 3;
  const baseDelayMs = opts?.baseDelayMs ?? 750;

  let attempt = 0;
  while (true) {
    attempt += 1;
    try {
      console.log(`[db] connection attempt ${attempt}/${retries + 1}`);
      const client = await pool.connect();
      try {
        await client.query('select 1 as ok');
      } finally {
        client.release();
      }
      status = 'ready';
      lastError = null;
      console.log('[db] connection ok');
      return;
    } catch (err) {
      lastError = err;
      status = 'error';
      console.error('[db] connection failed', err);
      if (attempt > retries) throw err;
      await sleep(baseDelayMs * attempt);
    }
  }
}

export async function shutdownDb() {
  if (!pool) return;
  try {
    await pool.end();
  } catch (err) {
    console.error('[db] error during pool shutdown', err);
  } finally {
    pool = null;
    db = null;
    status = isDbEnabled() ? 'error' : 'disabled';
  }
}

// Backwards-compatible export name (but now lazy-initialized via getDb()).
// Prefer calling getDb() so DB-disabled mode is explicit.
export const dbProxy = new Proxy(
  {},
  {
    get(_target, prop) {
      const real = getDb() as any;
      return real[prop as any];
    },
  }
) as unknown as ReturnType<typeof drizzle>;

export { pool };
