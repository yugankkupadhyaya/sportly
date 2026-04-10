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

export const insertCommentary = async (data: {
  matchId: number;
  minute: number;
  sequence: number;
  eventType: string;
  team?: string | null;
  message: string;
}) => {
  const last = await db
    .select()
    .from(commentary)
    .where(eq(commentary.matchId, data.matchId))
    .orderBy(desc(commentary.sequence))
    .limit(1);
  const nextSequence = last.length ? last[0].sequence + 1 : 1;

  const [row] = await db
      .insert(commentary)
      .values({
        ...data,
        sequence: nextSequence,
      })
      .returning();
  
    return row;
};
