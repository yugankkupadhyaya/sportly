import express, { Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import { matchRouter } from './routes/matches.routes';
import { commentaryRouter } from './routes/commentary.routes';

const app = express();
<<<<<<< HEAD
app.use(
  cors({
    origin: ['https://sportly-tau.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
=======

const allowedOrigins = ['http://localhost:3000', 'https://sportly-tau.vercel.app'];

const normalizeOrigin = (origin: string) => origin.replace(/\/+$/, '');

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    const normalized = normalizeOrigin(origin);
    if (allowedOrigins.includes(normalized)) return callback(null, true);

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 204,
};

// CORS must run before routes/middleware that handle requests.
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
>>>>>>> 201058a (fixed)
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Server running');
});
app.use('/matches', matchRouter);
app.use('/matches/:id/commentary', commentaryRouter);

export default app;
