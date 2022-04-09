/* eslint-disable require-jsdoc */

import {Uuid} from '../util/uuids';

export default class {
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
