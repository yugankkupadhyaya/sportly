import websocket, { WebSocketServer, Server } from 'ws';
import { InferSelectModel } from 'drizzle-orm';
import { matches } from '../db/schema';

type Match = InferSelectModel<typeof matches>;
function sendJson(socket: websocket, payload: any) {
  if (socket.readyState !== websocket.OPEN) return;

  socket.send(JSON.stringify(payload));
}

function broadcast(wss: Server, payload: any) {
  for (const client of wss.clients) {
    if (client.readyState === websocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  }
}

export function attachWebSocketServer(server: any) {
  const wss = new WebSocketServer({
    server,
    path: '/ws',
    maxPayload: 1024 * 1024,
  });

  wss.on('connection', (socket: websocket) => {
    sendJson(socket, {
      type: 'welcome',
    });

    socket.on('error', console.error);
  });
  function broadcastMatchCreated(match: Match) {
    broadcast(wss, {
      type: 'match_created',
      data: match,
    });
  }
  return { broadcastMatchCreated };
}
