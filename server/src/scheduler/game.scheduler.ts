import { processMatch } from '../engines/match.engine';

export function startScheduler(services: {
  getLiveMatches: () => Promise<any[]>;
  updateMatch: (id: number, data: any) => Promise<any>;
  insertCommentary: (data: any) => Promise<any>;
  broadcastCommentary: (matchId: string, data: any) => void;
}) {
  console.log('🚀 Scheduler started...');

  setInterval(async () => {
    try {
      const matches = await services.getLiveMatches();

      for (const match of matches) {
        const now = new Date();

        if (match.status === 'scheduled' && match.startTime && now >= match.startTime) {
          await services.updateMatch(match.id, { status: 'live' });
        }
        await processMatch(match, {
          updateMatch: services.updateMatch,
          insertCommentary: services.insertCommentary,
          broadcastCommentary: services.broadcastCommentary,
        });
      }
    } catch (error) {
      console.error('Scheduler error:', error);
    }
  }, 3000);
}
