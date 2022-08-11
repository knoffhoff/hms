/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';

class IdeaEditRequest {
  title: string;
  description: string;
  problem: string;
  goal: string;
  requiredSkills: Uuid[];
  categoryId: Uuid;
  hypothesis: string;
  successMeasure: string;
  followUp: string;
  outcome: string;

  constructor(
    title: string,
    description: string,
    problem: string,
    goal: string,
    requiredSkills: Uuid[],
    categoryId: Uuid,
    hypothesis: string,
    successMeasure: string,
    followUp: string,
    outcome: string,
  ) {
    this.title = title;
    this.description = description;
    this.problem = problem;
    this.goal = goal;
    this.requiredSkills = requiredSkills;
    this.categoryId = categoryId;
    this.hypothesis = hypothesis;
    this.successMeasure = successMeasure;
    this.followUp = followUp;
    this.outcome = outcome;
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
      json.hypothesis,
      json.successMeasure,
      json.followUp,
      json.outcome,
    );
  }
}

export default IdeaEditRequest;
