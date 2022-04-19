/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';
import Idea from '../repository/domain/Idea';

class IdeaPreviewResponse {
  id: Uuid;
  title: string;

  constructor(
      id: Uuid,
      title: string,
  ) {
    this.id = id;
    this.title = title;
  }

  static from = (idea: Idea): IdeaPreviewResponse =>
    new IdeaPreviewResponse(
        idea.id,
        idea.title,
    );

  static fromArray(ideas: Idea[]): IdeaPreviewResponse[] {
    const previews: IdeaPreviewResponse[] = [];
    for (const idea of ideas) {
      previews.push(IdeaPreviewResponse.from(idea));
    }
    return previews;
  }
}

export default IdeaPreviewResponse;
