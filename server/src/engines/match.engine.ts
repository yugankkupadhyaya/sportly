import { generateEvent } from './event.engine';
import { generateCommentary } from './commentary.engine';
import { Sport } from './sports.config';

type Match = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'finished';
  currentMinute: number;
  sport?: Sport | string;
  league?: string;
};

export const processMatch = async (
  match: Match,
  services: {
    updateMatch: (id: number, data: any) => Promise<any>;
    insertCommentary: (data: any) => Promise<any>;
    broadcastCommentary: (matchId: string, data: any) => void;
  }
) => {
  console.log('⚽ Processing match:', match.id);

  const minuteIncrease = 1;
  const newMinute = match.currentMinute + minuteIncrease;

  const event = generateEvent({
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    sport: match.sport,
  });

  let updatedScore = {
    homeScore: match.homeScore,
    awayScore: match.awayScore,
  };
  if (event.type === 'GOAL' && event.team) {
    if (event.team === 'HOME') {
      updatedScore.homeScore += 1;
    } else {
      updatedScore.awayScore += 1;
    }
  }

  await services.updateMatch(match.id, {
    currentMinute: newMinute,
    ...updatedScore,
  });

  const message = generateCommentary({
    eventType: event.type,
    team: event.team,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    minute: newMinute,
    sport: match.sport,
  });

  const commentaryRow = await services.insertCommentary({
    matchId: match.id,
    minute: newMinute,
    sequence: Date.now(),
    eventType: event.type,
    team: event.team === 'HOME' ? match.homeTeam : event.team === 'AWAY' ? match.awayTeam : null,
    message,
  });

  services.broadcastCommentary(match.id.toString(), commentaryRow);
};
