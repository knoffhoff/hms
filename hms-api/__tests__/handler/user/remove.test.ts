import * as userService from '../../../src/service/user-service';
import {remove} from '../../../src/handler/user/remove';
import UserDeleteResponse from '../../../src/rest/user/UserDeleteResponse';
import Uuid, {uuid} from '../../../src/util/Uuid';
import NotFoundError from '../../../src/error/NotFoundError';

const mockRemoveUser = jest
  .spyOn(userService, 'removeUser')
  .mockImplementation();

describe('Delete User', () => {
  test('Happy Path', async () => {
    const id = uuid();
    const event = toEvent(id);
    const callback = jest.fn();

    mockRemoveUser.mockResolvedValueOnce(new UserDeleteResponse(id));

    await remove(event, null, callback);

    expect(mockRemoveUser).toHaveBeenCalledWith(id);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new UserDeleteResponse(id)),
    });
  });

  test('Throws NotFoundError', async () => {
    const errorMessage = 'User not found';
    const callback = jest.fn();

    mockRemoveUser.mockImplementation(() => {
      throw new NotFoundError(errorMessage);
    });

    await remove(toEvent(uuid()), null, callback);

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

    mockRemoveUser.mockImplementation(() => {
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
