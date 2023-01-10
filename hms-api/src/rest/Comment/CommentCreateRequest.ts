import Uuid from '../../util/Uuid';

class CommentCreateRequest {
  userId: Uuid;
  ideaId: Uuid;
  text: string;
  replyTo?: Uuid;

  constructor(userId: Uuid, ideaId: Uuid, text: string, replyTo?: Uuid) {
    this.userId = userId;
    this.ideaId = ideaId;
    this.text = text;
    this.replyTo = replyTo;
  }

  static parse(body: string): CommentCreateRequest {
    const json = JSON.parse(body);
    return new CommentCreateRequest(
      json.userId,
      json.ideaId,
      json.text,
      json.replyTo,
    );
  }
}

export default CommentCreateRequest;
