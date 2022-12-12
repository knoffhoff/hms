import Uuid, {uuid} from '../../../src/util/Uuid';
import Idea from '../../../src/repository/domain/Idea';

export interface IdeaData {
  id: Uuid;
  ownerId: Uuid;
  hackathonId: Uuid;
  participantIds: Uuid[];
  voterIds: Uuid[];
  title: string;
  description: string;
  problem: string;
  goal: string;
  requiredSkills: Uuid[];
  categoryId: Uuid;
  creationDate: Date;
}

export const makeIdea = ({
  id = uuid(),
  ownerId = uuid(),
  hackathonId = uuid(),
  participantIds = [],
  voterIds = [],
  title = '#1 Best Idea :D',
  description = 'A super cool idea that is better than anything else',
  problem = 'We keep losing at hackathons',
  goal = 'Nothing really just win the hackathon',
  requiredSkills = [uuid(), uuid()],
  categoryId = uuid(),
  creationDate = new Date(),
}: IdeaData): Idea =>
  new Idea(
    ownerId,
    hackathonId,
    title,
    description,
    problem,
    goal,
    requiredSkills,
    categoryId,
    id,
    creationDate,
    participantIds,
    voterIds,
  );

export const randomIdea = (): Idea => makeIdea({} as IdeaData);
