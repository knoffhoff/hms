import {uuid, Uuid} from '../../../src/util/uuids';
import Hackathon from '../../../src/repository/domain/Hackathon';

const fiveDaysInMillis = 5 * 24 * 60 * 60 * 1000;
const tenDaysInMillis = 5 * 24 * 60 * 60 * 1000;

export interface HackathonData {
  id: Uuid;
  title: string;
  startDate: Date;
  endDate: Date;
  creationDate: Date;
  participantIds: string[];
  categoryIds: string[];
  ideaIds: string[];
}

export const makeHackathon = (
    {
      id = uuid(),
      title = 'Best Hackathon Ever',
      startDate = new Date(new Date().getTime() + fiveDaysInMillis),
      endDate = new Date(new Date().getTime() + tenDaysInMillis),
      creationDate = new Date,
      participantIds = [uuid(), uuid()],
      categoryIds = [uuid()],
      ideaIds = [uuid(), uuid(), uuid()],
    }: HackathonData): Hackathon => new Hackathon(
    title,
    startDate,
    endDate,
    id,
    creationDate,
    participantIds,
    categoryIds,
    ideaIds,
);

export const randomHackathon = ()
    : Hackathon => makeHackathon({} as HackathonData);
