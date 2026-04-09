import { id } from 'zod/v4/locales';
import * as commentaryService from '../services/commentary.service.js';
import {
  createCommentarySchema,
  listCommentaryQuerySchema,
} from '../validation/commentry.validation.js';
import { matchIdParamSchema } from '../validation/matches.validation.js';
import { Request, Response } from 'express';
import { ZodError } from 'zod';

export const createCommentaryController = async (req: Request, res: Response) => {
  try {
    const { id: matchId } = matchIdParamSchema.parse(req.params);

    const validatedBody = createCommentarySchema.parse(req.body);

    const result = await commentaryService.createCommentaryService(matchId, validatedBody);

    if (res.app.locals.broadcastCommentary) {
      res.app.locals.broadcastCommentary(matchId.toString(), result);
    }

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation Failed',
        errors: error.issues,
      });
    }

    console.error('Error creating commentary:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const listCommentariesController = async (req: Request, res: Response) => {
  try {
    const { id } = matchIdParamSchema.parse(req.params);

    const { limit } = req.query;

    const commentaries = await commentaryService.listCommentariesService(Number(id), Number(limit));

    return res.status(200).json({
      success: true,
      data: commentaries,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation Failed',
        errors: error.issues,
      });
    }

    // Handle Generic Server Errors
    console.error('Error listing commentaries:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
