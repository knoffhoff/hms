/* eslint-disable require-jsdoc */

import Uuid, {uuid} from '../../util/Uuid';
import ValidationResult from '../../error/ValidationResult';

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
  id: Uuid;

  /**
   * The ID of the Participant which owns (created) the Idea
   */
  ownerId: Uuid;

  /**
   * The ID of the Hackathon to which the Idea belongs
   */
  hackathonId: Uuid;

  /**
   *The IDs of the Participants that will work on the Idea
   *
   * Can be empty
   */
  participantIds: Uuid[];

  /**
   * The title of the Idea
   *
   * Must have text (cannot be empty)
   */
  title: string;

  /**
   * The description of the Idea
   *
   * May be empty
   */
  description: string;

  /**
   * A description of the problem which the Idea intends to solve
   *
   * May be empty
   */
  problem: string;

  /**
   * A description of the goal of the Idea
   *
   * May be empty
   */
  goal: string;

  /**
   * A list Skill IDs which are desired for the completion of the Idea
   *
   * May be empty
   */
  requiredSkills: Uuid[];

  /**
   * The ID of the Category to which the Idea belongs
   */
  categoryId: Uuid;

  /**
   * The Date on which the Idea was created
   *
   * Generated upon creation
   */
  creationDate: Date;

  validate(): ValidationResult {
    const result = new ValidationResult();
    if (this.title.length === 0) {
      result.addFailure('title has length 0');
    }
    return result;
  }

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

export default Idea;
