/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';
import Idea from '../repository/domain/Idea';

class IdeaPreviewResponse {
  id: Uuid;
  title: string;
  creationDate: Date;

  constructor(
      id: Uuid,
      title: string,
      creationDate: Date,
  ) {
    this.id = id;
    this.title = title;
    this.creationDate = creationDate;
  }

  static from = (
      idea: Idea,
  ): IdeaPreviewResponse => new IdeaPreviewResponse(
      idea.id,
      idea.title,
      idea.creationDate,
  );

  static fromArray(ideas: Idea[]): IdeaPreviewResponse[] {
    const previews: IdeaPreviewResponse[] = [];
    for (const idea of ideas) {
      previews.push(IdeaPreviewResponse.from(idea));
    }
    return previews.sort(this.compare);
  }

  static compare(
      a: IdeaPreviewResponse,
      b: IdeaPreviewResponse,
  ): number {
    const aTime = a.creationDate.getTime();
    const bTime = b.creationDate.getTime();

    if (aTime === bTime) {
      return a.id.localeCompare(b.id);
    }

    return bTime - aTime;
  }
}

export default IdeaPreviewResponse;
