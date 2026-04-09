import { db } from '../config/db.js';
import { commentary } from '../db/schema.js';
import { CreateCommentaryInput } from '../validation/commentry.validation.js';
import { eq, desc } from 'drizzle-orm';

export const createCommentaryService = async (matchId: number, data: CreateCommentaryInput) => {
  const [newCommentary] = await db
    .insert(commentary)
    .values({
      ...data,
      matchId,

      metadata: data.metadata ?? {},
    })
    .returning();

  return newCommentary;
};
const MAX_LIMIT = 100;

export const listCommentariesService = async (matchId: number, limitInput?: number) => {
  const finalLimit = Math.min(limitInput ?? MAX_LIMIT, MAX_LIMIT);

  const results = await db
    .select()
    .from(commentary)
    .where(eq(commentary.matchId, matchId))
    .orderBy(desc(commentary.createdAt))
    .limit(finalLimit);

  return results;
};
