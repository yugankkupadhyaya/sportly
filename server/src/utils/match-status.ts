import { MATCH_STATUS, type MatchStatus } from '../validation/matches.validation';

export function getMatchStatus(
  startTime: string | Date,
  endTime: string | Date,
  now: Date = new Date()
): MatchStatus | null {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  if (now < start) {
    return MATCH_STATUS.SCHEDULED;
  }

  if (now >= end) {
    return MATCH_STATUS.FINISHED;
  }

  return MATCH_STATUS.LIVE;
}

interface MatchWithStatus {
  startTime: string | Date;
  endTime: string | Date;
  status: string;
}

export async function syncMatchStatus<T extends MatchWithStatus>(
  match: T,
  updateStatus: (status: MatchStatus) => Promise<any>
): Promise<MatchStatus> {
  const nextStatus = getMatchStatus(match.startTime, match.endTime);

  if (!nextStatus) {
    return match.status as MatchStatus;
  }

  if (match.status !== nextStatus) {
    await updateStatus(nextStatus);
    match.status = nextStatus;
  }

  return match.status as MatchStatus;
}
