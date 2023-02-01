import Uuid from '../../util/Uuid';

class IdeaCommentEditRequest {
  id: Uuid;
  text: string;

  constructor(id: Uuid, text: string) {
    this.id = id;
    this.text = text;
  }

  static parse(body: string): IdeaCommentEditRequest {
    const json = JSON.parse(body);
    return new IdeaCommentEditRequest(json.id, json.text);
  }
}

export default IdeaCommentEditRequest;
