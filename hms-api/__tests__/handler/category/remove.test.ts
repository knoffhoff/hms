import * as categoryService from '../../../src/service/category-service';
import {remove} from '../../../src/handler/category/remove';
import CategoryDeleteResponse from '../../../src/rest/category/CategoryDeleteResponse';
import Uuid, {uuid} from '../../../src/util/Uuid';
import DeletionError from '../../../src/error/DeletionError';

const mockRemoveCategory = jest
  .spyOn(categoryService, 'removeCategory')
  .mockImplementation();

describe('Delete Category', () => {
  test('Happy Path', async () => {
    const id = uuid();
    const event = toEvent(id);
    const callback = jest.fn();

    mockRemoveCategory.mockResolvedValueOnce(new CategoryDeleteResponse(id));

    await remove(event, null, callback);

    expect(mockRemoveCategory).toHaveBeenCalledWith(id);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new CategoryDeleteResponse(id)),
    });
  });

  test('Throws DeletionError', async () => {
    const errorMessage = 'deletion error message';
    const callback = jest.fn();

    mockRemoveCategory.mockImplementation(() => {
      throw new DeletionError(errorMessage);
    });

    await remove(toEvent(uuid()), null, callback);
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
    const callback = jest.fn();

    mockRemoveCategory.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await remove(toEvent(uuid()), null, callback);
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
