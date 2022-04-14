import {uuid, Uuid} from '../../util/uuids';

/**
 * An Idea is... well an Idea idk it's a thing people work on
 */
export default class {
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

  constructor(
      ownerId: Uuid,
      hackathonId: Uuid,
      title: string,
      description: string,
      problem: string,
      goal: string,
      requiredSkills: Uuid[],
      categoryId: Uuid,
  );
  constructor(
      ownerId: Uuid,
      hackathonId: Uuid,
      title: string,
      description: string,
      problem: string,
      goal: string,
      requiredSkills: Uuid[],
      categoryId: Uuid,
      id: Uuid,
      creationDate: Date,
      participantIds: Uuid[],
  );

  // eslint-disable-next-line require-jsdoc
  constructor(
      ownerId: Uuid,
      hackathonId: Uuid,
      title: string,
      description: string,
      problem: string,
      goal: string,
      requiredSkills: Uuid[],
      categoryId: Uuid,
      id: Uuid = uuid(),
      creationDate: Date = new Date(),
      participantIds: Uuid[] = [],
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.hackathonId = hackathonId;
    this.participantIds = participantIds;
    this.title = title;
    this.description = description;
    this.problem = problem;
    this.goal = goal;
    this.requiredSkills = requiredSkills;
    this.categoryId = categoryId;
    this.creationDate = creationDate;
  }
}
