import Uuid from '../../util/Uuid';

class CommentEditRequest {
  id: Uuid;
  text: string;

  constructor(id: Uuid, text: string) {
    this.id = id;
    this.text = text;
  }

  static parse(body: string): CommentEditRequest {
    const json = JSON.parse(body);
    return new CommentEditRequest(json.id, json.text);
  }
}

export default CommentEditRequest;
