// routes/match.routes.ts

import express from 'express';
import { createMatch, getMatches } from '../controllers/matches.controller';

export const matchRouter = express.Router();
matchRouter.get('/', getMatches);
matchRouter.post('/', createMatch);
