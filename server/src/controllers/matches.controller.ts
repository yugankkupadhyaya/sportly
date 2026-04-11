import { Request, Response } from 'express';
import {
  createMatchSchema,
  listMatchesQuerySchema,
  matchIdParamSchema,
  updateScoreSchema,
} from '../validation/matches.validation';
import { createMatchService, listMatchesService } from '../services/matches.service';
import { matches } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { ZodError } from 'zod';
const activeMatches = new Set<number>();
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

export const updateMatchScore = async (req: Request, res: Response) => {
  try {
    const { id: matchId } = matchIdParamSchema.parse(req.params);

    const { homeScore, awayScore } = updateScoreSchema.parse(req.body);

    const [updated] = await db
      .update(matches)
      .set({ homeScore, awayScore })
      .where(eq(matches.id, matchId))
      .returning();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Match not found',
      });
    }

    if (req.app.locals.broadcastMatchUpdated) {
      req.app.locals.broadcastMatchUpdated(updated);
    }

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation Failed',
        errors: error.issues,
      });
    }

    console.error('Error updating score:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
