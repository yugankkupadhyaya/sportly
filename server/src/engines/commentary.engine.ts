import { EventType } from './event.engine';

export interface CommentaryInput {
  eventType: EventType;
  team?: 'HOME' | 'AWAY';
  homeTeam: string;
  awayTeam: string;
  minute: number;
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

const neutralComments = [
  'Both teams are battling in midfield.',
  'Possession being contested.',
  'The game is slowing down a bit.',
];

function randomPick(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateCommentary(input: CommentaryInput): string {
  const { eventType, team, homeTeam, awayTeam, minute } = input;

  const teamName = team === 'HOME' ? homeTeam : team === 'AWAY' ? awayTeam : '';

  let template = '';

  switch (eventType) {
    case 'GOAL':
      template = randomPick(goalComments);
      break;
    case 'FOUL':
      template = randomPick(foulComments);
      break;
    case 'CARD':
      template = randomPick(cardComments);
      break;
    case 'CHANCE':
      template = randomPick(chanceComments);
      break;
    default:
      template = randomPick(neutralComments);
  }

  const message = template.replace('{team}', teamName);

  return `${minute}' ${message}`;
}
