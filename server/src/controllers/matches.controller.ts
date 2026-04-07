import { Request, Response } from 'express';
import { createMatchSchema, listMatchesQuerySchema } from '../validation/matches.validation';
import { createMatchService, listMatchesService } from '../services/matches.service';

export const createMatch = async (req: Request, res: Response) => {
  const parsed = createMatchSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid payload',
      details: parsed.error,
    });
  }

  try {
    const result = await createMatchService(parsed.data);
  const broadcast = req.app.locals.broadcastMatchCreated;
  if (broadcast) {
    broadcast(result);
  }

    return res.status(201).json({
      message: 'Match created',
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      error: 'Failed to create match',
    });
  }
};
const maxlimit = 100;

export const getMatches = async (req: Request, res: Response) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid query',
      details: parsed.error,
    });
  }

  const limit = Math.min(parsed.data.limit ?? 50, maxlimit);
  try {
    const data = await listMatchesService(limit);
    return res.status(200).json({
      message: 'Matches retrieved',
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to list matches',
    });
  }
};
