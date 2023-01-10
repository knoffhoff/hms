import CategoryListResponse from '../../src/rest/Category/CategoryListResponse';
import {CategoryData, makeCategory} from '../repository/domain/category-maker';
import {uuid} from '../../src/util/Uuid';
import CategoryPreviewResponse from '../../src/rest/Category/CategoryPreviewResponse';

describe('Convert From', () => {
  test('Categories are sorted', () => {
    const category1 = makeCategory({title: 'a'} as CategoryData);
    const category2 = makeCategory({title: 'b'} as CategoryData);
    const category3 = makeCategory({title: 'c'} as CategoryData);
    const hackathonId = uuid();

    const response = CategoryListResponse.from(
      [category3, category1, category2],
      hackathonId,
    );

    expect(response).toEqual(
      new CategoryListResponse(
        [
          CategoryPreviewResponse.from(category1),
          CategoryPreviewResponse.from(category2),
          CategoryPreviewResponse.from(category3),
        ],
        hackathonId,
      ),
    );
  });
});
