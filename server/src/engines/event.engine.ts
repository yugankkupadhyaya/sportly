import { Sport } from './sports.config';

export type EventType = 'GOAL' | 'FOUL' | 'CARD' | 'CHANCE' | 'NONE';

export interface MatchContext {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  sport?: Sport | string;
}

export interface GeneratedEvent {
  type: EventType;
  team?: 'HOME' | 'AWAY';
}

export function pickEventType(sport: Sport | string = 'football'): EventType {
  const roll = Math.random();

  if (sport === 'basketball') {
    // High scoring
    if (roll < 0.3) return 'GOAL';    // 30% chance of basket
    if (roll < 0.4) return 'FOUL';    // 10% foul
    if (roll < 0.45) return 'CARD';   // 5% tech
    if (roll < 0.7) return 'CHANCE';  // 25% miss
    return 'NONE';
  }

  if (sport === 'cricket') {
    // Frequent events (runs/wickets)
    if (roll < 0.25) return 'GOAL';   // representing runs/boundaries
    if (roll < 0.35) return 'CARD';   // representing wickets
    if (roll < 0.6) return 'CHANCE';  // dot balls/appeals
    return 'NONE';
  }

  if (sport === 'tennis') {
    // Point-based
    if (roll < 0.35) return 'GOAL';   // point won
    if (roll < 0.45) return 'FOUL';   // fault
    if (roll < 0.75) return 'CHANCE'; // rally
    return 'NONE';
  }

  // Default / Football
  // Low scoring
  if (roll < 0.05) return 'GOAL';
  if (roll < 0.1) return 'CARD';
  if (roll < 0.2) return 'FOUL';
  if (roll < 0.35) return 'CHANCE';

  return 'NONE';
}
function pickTeam(match: MatchContext): 'HOME' | 'AWAY' {
  const { homeScore, awayScore } = match;

  if (homeScore === awayScore) {
    return Math.random() < 0.5 ? 'HOME' : 'AWAY';
  }

  const losingBias = 0.6;

  if (homeScore < awayScore) {
    return Math.random() < losingBias ? 'HOME' : 'AWAY';
  } else {
    return Math.random() < losingBias ? 'AWAY' : 'HOME';
  }
}
export function generateEvent(match: MatchContext): GeneratedEvent {
  const type = pickEventType(match.sport);

  if (type === 'NONE') {
    return { type };
  }

  const team = pickTeam(match);

  return {
    type,
    team,
  };
}
