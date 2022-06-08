import Uuid, {uuid} from '../../util/Uuid';

/**
 * A Participant represents a single User participating in a single Hackathon
 *
 * A Participant belongs to 1 and only 1 Hackathon
 *
 * A Participant maps to 1 and only 1 User
 */
export default class {
  /**
   * The ID of the Participant
   *
   * Generated upon creation
   */
  id: Uuid;

  /**
   * The ID of the User which the Participant represents
   */
  userId: Uuid;

  /**
   * The ID of the Hackathon to which the Participant belongs
   */
  hackathonId: Uuid;

  /**
   * The Date on which the Participant was created
   *
   * Generated upon creation
   */
  creationDate: Date;

  constructor(
      userId: Uuid,
      hackathonId: Uuid,
  );
  constructor(
      userId: Uuid,
      hackathonId: Uuid,
      id: Uuid,
      creationDate: Date,
  );

  // eslint-disable-next-line require-jsdoc
  constructor(
      userId: Uuid,
      hackathonId: Uuid,
      id: Uuid = uuid(),
      creationDate: Date = new Date(),
  ) {
    this.id = id;
    this.userId = userId;
    this.hackathonId = hackathonId;
    this.creationDate = creationDate;
  }
}
