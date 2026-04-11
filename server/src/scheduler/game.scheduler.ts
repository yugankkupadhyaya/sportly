import { processMatch } from '../engines/match.engine';
import { getLiveMatches, updateMatch } from '../services/matches.service';
import { syncMatchStatus } from '../utils/match-status';
import { getAllMatches, deleteMatch } from '../services/matches.service';

export function startScheduler(services: {
  getAllMatches: () => Promise<any[]>;
  updateMatch: (id: number, data: any) => Promise<any>;
  insertCommentary: (data: any) => Promise<any>;
  broadcastCommentary: (matchId: string, data: any) => void;
  deleteMatch: (id: number) => Promise<void>;
}) {
  console.log('🚀 Scheduler started...');

  setInterval(async () => {
    console.log('⏱️ Scheduler tick...');

    const matches = await services.getAllMatches();

    for (const match of matches) {
      if (!match.startTime || !match.endTime) continue;

      await syncMatchStatus(match, async (newStatus) => {
        await services.updateMatch(match.id, { status: newStatus });
      });

      if (match.status !== 'live') continue;

      await processMatch(match, services);

      if (match.currentMinute >= 90) {
        await services.updateMatch(match.id, { status: 'finished' });
        await services.deleteMatch(match.id);
      }
    }
  }, 3000);
}
