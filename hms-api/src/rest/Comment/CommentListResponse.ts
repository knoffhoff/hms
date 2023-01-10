import CommentResponse from './CommentResponse';
import Uuid from '../../util/Uuid';
import IdeaComment from '../../repository/domain/IdeaComment';
import User from '../../repository/domain/User';

class CommentListResponse {
  comments: CommentResponse[];
  ideaId: Uuid;

  constructor(comments: CommentResponse[], ideaId: Uuid) {
    this.comments = comments;
    this.ideaId = ideaId;
  }

  static from = (
    comments: IdeaComment[],
    users: User[],
    ideaId: Uuid,
  ): CommentListResponse =>
    new CommentListResponse(CommentResponse.fromArray(comments, users), ideaId);
}

export default CommentListResponse;
