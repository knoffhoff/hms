import {uuid, Uuid} from '../../../src/util/uuids';
import Idea from '../../../src/repository/domain/Idea';

export interface IdeaData {
  id: Uuid;
  ownerId: Uuid;
  hackathonId: Uuid;
  participantIds: Uuid[];
  title: string;
  description: string;
  problem: string;
  goal: string;
  requiredSkills: Uuid[];
  categoryId: Uuid;
  creationDate: Date;
}

export const makeIdea = (
    {
      id = uuid(),
      ownerId = uuid(),
      hackathonId = uuid(),
      participantIds = [uuid(), uuid(), uuid()],
      title = '#1 Best Idea :D',
      description = 'A super cool idea that is better than anything else',
      problem = 'We keep losing at hackathons',
      goal = 'Nothing really just win the hackathon',
      requiredSkills = [uuid(), uuid()],
      categoryId = uuid(),
      creationDate = new Date(),
    }: IdeaData): Idea => new Idea(
    ownerId,
    hackathonId,
    participantIds,
    title,
    description,
    problem,
    goal,
    requiredSkills,
    categoryId,
    id,
    creationDate,
);

export const randomIdea = ()
    : Idea => makeIdea({} as IdeaData);
