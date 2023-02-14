import Uuid from '../../util/Uuid';

class IdeaCommentCreateRequest {
  userId: Uuid;
  ideaId: Uuid;
  text: string;
  parentIdeaCommentId?: Uuid;

  constructor(
    userId: Uuid,
    ideaId: Uuid,
    text: string,
    parentIdeaCommentId?: Uuid,
  ) {
    this.userId = userId;
    this.ideaId = ideaId;
    this.text = text;
    this.parentIdeaCommentId = parentIdeaCommentId;
  }

  static parse(body: string): IdeaCommentCreateRequest {
    const json = JSON.parse(body);
    return new IdeaCommentCreateRequest(
      json.userId,
      json.ideaId,
      json.text,
      json.parentIdeaCommentId,
    );
  }
}

export default IdeaCommentCreateRequest;
