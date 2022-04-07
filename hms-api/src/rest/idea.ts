'use strict';

/* eslint-disable require-jsdoc */

import {Uuid} from '../util/uuids';

export class IdeaCreateRequest {
  ownerId: Uuid;
  hackathonId: Uuid;
  participantIds: Uuid[];
  title: string;
  description: string;
  problem: string;
  goal: string;
  requiredSkills: string[];
  categoryId: Uuid;

  constructor(
      ownerId: Uuid,
      hackathonId: Uuid,
      participantIds: Uuid[],
      title: string,
      description: string,
      problem: string,
      goal: string,
      requiredSkills: string[],
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

export class IdeaCreateResponse {
  id: Uuid;
  ownerId: Uuid;
  hackathonId: Uuid;
  participantIds: Uuid[];
  title: string;
  description: string;
  problem: string;
  goal: string;
  requiredSkills: string[];
  categoryId: Uuid;
  creationDate: Date;

  constructor(
      id: Uuid,
      ownerId: Uuid,
      hackathonId: Uuid,
      participantIds: Uuid[],
      title: string,
      description: string,
      problem: string,
      goal: string,
      requiredSkills: string[],
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

export class IdeaResponse {
  id: Uuid;
  ownerId: Uuid;
  hackathonId: Uuid;
  participantIds: Uuid[];
  title: string;
  description: string;
  problem: string;
  goal: string;
  requiredSkills: string[];
  categoryId: Uuid;
  creationDate: Date;

  constructor(
      id: Uuid,
      ownerId: Uuid,
      hackathonId: Uuid,
      participantIds: Uuid[],
      title: string,
      description: string,
      problem: string,
      goal: string,
      requiredSkills: string[],
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

export class IdeaListResponse {
  ids: Uuid[];
  hackathonId: Uuid;

  constructor(
      ids: Uuid[],
      hackathonId: Uuid,
  ) {
    this.ids = ids;
    this.hackathonId = hackathonId;
  }
}

export class IdeaDeletionResponse {
  id: Uuid;

  constructor(id: Uuid) {
    this.id = id;
  }
}
