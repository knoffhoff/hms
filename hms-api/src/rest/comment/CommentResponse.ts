import Uuid from '../../util/Uuid';
import IdeaComment from '../../repository/domain/IdeaComment';
import UserPreviewResponse from '../user/UserPreviewResponse';
import User from '../../repository/domain/User';

class CommentResponse {
  id: Uuid;
  user: UserPreviewResponse;
  ideaId: Uuid;
  text: string;
  replyTo: Uuid;
  creationDate: Date;

  constructor(
    id: Uuid,
    user: UserPreviewResponse,
    ideaId: Uuid,
    text: string,
    replyTo: Uuid,
    creationDate: Date,
  ) {
    this.id = id;
    this.user = user;
    this.ideaId = ideaId;
    this.text = text;
    this.replyTo = replyTo;
    this.creationDate = creationDate;
  }

  static from = (ideaComment: IdeaComment, user: User): CommentResponse =>
    new CommentResponse(
      ideaComment.id,
      user ? UserPreviewResponse.from(user) : null,
      ideaComment.ideaId,
      ideaComment.text,
      ideaComment.replyTo,
      ideaComment.creationDate,
    );

  static fromArray(comments: IdeaComment[], users: User[]): CommentResponse[] {
    const previews: CommentResponse[] = [];
    for (const comment of comments) {
      previews.push(
        CommentResponse.from(
          comment,
          users.find((user) => user.id === comment.userId),
        ),
      );
    }
    return previews.sort(this.compare);
  }

  static compare(a: CommentResponse, b: CommentResponse): number {
    const diff = a.creationDate.getTime() - b.creationDate.getTime();
    if (diff) {
      return diff;
    }

    return a.id.localeCompare(b.id);
  }
}

export default CommentResponse;
