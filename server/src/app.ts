import express, { Request, Response } from 'express';
import cors from 'cors';
import { matchRouter } from './routes/matches.routes';
import { commentary } from './db/schema';
import { commentaryRouter } from './routes/commentary.routes';

const app = express();
app.use(
  cors({
    origin: ['https://sportly-tau.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Server running');
});
app.use('/matches', matchRouter);
app.use('/matches/:id/commentary', commentaryRouter);

export default app;
