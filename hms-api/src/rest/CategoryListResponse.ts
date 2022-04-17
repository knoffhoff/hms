/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';
import CategoryPreviewResponse from './CategoryPreviewResponse';

export default class {
  categories: CategoryPreviewResponse[];
  hackathonId: Uuid;

  constructor(
      categories: CategoryPreviewResponse[],
      hackathonId: Uuid,
  ) {
    this.categories = categories;
    this.hackathonId = hackathonId;
  }
}
