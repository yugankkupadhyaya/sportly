import app from './app';
import dotenv from 'dotenv';
import http from 'http';
import { attachWebSocketServer } from './websockets/server';
import { startScheduler } from './scheduler/game.scheduler';
import { getLiveMatches, updateMatch, createMatchService, getAllMatches } from './services/matches.service';
import { insertCommentary } from './services/commentary.service';
import { seedMatches } from './utils/seedMatches';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);
const existing = await getAllMatches();
console.log("🚀 SERVER START");
console.log("MATCHES IN DB:", existing.length);
if (existing.length === 0) {
  await seedMatches(15);
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
