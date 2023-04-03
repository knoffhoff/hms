/* eslint-disable require-jsdoc */

import Uuid from '../../util/Uuid'

class IdeaCreateRequest {
  ownerId: Uuid
  hackathonId: Uuid
  title: string
  description: string
  problem: string
  goal: string
  requiredSkills: Uuid[]
  categoryId: Uuid

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
    this.ownerId = ownerId
    this.hackathonId = hackathonId
    this.title = title
    this.description = description
    this.problem = problem
    this.goal = goal
    this.requiredSkills = requiredSkills
    this.categoryId = categoryId
  }

  static parse(body: string): IdeaCreateRequest {
    const json = JSON.parse(body)
    return new IdeaCreateRequest(
      json.ownerId,
      json.hackathonId,
      json.title,
      json.description,
      json.problem,
      json.goal,
      json.requiredSkills,
      json.categoryId,
    )
  }
}

export default IdeaCreateRequest
