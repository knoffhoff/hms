import CommentResponse from './CommentResponse';
import Uuid from '../../util/Uuid';
import IdeaComment from '../../repository/domain/IdeaComment';
import User from '../../repository/domain/User';

class CommentListResponse {
  comments: CommentResponse[];
  ideaId: Uuid;
  users: User[];

  constructor(comments: CommentResponse[], ideaId: Uuid, users: User[]) {
    this.comments = comments;
    this.ideaId = ideaId;
    this.users = users;
  }

  static from = (
    comments: IdeaComment[],
    users: User[],
    ideaId: Uuid,
  ): CommentListResponse =>
    new CommentListResponse(
      CommentResponse.fromArray(comments, users),
      ideaId,
      users,
    );
}

export default CommentListResponse;
