/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';

class IdeaEditRequest {
  hackathonId: Uuid;
  title: string;
  description: string;
  problem: string;
  goal: string;
  requiredSkills: Uuid[];
  categoryId: Uuid;

  constructor(
    hackathonId: Uuid,
    title: string,
    description: string,
    problem: string,
    goal: string,
    requiredSkills: Uuid[],
    categoryId: Uuid,
  ) {
    this.hackathonId = hackathonId;
    this.title = title;
    this.description = description;
    this.problem = problem;
    this.goal = goal;
    this.requiredSkills = requiredSkills;
    this.categoryId = categoryId;
  }

  static parse(body: string): IdeaEditRequest {
    const json = JSON.parse(body);
    return new IdeaEditRequest(
      json.hackathonId,
      json.title,
      json.description,
      json.problem,
      json.goal,
      json.requiredSkills,
      json.categoryId,
    );
  }
}

export default IdeaEditRequest;
