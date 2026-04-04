// services/match.service.ts

import { db } from '../config/db';
import { matches } from '../db/schema';

// optional helper
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
