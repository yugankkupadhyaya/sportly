import { Router } from 'express';
import {
  createCommentaryController,
  listCommentariesController,
} from '../controllers/commentary.controller';
export const commentaryRouter = Router({ mergeParams: true });

commentaryRouter.post('/', createCommentaryController);
commentaryRouter.get('/', listCommentariesController);
