/* eslint-disable require-jsdoc */

import IdeaPreviewResponse from './IdeaPreviewResponse';
import Uuid from '../util/Uuid';
import Idea from '../repository/domain/Idea';

class IdeaListResponse {
  ideas: IdeaPreviewResponse[];
  hackathonId: Uuid;

  constructor(ideas: IdeaPreviewResponse[], hackathonId: Uuid) {
    this.ideas = ideas;
    this.hackathonId = hackathonId;
  }

  static fromArray = (ideas: Idea[], hackathonId: Uuid): IdeaListResponse =>
    new IdeaListResponse(IdeaPreviewResponse.fromArray(ideas), hackathonId);
}

export default IdeaListResponse;
