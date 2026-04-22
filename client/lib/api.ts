export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:3001'
    : 'https://sportly-1.onrender.com');

export const WS_BASE_URL = BASE_URL.replace(/^https:/, "wss:").replace(
  /^http:/,
  "ws:"
);

