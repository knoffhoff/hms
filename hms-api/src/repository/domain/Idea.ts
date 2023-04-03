/* eslint-disable require-jsdoc */

import Uuid, { uuid } from '../../util/Uuid'
import ValidationResult from '../../error/ValidationResult'

/**
 * An Idea is a concept on which Participants work during the Hackathon
 *
 * Every Idea belongs to 1 and only 1 Category
 *
 * Every Idea belongs to 1 and only 1 Hackathon
 *
 * Every Idea has 0 or mre Participants
 *
 * Every Idea is owned by 1 and only 1 Owner
 */
class Idea {
  /**
   * The ID of the Idea
   *
   * Generated upon creation
   */
  id: Uuid

  /**
   * The ID of the User which owns (created) the Idea
   */
  ownerId: Uuid

  /**
   * The ID of the Hackathon to which the Idea belongs
   */
  hackathonId: Uuid

  /**
   *The User IDs of the Participants that will work on the Idea
   *
   * Can be empty
   */
  participantIds: Uuid[]

  /**
   * The IDs of the Voters that voted for the Idea
   *
   * Can be empty
   *
   */
  voterIds: Uuid[]

  /**
   * The title of the Idea
   *
   * Must have text (cannot be empty)
   */
  title: string

  /**
   * The description of the Idea
   *
   * May be empty
   */
  description: string

  /**
   * A description of the problem which the Idea intends to solve
   *
   * May be empty
   */
  problem: string

  /**
   * A description of the goal of the Idea
   *
   * May be empty
   */
  goal: string

  /**
   * A list Skill IDs which are desired for the completion of the Idea
   *
   * May be empty
   */
  requiredSkills: Uuid[]

  /**
   * The ID of the Category to which the Idea belongs
   */
  categoryId: Uuid

  /**
   * The Date on which the Idea was created
   *
   * Generated upon creation
   */
  creationDate: Date

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
    voterIds: Uuid[],
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
    id: Uuid = uuid(),
    creationDate: Date = new Date(),
    participantIds: Uuid[] = [],
    voterIds: Uuid[] = [],
  ) {
    this.id = id
    this.ownerId = ownerId
    this.hackathonId = hackathonId
    this.participantIds = participantIds
    this.voterIds = voterIds
    this.title = title
    this.description = description
    this.problem = problem
    this.goal = goal
    this.requiredSkills = requiredSkills
    this.categoryId = categoryId
    this.creationDate = creationDate
  }

  validate(): ValidationResult {
    const result = new ValidationResult()
    if (!this.id) {
      result.addFailure('id is null or empty')
    }

    if (!this.ownerId) {
      result.addFailure('ownerId is null or empty')
    }

    if (!this.hackathonId) {
      result.addFailure('hackathonId is null or empty')
    }

    if (!this.participantIds) {
      result.addFailure('participantIds is null')
    }

    if (!this.voterIds) {
      result.addFailure('voterIds is null')
    }

    if (!this.title) {
      result.addFailure('title is null or empty')
    }

    if (this.description === null || this.description === undefined) {
      result.addFailure('description is null')
    }

    if (this.problem === null || this.problem === undefined) {
      result.addFailure('problem is null')
    }

    if (this.goal === null || this.goal === undefined) {
      result.addFailure('goal is null')
    }

    if (!this.requiredSkills) {
      result.addFailure('requiredSkills is null or empty')
    }

    if (!this.categoryId) {
      result.addFailure('categoryId is null or empty')
    }
    return result
  }
}

export default Idea
