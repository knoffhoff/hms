import {randomCategory} from '../../repository/domain/category-maker';
import {get} from '../../../src/handler/category/get';
import NotFoundError from '../../../src/error/NotFoundError';
import * as categoryService from '../../../src/service/category-service';
import Uuid, {uuid} from '../../../src/util/Uuid';
import {randomHackathon} from '../../repository/domain/hackathon-maker';
import CategoryResponse from '../../../src/rest/CategoryResponse';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';

const mockGetCategory = jest.fn();
jest.spyOn(categoryService, 'getCategoryResponse')
    .mockImplementation((mockGetCategory));

describe('Get Category', () => {
  test('Happy Path', async () => {
    const category = randomCategory();
    const expected = CategoryResponse.from(category, randomHackathon());

    mockGetCategory.mockResolvedValue(expected);
    const event = toEvent(category.id);
    const callback = jest.fn();

    await get(event, null, callback);

    expect(mockGetCategory).toHaveBeenCalledWith(category.id);
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
    mockGetCategory.mockImplementation(() => {
      throw new NotFoundError(errorMessage);
    });
    const callback = jest.fn();

    await get(toEvent(uuid()), null, callback);
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

  test('Throws ReferenceNotFoundError', async () => {
    const errorMessage = 'reference error message';
    mockGetCategory.mockImplementation(() => {
      throw new ReferenceNotFoundError(errorMessage);
    });
    const callback = jest.fn();

    await get(toEvent(uuid()), null, callback);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 400,
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
    mockGetCategory.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const callback = jest.fn();

    await get(toEvent(uuid()), null, callback);
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

const toEvent = (id: Uuid): any => ({
  pathParameters: {
    id: id,
  },
});
