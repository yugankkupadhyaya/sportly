// import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
  jsonb,
  varchar,
} from 'drizzle-orm/pg-core';


export const matchStatusEnum = pgEnum('match_status', ['scheduled', 'live', 'finished']);


export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  sport: text('sport').notNull(),
  homeTeam: text('home_team').notNull(),
  awayTeam: text('away_team').notNull(),
  status: matchStatusEnum('status').default('scheduled').notNull(),
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  homeScore: integer('home_score').default(0).notNull(),
  awayScore: integer('away_score').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});


export const commentary = pgTable('commentary', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id')
    .references(() => matches.id, { onDelete: 'cascade' })
    .notNull(),
  minute: integer('minute'),
  sequence: integer('sequence').notNull(), 
  period: varchar('period', { length: 20 }), 
  eventType: varchar('event_type', { length: 50 }).notNull(), 
  actor: text('actor'), 
  team: text('team'), 
  message: text('message').notNull(),
  metadata: jsonb('metadata'),
  tags: text('tags').array(), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
