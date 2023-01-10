import Uuid, {uuid} from '../../util/Uuid';
import ValidationResult from '../../error/ValidationResult';

/**
 * A Comment represents a single String of text posted by a User on an Idea
 *
 * A Comment belongs to 1 and only 1 Idea
 *
 * A Comment maps to 1 and only 1 User
 */
export default class {
  /**
   * The ID of the Comment
   *
   * Generated upon creation
   */
  id: Uuid;

  /**
   * The ID of the User which the Comment represents
   */
  userId: Uuid;

  /**
   * The ID of the Idea to which the Comment belongs
   */
  ideaId: Uuid;

  /**
   * the String that contains the text of the Comment
   */
  text: string;

  /**
   * the comment object that this comment is a reply to
   *
   * if this is a top level comment, this will be null
   */
  replyTo: Uuid;

  /**
   * The Date on which the Comment was created
   *
   * Generated upon creation
   */
  creationDate: Date;

  validate(): ValidationResult {
    const result = new ValidationResult();
    if (!this.id) {
      result.addFailure('id is null or empty');
    }

    if (!this.userId) {
      result.addFailure('userId is null or empty');
    }

    if (!this.ideaId) {
      result.addFailure('ideaId is null or empty');
    }

    if (!this.text) {
      result.addFailure('text is null or empty');
    }

    return result;
  }

  constructor(userId: Uuid, ideaId: Uuid, text: string, replyTo: Uuid);
  constructor(
    userId: Uuid,
    ideaId: Uuid,
    text: string,
    replyTo: Uuid,
    id: Uuid,
    creationDate: Date,
  );

  constructor(
    userId: Uuid,
    ideaId: Uuid,
    text: string,
    replyTo: Uuid,
    id: Uuid = uuid(),
    creationDate: Date = new Date(),
  ) {
    this.id = id;
    this.userId = userId;
    this.ideaId = ideaId;
    this.text = text;
    this.replyTo = replyTo;
    this.creationDate = creationDate;
  }
}
