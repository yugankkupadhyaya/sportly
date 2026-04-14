import { EventType } from './event.engine';
import { Sport } from './sports.config';

export interface CommentaryInput {
  eventType: EventType;
  team?: 'HOME' | 'AWAY';
  homeTeam: string;
  awayTeam: string;
  minute: number;
  sport?: Sport | string;
}

const goalComments = [
  'GOAL! {team} finds the net!',
  'WHAT A STRIKE by {team}!',
  '{team} scores! Brilliant finish!',
  "It's in! {team} takes the chance!",
];

const foulComments = [
  "That's a foul by {team}.",
  'Referee blows the whistle. Foul committed.',
  'Late challenge from {team}.',
];

const cardComments = [
  'Yellow card shown to {team}.',
  "That's a booking for {team}.",
  'Referee reaches for the card.',
];

const chanceComments = [
  'So close! {team} almost scores!',
  'A great chance for {team}!',
  'That was nearly a goal!',
];

const neutralComments = {
  football: [
    'Both teams are battling in midfield.',
    'Possession being contested.',
    'The game is slowing down a bit.',
  ],
  basketball: [
    'Fast break opportunity...',
    'Setting up the half-court offense.',
    'Good ball movement here.',
  ],
  cricket: [
    'Solid defensive shot.',
    'Waiting for the bad ball.',
    'Good line and length from the bowler.',
  ],
  tennis: [
    'Long rally from the baseline.',
    'Slicing the backhand to slow the pace.',
    'Both players trading heavy groundstrokes.',
  ]
};

function randomPick(arr: string[] | undefined) {
  if (!arr || arr.length === 0) return '';
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateCommentary(input: CommentaryInput): string {
  const { eventType, team, homeTeam, awayTeam, minute, sport = 'football' } = input;

  const teamName = team === 'HOME' ? homeTeam : team === 'AWAY' ? awayTeam : '';

  let template = '';

  switch (eventType) {
    case 'GOAL':
      if (sport === 'basketball') template = randomPick(['Swish! {team} hits a 3-pointer!', '{team} drives and scores!', 'Great shot by {team}!']);
      else if (sport === 'cricket') template = randomPick(['FOUR! Great shot by {team}!', 'SIX! Massive hit from {team}!', '{team} adds runs to the board.']);
      else if (sport === 'tennis') template = randomPick(['Ace! {team} wins the point!', 'Winner down the line from {team}!', 'Unforced error, point for {team}.']);
      else template = randomPick(goalComments);
      break;
    case 'FOUL':
      if (sport === 'basketball') template = randomPick(['Foul on the play. {team} goes to the line.', 'Offensive foul called.', 'Reaching in, foul.']);
      else if (sport === 'cricket') template = randomPick(['Wide ball!', 'No ball called.', 'Appealing for lbw... not given.']);
      else if (sport === 'tennis') template = randomPick(['Double fault.', 'Foot fault called.', 'Let, first service.']);
      else template = randomPick(foulComments);
      break;
    case 'CARD':
      if (sport === 'basketball') template = randomPick(['Technical foul given to {team}.', 'Flagrant foul called!', 'Coach is furious!']);
      else if (sport === 'cricket') template = randomPick(['WICKET! {team} loses a batsman.', 'Caught behind!', 'Clean bowled!']);
      else if (sport === 'tennis') template = randomPick(['Code violation warning.', 'Time violation.', 'Player is arguing with the umpire.']);
      else template = randomPick(cardComments);
      break;
    case 'CHANCE':
      if (sport === 'basketball') template = randomPick(['Missed the open look!', 'Rims out!', 'Block! Great defense.']);
      else if (sport === 'cricket') template = randomPick(['Just missed the edge!', 'Dropped! That was a tough chance.', 'Direct hit... but he is safe.']);
      else if (sport === 'tennis') template = randomPick(['Net cord... falls back.', 'Just wide!', 'Challenging the call... ball was IN.']);
      else template = randomPick(chanceComments);
      break;
    default:
      template = randomPick((neutralComments as any)[sport] || neutralComments.football);
  }

  const message = template.replace('{team}', teamName);
  console.log('📝 Commentary:', message);
  return `${minute}' ${message}`;
}
