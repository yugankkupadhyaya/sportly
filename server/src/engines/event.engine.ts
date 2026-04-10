export type EventType = 'GOAL' | 'FOUL' | 'CARD' | 'CHANCE' | 'NONE';

export interface MatchContext {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

export interface GeneratedEvent {
  type: EventType;
  team?: 'HOME' | 'AWAY';
}

export function pickEventType(): EventType {
  const roll = Math.random();

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
  const type = pickEventType();

  if (type === 'NONE') {
    return { type };
  }

  const team = pickTeam(match);

  return {
    type,
    team,
  };
}
