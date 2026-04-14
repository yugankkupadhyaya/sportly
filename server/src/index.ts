import 'dotenv/config';
import http from 'http';
import app from './app';
import { validateEnv } from './utils/env';
import { startScheduler } from './scheduler/game.scheduler';
import { insertCommentary } from './services/commentary.service';
import { createMatchService, getAllMatches, updateMatch } from './services/matches.service';
import { seedMatches } from './utils/seedMatches';
import { attachWebSocketServer } from './websockets/server';

function installGlobalErrorHandlers() {
  process.on('uncaughtException', (err) => {
    console.error('[fatal] uncaughtException', err);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('[fatal] unhandledRejection', reason);
    process.exit(1);
  });

  process.on('SIGTERM', () => {
    console.log('[signal] SIGTERM received, shutting down...');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('[signal] SIGINT received, shutting down...');
    process.exit(0);
  });
}

async function startServer() {
  // Always log immediately so Render shows something even if startup fails.
  console.log('[boot] entrypoint reached');
  console.log(`[boot] node=${process.version} pid=${process.pid} env=${process.env.NODE_ENV ?? '(unset)'}`);

  installGlobalErrorHandlers();

  console.log('[boot] validating environment');
  const env = validateEnv();

  const PORT = env.PORT ?? 3001;
  const HOST = env.HOST ?? '0.0.0.0';

  console.log('[boot] creating http server');
  const server = http.createServer(app);

  let dbReady = false;
  try {
    console.log('[boot] connecting to database / warming up');
    const existing = await getAllMatches();
    dbReady = true;
    console.log(`[boot] matches in db: ${existing.length}`);

    if (existing.length === 0) {
      console.log('[boot] seeding matches (db empty)');
      await seedMatches(15);
      console.log('[boot] seeding complete');
    }
  } catch (err) {
    // Keep the process alive so we still get logs + can serve non-DB endpoints.
    // DB-backed routes/scheduler will remain disabled until DB works again.
    console.error('[boot] database warmup failed (continuing without DB)', err);
  }

  console.log('[boot] attaching websocket server');
  const { broadcastMatchCreated, broadcastCommentary } = attachWebSocketServer(server);
  app.locals.broadcastMatchCreated = broadcastMatchCreated;
  app.locals.broadcastCommentary = broadcastCommentary;

  if (dbReady) {
    console.log('[boot] starting scheduler');
    startScheduler({
      getAllMatches: async () => await getAllMatches(),
      updateMatch,
      insertCommentary,
      broadcastCommentary,
      createMatch: async (data: any) => await createMatchService(data),
    });
  } else {
    console.warn('[boot] scheduler disabled (db not ready)');
  }

  console.log('[boot] starting http listener');
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(PORT, HOST, () => resolve());
  });

  const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`Server running on port ${baseUrl}`);
  console.log(`WebSocket available at ${baseUrl.replace('http', 'ws')}/ws`);
}

startServer().catch((err) => {
  console.error('[fatal] startServer failed', err);
  process.exit(1);
});
