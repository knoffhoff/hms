import Uuid, {uuid} from '../../util/Uuid';
import ValidationResult from '../../error/ValidationResult';

/**
 * A IdeaComment represents a single String of text posted by a User on an Idea
 *
 * A IdeaComment belongs to 1 and only 1 Idea
 *
 * A IdeaComment maps to 1 and only 1 User
 */
export default class {
  /**
   * The ID of the IdeaComment
   *
   * Generated upon creation
   */
  id: Uuid;

  /**
   * The ID of the User which the IdeaComment represents
   */
  userId: Uuid;

  /**
   * The ID of the Idea to which the IdeaComment belongs
   */
  ideaId: Uuid;

  /**
   * the String that contains the text of the IdeaComment
   */
  text: string;

  /**
   * The Date on which the IdeaComment was created
   *
   * Generated upon creation
   */
  creationDate: Date;

  /**
   * the comment object that this comment is a reply to
   *
   * if this is a top level comment, this will be null
   */
  parentIdeaCommentId?: Uuid;

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

  constructor(
    userId: Uuid,
    ideaId: Uuid,
    text: string,
    parentIdeaCommentId?: Uuid,
  );
  constructor(
    userId: Uuid,
    ideaId: Uuid,
    text: string,
    id: Uuid,
    creationDate: Date,
    parentIdeaCommentId?: Uuid,
  );

  constructor(
    userId: Uuid,
    ideaId: Uuid,
    text: string,
    id: Uuid = uuid(),
    creationDate: Date = new Date(),
    parentIdeaCommentId?: Uuid,
  ) {
    this.id = id;
    this.userId = userId;
    this.ideaId = ideaId;
    this.text = text;
    this.creationDate = creationDate;
    this.parentIdeaCommentId = parentIdeaCommentId;
  }
}
