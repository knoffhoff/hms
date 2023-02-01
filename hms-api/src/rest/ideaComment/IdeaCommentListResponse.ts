import IdeaCommentResponse from './IdeaCommentResponse';
import Uuid from '../../util/Uuid';
import IdeaComment from '../../repository/domain/IdeaComment';
import User from '../../repository/domain/User';

class IdeaCommentListResponse {
  ideaComments: IdeaCommentResponse[];
  ideaId: Uuid;
  users: User[];

  constructor(
    ideaComments: IdeaCommentResponse[],
    ideaId: Uuid,
    users: User[],
  ) {
    this.ideaComments = ideaComments;
    this.ideaId = ideaId;
    this.users = users;
  }

  static from = (
    ideaComments: IdeaComment[],
    users: User[],
    ideaId: Uuid,
  ): IdeaCommentListResponse =>
    new IdeaCommentListResponse(
      IdeaCommentResponse.fromArray(ideaComments, users),
      ideaId,
      users,
    );
}

export default IdeaCommentListResponse;
