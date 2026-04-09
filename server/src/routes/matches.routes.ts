// routes/match.routes.ts

import express from 'express';
import { createMatch, getMatches, updateMatchScore } from '../controllers/matches.controller';

export const matchRouter = express.Router();
matchRouter.get('/', getMatches);
matchRouter.post('/', createMatch);
matchRouter.patch('/:id/score', updateMatchScore);
