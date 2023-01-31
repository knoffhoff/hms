/* eslint-disable require-jsdoc */

import Uuid from '../../util/Uuid';
import CategoryPreviewResponse from './CategoryPreviewResponse';
import Category from '../../repository/domain/Category';

class CategoryListResponse {
  categories: CategoryPreviewResponse[];
  hackathonId: Uuid;

  constructor(categories: CategoryPreviewResponse[], hackathonId: Uuid) {
    this.categories = categories;
    this.hackathonId = hackathonId;
  }

  static from = (
    categories: Category[],
    hackathonId: Uuid,
  ): CategoryListResponse =>
    new CategoryListResponse(
      CategoryPreviewResponse.fromArray(categories),
      hackathonId,
    );
}

export default CategoryListResponse;
