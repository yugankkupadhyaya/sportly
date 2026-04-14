import { eq } from 'drizzle-orm';
import { ZodNumber } from 'zod';
import { $ZodNumberParams } from 'zod/v4/core';
import { getDb } from '../config/db';
import { matches } from '../db/schema';
import { desc } from 'drizzle-orm';

const getMatchStatus = (startTime: string, endTime: string) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) return 'scheduled';
  if (now >= start && now <= end) return 'live';
  return 'finished';
};

export const createMatchService = async (data: any) => {
  const { startTime, endTime, homeScore, awayScore } = data;
  const db = getDb();

  const [event] = await db
    .insert(matches)
    .values({
      ...data,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      homeScore: homeScore ?? 0,
      awayScore: awayScore ?? 0,
      status: getMatchStatus(startTime, endTime),
    })
    .returning();

  return event;
};

export const listMatchesService = async (limit: number) => {
  const db = getDb();
  const matchesList = await db.select().from(matches).orderBy(desc(matches.startTime)).limit(limit);
  console.log('Retrieved matches:', matchesList);
  return matchesList;
};
export const getLiveMatches = async () => {
  const db = getDb();
  return await db.select().from(matches).where(eq(matches.status, 'live'));
};
export const getAllMatches = async () => {
  const db = getDb();
  return await db.select().from(matches);
};
export const updateMatch = async (
  id: number,
  data: Partial<{
    homeScore: number;
    awayScore: number;
    currentMinute: number;
    status: 'scheduled' | 'live' | 'finished';
  }>
) => {
  const db = getDb();
  const [updated] = await db.update(matches).set(data).where(eq(matches.id, id)).returning();

  return updated;
};
export const deleteMatch = async (id: number) => {
  const db = getDb();
  await db.delete(matches).where(eq(matches.id, id));
};
