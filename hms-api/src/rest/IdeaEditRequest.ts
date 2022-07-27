/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';

class IdeaEditRequest {
  title: string;
  description: string;
  problem: string;
  goal: string;
  requiredSkills: Uuid[];
  categoryId: Uuid;

  constructor(
    title: string,
    description: string,
    problem: string,
    goal: string,
    requiredSkills: Uuid[],
    categoryId: Uuid,
  ) {
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
