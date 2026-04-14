import { processMatch } from '../engines/match.engine';
import { syncMatchStatus } from '../utils/match-status';
import { sports, teamPools, sportLeagues, sportMatchDurations } from '../engines/sports.config';

function generateRandomMatch() {
  const sport = sports[Math.floor(Math.random() * sports.length)];
  const pool = teamPools[sport];
  
  // Pick two mutually exclusive random teams
  let idx1 = Math.floor(Math.random() * pool.length);
  let idx2 = Math.floor(Math.random() * pool.length);
  while (idx1 === idx2) idx2 = Math.floor(Math.random() * pool.length);
  
  const homeTeam = pool[idx1];
  const awayTeam = pool[idx2];
  const league = sportLeagues[sport];
  
  const now = new Date();
  const endTime = new Date(now.getTime() + 10 * 60 * 1000); // 10 real minutes duration

  return {
    sport,
    league,
    homeTeam,
    awayTeam,
    homeScore: 0,
    awayScore: 0,
    startTime: now,
    endTime: endTime,
    status: 'live',
    currentMinute: 0,
  };
}

export function startScheduler(services: {
  getAllMatches: () => Promise<any[]>;
  updateMatch: (id: number, data: any) => Promise<any>;
  insertCommentary: (data: any) => Promise<any>;
  broadcastCommentary: (matchId: string, data: any) => void;
  createMatch?: (data: any) => Promise<any>;
}) {
  console.log('🚀 Scheduler started...');

  setInterval(async () => {
    console.log('⏱️ Scheduler tick...');

    const matches = await services.getAllMatches();
    let liveCount = matches.filter(m => m.status === 'live').length;
    
    console.log("MATCH COUNT:", matches.length);
    console.log("LIVE MATCHES:", liveCount);

    for (const match of matches) {
      if (!match.startTime || !match.endTime) continue;

      await syncMatchStatus(match, async (newStatus) => {
        await services.updateMatch(match.id, { status: newStatus });
      });

      if (match.status !== 'live') continue;

      await processMatch(match, services);

      const sport = match.sport as keyof typeof sportMatchDurations;
      const maxDuration = (sport && sportMatchDurations[sport]) || 90;

      if (match.currentMinute >= maxDuration) {
        await services.updateMatch(match.id, { status: 'finished' });
        liveCount--;
      }
    }
    
    if (liveCount < 3 && services.createMatch) {
      console.log('➕ Spawning dynamic match to fill active pool...');
      const newMatchData = generateRandomMatch();
      await services.createMatch(newMatchData);
    }
  }, 1000);
}
