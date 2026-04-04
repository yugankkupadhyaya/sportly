import express, { Request, Response } from 'express';
import cors from 'cors';
import { matchRouter } from './routes/matches.routes';

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Server running');
});
app.use('/matches', matchRouter);

export default app;
