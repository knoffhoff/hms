/* eslint-disable require-jsdoc */

import IdeaPreviewResponse from './IdeaPreviewResponse';
import Idea from '../repository/domain/Idea';

class IdeaListAllResponse {
  ideas: IdeaPreviewResponse[];

  constructor(ideas: IdeaPreviewResponse[]) {
    this.ideas = ideas;
  }

  static from = (ideas: Idea[]): IdeaListAllResponse =>
    new IdeaListAllResponse(IdeaPreviewResponse.fromArray(ideas));
}

export default IdeaListAllResponse;
