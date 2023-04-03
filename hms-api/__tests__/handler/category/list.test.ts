import {randomCategory} from '../../repository/domain/category-maker';
import {list} from '../../../src/handler/category/list';
import Uuid, {uuid} from '../../../src/util/Uuid';
import NotFoundError from '../../../src/error/NotFoundError';
import CategoryListResponse from '../../../src/rest/category/CategoryListResponse';
import * as categoryService from '../../../src/service/category-service';

const mockGetCategoryListResponse = jest
  .spyOn(categoryService, 'getCategoryListResponse')
  .mockImplementation();

describe('List Categories', () => {
  test('Happy Path', async () => {
    const hackathonId = uuid();
    const category1 = randomCategory();
    const category2 = randomCategory();
    const category3 = randomCategory();
    const category4 = randomCategory();
    const expected = CategoryListResponse.from(
      [category1, category2, category3, category4],
      hackathonId,
    );
    const callback = jest.fn();

    mockGetCategoryListResponse.mockResolvedValueOnce(expected);

    await list(toEvent(hackathonId), null, callback);

    expect(mockGetCategoryListResponse).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(expected),
    });
  });

  test('Throws NotFoundError', async () => {
    const errorMessage = 'reference error message';
    const callback = jest.fn();

    mockGetCategoryListResponse.mockImplementation(() => {
      throw new NotFoundError(errorMessage);
    });

    await list(toEvent(uuid()), null, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({errorMessage: errorMessage}),
    });
  });

  test('Throws Error', async () => {
    const errorMessage = 'generic error message';
    const callback = jest.fn();

    mockGetCategoryListResponse.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await list(toEvent(uuid()), null, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({errorMessage: errorMessage}),
    });
  });
});

const toEvent = (id: Uuid): object => ({
  pathParameters: {
    id: id,
  },
});
