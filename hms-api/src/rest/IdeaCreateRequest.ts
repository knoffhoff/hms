/* eslint-disable require-jsdoc */

import {Uuid} from '../util/uuids';

export default class {
  ownerId: Uuid;
  hackathonId: Uuid;
  title: string;
  description: string;
  problem: string;
  goal: string;
  requiredSkills: Uuid[];
  categoryId: Uuid;

  constructor(
      ownerId: Uuid,
      hackathonId: Uuid,
      title: string,
      description: string,
      problem: string,
      goal: string,
      requiredSkills: Uuid[],
      categoryId: Uuid,
  ) {
    this.ownerId = ownerId;
    this.hackathonId = hackathonId;
    this.title = title;
    this.description = description;
    this.problem = problem;
    this.goal = goal;
    this.requiredSkills = requiredSkills;
    this.categoryId = categoryId;
  }
}
