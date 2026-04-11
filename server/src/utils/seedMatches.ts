import { db } from '../config/db';
import { matches } from '../db/schema';
import { getMatchStatus } from './match-status';
import { MatchStatus } from '../db/schema';

type Sport = 'football' | 'cricket' | 'basketball';

const sportsTeams: Record<Sport, string[]> = {
  football: [
    'Real Madrid',
    'Barcelona',
    'Man City',
    'Liverpool',
    'Bayern Munich',
    'PSG',
    'Arsenal',
    'Chelsea',
    'Juventus',
    'AC Milan',
  ],

  cricket: [
    'India',
    'Australia',
    'England',
    'Pakistan',
    'South Africa',
    'New Zealand',
    'Sri Lanka',
  ],

  basketball: ['Lakers', 'Warriors', 'Celtics', 'Bulls', 'Nets', 'Heat', 'Suns'],
};

const sports: Sport[] = ['football', 'cricket', 'basketball'];

function getRandomSport(): Sport {
  return sports[Math.floor(Math.random() * sports.length)];
}

function getRandomTeams(sport: Sport) {
  const teams = [...sportsTeams[sport]];
  const shuffled = teams.sort(() => 0.5 - Math.random());

  return [shuffled[0], shuffled[1]];
}

function getRandomStatus() {
  const roll = Math.random();

  if (roll < 0.7) return 'live';
  if (roll < 0.85) return 'scheduled';
  return 'finished';
}

function getRandomTime(status: string) {
  const now = Date.now();

  if (status === 'live') {
    return {
      startTime: new Date(now - 30 * 60 * 1000),
      endTime: new Date(now + 60 * 60 * 1000),
    };
  }

  if (status === 'scheduled') {
    return {
      startTime: new Date(now + 30 * 60 * 1000),
      endTime: new Date(now + 2 * 60 * 60 * 1000),
    };
  }

  return {
    startTime: new Date(now - 2 * 60 * 60 * 1000),
    endTime: new Date(now - 30 * 60 * 1000),
  };
}

export async function seedMatches(count = 15) {
  console.log(`🌱 Seeding ${count} matches...`);

  for (let i = 0; i < count; i++) {
    const sport = getRandomSport();
    const [homeTeam, awayTeam] = getRandomTeams(sport);

    const now = Date.now();
    const startTime = new Date(now - Math.floor(Math.random() * 2 * 60 * 60 * 1000)); // Random past start time
    const endTime = new Date(startTime.getTime() + Math.floor(Math.random() * 2 * 60 * 60 * 1000)); // Random duration

    const status: MatchStatus = getMatchStatus(startTime, endTime) as MatchStatus;

    await db.insert(matches).values({
      sport,
      homeTeam,
      awayTeam,
      status,
      startTime,
      endTime,
      homeScore: status === 'finished' ? Math.floor(Math.random() * 5) : 0,
      awayScore: status === 'finished' ? Math.floor(Math.random() * 5) : 0,
      currentMinute: status === 'live' ? Math.floor(Math.random() * 90) : 0,
    });
  }

  console.log('✅ Matches seeded successfully');
}
