import { eq } from 'drizzle-orm';
import { ZodNumber } from 'zod';
import { $ZodNumberParams } from 'zod/v4/core';
import { db } from '../config/db';
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
  return await db.select().from(matches).orderBy(desc(matches.startTime)).limit(limit);
};
export const getLiveMatches = async () => {
  return await db.select().from(matches).where(eq(matches.status, 'live'));
};
export const updateMatch = async (
  id: number,
  data: Partial<{
    homeScore: number;
    awayScore: number;
    currentMinute: number;
    status: "scheduled" | "live" | "finished";
  }>
) => {
  const [updated] = await db
    .update(matches)
    .set(data)
    .where(eq(matches.id, id))
    .returning();

  return updated;
};
