import Uuid, { uuid } from '../../../src/util/Uuid'
import Hackathon from '../../../src/repository/domain/Hackathon'

const fiveDaysInMillis = 5 * 24 * 60 * 60 * 1000
const tenDaysInMillis = 10 * 24 * 60 * 60 * 1000

export interface HackathonData {
  id: Uuid;
  title: string;
  description: string;
  slug: string;
  startDate: Date;
  endDate: Date;
  creationDate: Date;
  votingOpened: boolean;
}

export const makeHackathon = ({
  id = uuid(),
  title = 'Best Hackathon Ever',
  description = 'The worst possible description you could imagine...',
  slug = 'best_hackathon_ever',
  startDate = new Date(new Date().getTime() + fiveDaysInMillis),
  endDate = new Date(new Date().getTime() + tenDaysInMillis),
  creationDate = new Date(),
  votingOpened = false,
}: HackathonData): Hackathon =>
  new Hackathon(
    title,
    description,
    slug,
    startDate,
    endDate,
    id,
    creationDate,
    votingOpened,
  )

export const randomHackathon = (): Hackathon =>
  makeHackathon({} as HackathonData)
