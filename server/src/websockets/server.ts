import websocket, { WebSocketServer, Server } from 'ws';
import { InferSelectModel } from 'drizzle-orm';
import { matches } from '../db/schema';

const matchSubscriber = new Map();
function subscribe(matchId: string, socket: websocket) {
  if (!matchSubscriber.has(matchId)) {
    matchSubscriber.set(matchId, new Set());
  }
  matchSubscriber.get(matchId).add(socket);
}

function unsubscribe(matchId: string, socket: websocket) {
  const subscribers = matchSubscriber.get(matchId);

  if (!subscribers) return;
  subscribers.delete(socket);

  if (subscribers.size === 0) {
    matchSubscriber.delete(matchId);
  }
}

function cleanupSubscriptions(socket: websocket) {
  for (const matchId of socket.subscriptions) {
    unsubscribe(matchId, socket);
  }
}

function broadcastToMatch(matchId: string, payload: any) {
  const subscribers = matchSubscriber.get(matchId);
  if (!subscribers) return;

  const message = JSON.stringify(payload);
  for (const subscriber of subscribers) {
    if (subscriber.readyState === websocket.OPEN) {
      subscriber.send(message);
    }
  }
}

function handleMessage(socket: websocket, data: any) {
  let message;

  try {
    message = JSON.parse(data.toString());
  } catch (error) {
    sendJson(socket, {
      type: 'error',
      message: 'Invalid JSON',
    });
  }

  if (message?.type === subscribe && Number.isInteger(message.matchId)) {
    subscribe(message.matchId, socket);
    socket.subscriptions.add(message.matchId);
    sendJson(socket, {
      type: 'subscribed',
      matchId: message.matchId,
    });
    return;
  }

  if (message?.type === 'unsubscribe' && Number.isInteger(message.matchId)) {
    unsubscribe(message.matchId, socket);
    socket.subscriptions.delete(message.matchId);
    sendJson(socket, {
      type: 'unsubscribed',
      matchId: message.matchId,
    });
    return;
  }
}

type Match = InferSelectModel<typeof matches>;
function sendJson(socket: websocket, payload: any) {
  if (socket.readyState !== websocket.OPEN) return;

  socket.send(JSON.stringify(payload));
}

function broadcastToAll(wss: Server, payload: any) {
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
    socket.subscriptions = new Set();
    sendJson(socket, {
      type: 'welcome',
    });
    socket.on('message', (data) => {
      handleMessage(socket, data);
    });

    socket.on('error', () => {
      socket.terminate();
    });

    socket.on('close', () => {
      cleanupSubscriptions(socket);
    });

    socket.on('error', console.error);
  });
  function broadcastMatchCreated(match: Match) {
    broadcastToAll(wss, {
      type: 'match_created',
      data: match,
    });
  }

  function broadcastCommentary(matchId: string, commentary: string) {
    broadcastToMatch(matchId, {
      type: 'commentary',
      data: commentary,
    });
  }

  return { broadcastMatchCreated, broadcastCommentary };
}
