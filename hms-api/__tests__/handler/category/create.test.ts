import * as categoryService from '../../../src/service/category-service';
import {create} from '../../../src/handler/category/create';
import {randomCategory} from '../../repository/domain/category-maker';
import {mockUuid} from '../../util/uuids-mock';
import CategoryCreateResponse from '../../../src/rest/CategoryCreateResponse';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';
import Category from '../../../src/repository/domain/Category';

const mockCreateCategory = jest.fn();
jest.spyOn(categoryService, 'createCategory')
    .mockImplementation(mockCreateCategory);

describe('Create Category', () => {
  test('Happy Path', async () => {
    const expected = randomCategory();
    mockCreateCategory.mockResolvedValue(expected);
    const event = toEvent(expected);
    mockUuid(expected.id);
    const callback = jest.fn();

    await create(event, null, callback);

    expect(mockCreateCategory).toHaveBeenCalledWith(
        expected.title,
        expected.description,
        expected.hackathonId,
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new CategoryCreateResponse(expected.id)),
    });
  });

  test('Throws ReferenceNotFoundError', async () => {
    const errorMessage = 'reference error message';
    mockCreateCategory.mockImplementation(() => {
      throw new ReferenceNotFoundError(errorMessage);
    });
    const callback = jest.fn();

    await create(toEvent(randomCategory()), null, callback);
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
    mockCreateCategory.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const callback = jest.fn();

    await create(toEvent(randomCategory()), null, callback);
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

const toEvent = (category: Category): any => ({
  body: JSON.stringify({
    title: category.title,
    description: category.description,
    hackathonId: category.hackathonId,
  }),
});
