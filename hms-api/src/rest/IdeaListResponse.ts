/* eslint-disable require-jsdoc */

import IdeaPreviewResponse from './IdeaPreviewResponse';
import {Uuid} from '../util/uuids';

export default class {
  ideas: IdeaPreviewResponse[];
  hackathonId: Uuid;

  constructor(
      ideas: IdeaPreviewResponse[],
      hackathonId: Uuid,
  ) {
    this.ideas = ideas;
    this.hackathonId = hackathonId;
  }
}
