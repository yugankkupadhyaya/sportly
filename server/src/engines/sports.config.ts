export const sports = ['football', 'basketball', 'cricket', 'tennis'] as const;
export type Sport = typeof sports[number];

export const sportIcons: Record<Sport, string> = {
  football: '⚽',
  basketball: '🏀',
  cricket: '🏏',
  tennis: '🎾',
};

export const teamPools: Record<Sport, string[]> = {
  football: ['Arsenal', 'Barcelona', 'Real Madrid', 'PSG', 'Bayern Munich'],
  basketball: ['Lakers', 'Warriors', 'Bulls', 'Heat', 'Celtics'],
  cricket: ['India', 'Australia', 'England', 'Pakistan', 'South Africa'],
  tennis: ['Nadal', 'Djokovic', 'Federer', 'Alcaraz', 'Medvedev'],
};

export const sportLeagues: Record<Sport, string> = {
  football: 'Champions League',
  basketball: 'NBA',
  cricket: 'World Cup',
  tennis: 'Grand Slam',
};

export const sportMatchDurations: Record<Sport, number> = {
  football: 90,
  basketball: 48,
  cricket: 100, // Normalized overs/balls max
  tennis: 100, // Normalized rally points count
};
