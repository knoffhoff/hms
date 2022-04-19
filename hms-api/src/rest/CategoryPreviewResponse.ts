/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';
import Category from '../repository/domain/Category';

class CategoryPreviewResponse {
  id: Uuid;
  title: string;

  constructor(
      id: Uuid,
      title: string,
  ) {
    this.id = id;
    this.title = title;
  }

  static from = (category: Category): CategoryPreviewResponse =>
    new CategoryPreviewResponse(
        category.id,
        category.title,
    );

  static fromArray(categories: Category[]): CategoryPreviewResponse[] {
    const previews: CategoryPreviewResponse[] = [];
    for (const category of categories) {
      previews.push(CategoryPreviewResponse.from(category));
    }
    return previews;
  }
}

export default CategoryPreviewResponse;
