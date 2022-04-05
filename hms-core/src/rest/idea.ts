import {Uuid} from '../uuids';

// eslint-disable-next-line require-jsdoc
export class IdeaCreateRequest {
  ownerId: Uuid;
  hackathonId: Uuid;
  participantIds: Set<Uuid>;
  title: string;
  description: string;
  problem: string;
  goal: string;
  requiredSkills: Set<string>;
  categoryId: Uuid;

  // eslint-disable-next-line require-jsdoc
  constructor(
      ownerId: Uuid,
      hackathonId: Uuid,
      participantIds: Set<Uuid>,
      title: string,
      description: string,
      problem: string,
      goal: string,
      requiredSkills: Set<string>,
      categoryId: Uuid,
  ) {
    this.ownerId = ownerId;
    this.hackathonId = hackathonId;
    this.participantIds = participantIds;
    this.title = title;
    this.description = description;
    this.problem = problem;
    this.goal = goal;
    this.requiredSkills = requiredSkills;
    this.categoryId = categoryId;
  }
}

// eslint-disable-next-line require-jsdoc
export class IdeaCreateResponse {
  id: Uuid;
  ownerId: Uuid;
  hackathonId: Uuid;
  participantIds: Set<Uuid>;
  title: string;
  description: string;
  problem: string;
  goal: string;
  requiredSkills: Set<string>;
  categoryId: Uuid;
  creationDate: Date;

  // eslint-disable-next-line require-jsdoc
  constructor(
      id: Uuid,
      ownerId: Uuid,
      hackathonId: Uuid,
      participantIds: Set<Uuid>,
      title: string,
      description: string,
      problem: string,
      goal: string,
      requiredSkills: Set<string>,
      categoryId: Uuid,
      creationDate: Date,
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

// eslint-disable-next-line require-jsdoc
export class IdeaResponse {
  id: Uuid;
  ownerId: Uuid;
  hackathonId: Uuid;
  participantIds: Set<Uuid>;
  title: string;
  description: string;
  problem: string;
  goal: string;
  requiredSkills: Set<string>;
  categoryId: Uuid;
  creationDate: Date;

  // eslint-disable-next-line require-jsdoc
  constructor(
      id: Uuid,
      ownerId: Uuid,
      hackathonId: Uuid,
      participantIds: Set<Uuid>,
      title: string,
      description: string,
      problem: string,
      goal: string,
      requiredSkills: Set<string>,
      categoryId: Uuid,
      creationDate: Date,
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

// eslint-disable-next-line require-jsdoc
export class IdeaListResponse {
  ids: Set<Uuid>;
  hackathonId: Uuid;

  // eslint-disable-next-line require-jsdoc
  constructor(
      ids: Set<Uuid>,
      hackathonId: Uuid,
  ) {
    this.ids = ids;
    this.hackathonId = hackathonId;
  }
}

// eslint-disable-next-line require-jsdoc
export class IdeaDeletionResponse {
  id: Uuid;

  // eslint-disable-next-line require-jsdoc
  constructor(id: Uuid) {
    this.id = id;
  }
}
