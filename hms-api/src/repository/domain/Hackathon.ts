/* eslint-disable require-jsdoc */

import Uuid, {uuid} from '../../util/Uuid';
import ValidationResult from '../../error/ValidationResult';

/**
 * A Hackathon is collection of Participants, Categories, and Ideas.
 *
 * It has a well-defined start and end date and voting for the winners of the
 * different Categories occurs at some point during this time.
 *
 * Every Hackathon will have 0 or more Categories
 *
 * Every Hackathon will have 0 or more Participants
 *
 * Every Hackathon will have 0 or more Ideas
 */
class Hackathon {
  /**
   * The ID of the Hackathon
   *
   * Generated upon creation
   */
  id: Uuid;

  /**
   * The title of the Hackathon
   *
   * Must have text (cannot be empty)
   */
  title: string;

  /**
   * The description of the Hackathon
   *
   * May be empty
   */
  description: string;

  /**
   * The start Date of the Hackathon
   *
   * Must be before than the endDate
   *
   * Can be null
   */
  startDate: Date;

  /**
   * The end Date of the Hackathon
   *
   * Must be after the startDate
   *
   * Can be null
   */
  endDate: Date;

  /**
   * The Date on which the Hackathon was created
   *
   * Generated upon creation
   */
  creationDate: Date;

  /**
   * Boolean that indicates if Voting is allowed or not
   *
   * Manually set on Admin Page
   */
  votingOpened: boolean;

  validate(): ValidationResult {
    const result = new ValidationResult();
    if (!this.id) {
      result.addFailure('id is null or empty');
    }

    if (!this.title) {
      result.addFailure('title is null or empty');
    }

    if (this.description === null || this.description === undefined) {
      result.addFailure('description is null');
    }

    if (
      this.startDate != null &&
      this.endDate != null &&
      this.startDate > this.endDate
    ) {
      result.addFailure(
        `startDate (${this.startDate}) is after endDate (${this.endDate})`,
      );
    }

    return result;
  }

  constructor(
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
  );
  constructor(
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    id: Uuid,
    creationDate: Date,
    votingOpened: boolean,
  );

  constructor(
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    id: Uuid = uuid(),
    creationDate: Date = new Date(),
    votingOpened: boolean = false,
  ) {
    this.title = title;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.id = id;
    this.creationDate = creationDate;
    this.votingOpened = votingOpened;
  }
}

export default Hackathon;
