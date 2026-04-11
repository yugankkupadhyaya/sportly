import { generateEvent } from './event.engine';
import { generateCommentary } from './commentary.engine';

type Match = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'finished';
  currentMinute: number;
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

  const minuteIncrease =
    match.currentMinute < 45
      ? Math.floor(Math.random() * 2) + 1
      : Math.floor(Math.random() * 3) + 1;
  const newMinute = match.currentMinute + minuteIncrease;

  const event = generateEvent({
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
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
    event.type = 'CHANCE';
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
