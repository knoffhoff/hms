import Uuid, {uuid} from '../../../src/util/Uuid';
import Hackathon from '../../../src/repository/domain/Hackathon';

const fiveDaysInMillis = 5 * 24 * 60 * 60 * 1000;
const tenDaysInMillis = 5 * 24 * 60 * 60 * 1000;

export interface HackathonData {
  id: Uuid;
  title: string;
  startDate: Date;
  endDate: Date;
  creationDate: Date;
}

export const makeHackathon = (
    {
      id = uuid(),
      title = 'Best Hackathon Ever',
      startDate = new Date(new Date().getTime() + fiveDaysInMillis),
      endDate = new Date(new Date().getTime() + tenDaysInMillis),
      creationDate = new Date,
    }: HackathonData): Hackathon => new Hackathon(
    title,
    startDate,
    endDate,
    id,
    creationDate,
);

export const randomHackathon = ()
    : Hackathon => makeHackathon({} as HackathonData);
