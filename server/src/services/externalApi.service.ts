import axios from 'axios';

const API_KEY = process.env.API_SPORTS_KEY!;
const BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
  },
});
export async function getLiveMatches() {
  const res = await api.get('/fixtures?live=all');

  return res.data.response.map((match: any) => ({
    id: match.fixture.id,
    league: match.league.name,
    homeTeam: match.teams.home.name,
    awayTeam: match.teams.away.name,
    homeScore: match.goals.home,
    awayScore: match.goals.away,
    status: match.fixture.status.short,
    time: match.fixture.status.elapsed,
  }));
}
