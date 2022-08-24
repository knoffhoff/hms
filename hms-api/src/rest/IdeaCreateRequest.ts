/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';

class IdeaCreateRequest {
  ownerId: Uuid;
  hackathonId: Uuid;
  title: string;
  description: string;
  problem: string;
  goal: string;
  requiredSkills: Uuid[];
  categoryId: Uuid;
  finalVideoUrl: string;

  constructor(
    ownerId: Uuid,
    hackathonId: Uuid,
    title: string,
    description: string,
    problem: string,
    goal: string,
    requiredSkills: Uuid[],
    categoryId: Uuid,
    finalVideoUrl: string,
  ) {
    this.ownerId = ownerId;
    this.hackathonId = hackathonId;
    this.title = title;
    this.description = description;
    this.problem = problem;
    this.goal = goal;
    this.requiredSkills = requiredSkills;
    this.categoryId = categoryId;
    this.finalVideoUrl = finalVideoUrl;
  }

  static parse(body: string): IdeaCreateRequest {
    const json = JSON.parse(body);
    return new IdeaCreateRequest(
      json.ownerId,
      json.hackathonId,
      json.title,
      json.description,
      json.problem,
      json.goal,
      json.requiredSkills,
      json.categoryId,
      json.finalVideoUrl,
    );
  }
}

export default IdeaCreateRequest;
