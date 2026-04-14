import 'dotenv/config';
import { validateEnv } from './utils/env';

// 1. Validate Environment Variables Next
validateEnv();

// 2. Setup Global Error Handlers (No silent crashes)
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...', reason);
  process.exit(1);
});

// 3. Normal Imports
import app from './app';
import http from 'http';
import { attachWebSocketServer } from './websockets/server';
import { startScheduler } from './scheduler/game.scheduler';
import { getLiveMatches, updateMatch, createMatchService, getAllMatches } from './services/matches.service';
import { insertCommentary } from './services/commentary.service';
import { seedMatches } from './utils/seedMatches';

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);
try {
  const existing = await getAllMatches();
  console.log("🚀 SERVER START");
  console.log("MATCHES IN DB:", existing.length);
  if (existing.length === 0) {
    await seedMatches(15);
  }
} catch (error) {
  console.error("❌ DATABASE CONNECTION/BOOTSTRAP FAILED:", error);
  process.exit(1); // Exit manually if db fails
}
const { broadcastMatchCreated, broadcastCommentary } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastCommentary = broadcastCommentary;
startScheduler({
  getAllMatches: async () => await getAllMatches(),
  updateMatch,
  insertCommentary,
  broadcastCommentary,
  createMatch: async (data: any) => await createMatchService(data),
});
server.listen(PORT, HOST, () => {
  const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `HTTP://${HOST}:${PORT}`;
  console.log(`Server is running on port ${baseUrl}`);
  console.log(` Websocket Server is running on port ${baseUrl.replace('http', 'ws')}/ws`);
});
