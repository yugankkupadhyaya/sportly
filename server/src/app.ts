import express, { Request, Response } from 'express';
import cors from 'cors';

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

export default app;
