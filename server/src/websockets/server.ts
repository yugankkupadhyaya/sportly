import websocket, { WebSocketServer, Server } from 'ws';
import { InferSelectModel } from 'drizzle-orm';
import { matches } from '../db/schema';

interface ExtendedWebSocket extends websocket {
  subscriptions: Set<string>;
}

const matchSubscriber = new Map<string, Set<ExtendedWebSocket>>();

function subscribe(matchId: string, socket: ExtendedWebSocket) {
  if (!matchSubscriber.has(matchId)) {
    matchSubscriber.set(matchId, new Set());
    console.log(`Created new subscription set for matchId: ${matchId}`);
  }
  matchSubscriber.get(matchId)!.add(socket);
  console.log(`WebSocket subscribed to matchId: ${matchId}`);

  if (!socket.subscriptions) {
    socket.subscriptions = new Set();
  }
  socket.subscriptions.add(matchId);
  console.log(`WebSocket subscriptions updated: ${Array.from(socket.subscriptions).join(', ')}`);
}

function unsubscribe(matchId: string, socket: ExtendedWebSocket) {
  const subscribers = matchSubscriber.get(matchId);

  if (!subscribers) return;
  subscribers.delete(socket);

  if (subscribers.size === 0) {
    matchSubscriber.delete(matchId);
  }

  // Remove matchId from socket subscriptions
  if (socket.subscriptions) {
    socket.subscriptions.delete(matchId);
  }
}

function cleanupSubscriptions(socket: ExtendedWebSocket) {
  if (!socket.subscriptions) return;

  for (const matchId of socket.subscriptions) {
    unsubscribe(matchId, socket);
  }
}

function broadcastToMatch(matchId: string, payload: any) {
  console.log('Looking for subscribers of:', matchId);
  console.log('Current map keys:', Array.from(matchSubscriber.keys()));
  const subscribers = matchSubscriber.get(matchId);
  if (!subscribers) {
    console.log(`No subscribers found for matchId: ${matchId}`);
    return;
  }

  const message = JSON.stringify(payload);
  console.log(`Broadcasting message to matchId: ${matchId}, payload: ${message}`);

  for (const subscriber of subscribers) {
    if (subscriber.readyState === websocket.OPEN) {
      try {
        subscriber.send(message);
        console.log(`Message sent to subscriber for matchId: ${matchId}`);
      } catch (error) {
        console.error(`Failed to send message to subscriber: ${error}`);
      }
    } else {
      console.log(`Subscriber for matchId: ${matchId} is not open`);
    }
  }
}

function handleMessage(socket: ExtendedWebSocket, data: any) {
  let message;

  try {
    message = JSON.parse(data.toString());
    console.log('Received message:', message);
  } catch (error) {
    console.error('Invalid JSON received:', data.toString());
    sendJson(socket, {
      type: 'error',
      message: 'Invalid JSON',
    });
    return;
  }

  if (message?.type === 'subscribe') {
    const matchId = Number(message.matchId);

    if (!Number.isInteger(matchId)) {
      sendJson(socket, {
        type: 'error',
        message: 'Invalid matchId',
      });
      return;
    }

    subscribe(matchId.toString(), socket);
  } else {
    console.log('Unknown message type or invalid matchId:', message);
  }
}

type Match = InferSelectModel<typeof matches>;
function sendJson(socket: ExtendedWebSocket, payload: any) {
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
    const extendedSocket = socket as ExtendedWebSocket;
    extendedSocket.subscriptions = new Set();
    sendJson(extendedSocket, {
      type: 'welcome',
    });
    socket.on('message', (data) => {
      handleMessage(extendedSocket, data);
    });

    socket.on('error', () => {
      socket.terminate();
    });

    socket.on('close', () => {
      cleanupSubscriptions(extendedSocket);
    });

    socket.on('error', console.error);
  });
  function broadcastMatchCreated(match: Match) {
    broadcastToAll(wss, {
      type: 'match_created',
      data: match,
    });
  }

  function broadcastCommentary(matchId: string, commentary: any) {
    broadcastToMatch(matchId, {
      type: 'commentary',
      data: commentary,
    });
  }

  return { broadcastMatchCreated, broadcastCommentary };
}
