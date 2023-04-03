/* eslint-disable require-jsdoc */

import Uuid from '../../util/Uuid'
import Category from '../../repository/domain/Category'

class CategoryPreviewResponse {
  id: Uuid
  title: string

  constructor(id: Uuid, title: string) {
    this.id = id
    this.title = title
  }

  static from = (category: Category): CategoryPreviewResponse =>
    new CategoryPreviewResponse(category.id, category.title)

  static fromArray(categories: Category[]): CategoryPreviewResponse[] {
    const previews: CategoryPreviewResponse[] = []
    for (const category of categories) {
      previews.push(CategoryPreviewResponse.from(category))
    }
    return previews.sort(this.compare)
  }

  static compare(
    a: CategoryPreviewResponse,
    b: CategoryPreviewResponse,
  ): number {
    const diff = a.title.localeCompare(b.title)
    if (diff) {
      return diff
    }

    return a.id.localeCompare(b.id)
  }
}

export default CategoryPreviewResponse
