import app from './app';
import dotenv from 'dotenv';
import http from 'http';
import { attachWebSocketServer } from './websockets/server';
import { startScheduler } from './scheduler/game.scheduler';
import { getLiveMatches, updateMatch } from './services/matches.service';
import { insertCommentary } from './services/commentary.service';
// import { insertCommentary } from './services/commentary.service';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);

const { broadcastMatchCreated, broadcastCommentary } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastCommentary = broadcastCommentary;
startScheduler({
  getLiveMatches,
  updateMatch,
  insertCommentary,
  broadcastCommentary,
});
server.listen(PORT, HOST, () => {
  const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `HTTP://${HOST}:${PORT}`;
  console.log(`Server is running on port ${baseUrl}`);
  console.log(` Websocket Server is running on port ${baseUrl.replace('http', 'ws')}/ws`);
});
