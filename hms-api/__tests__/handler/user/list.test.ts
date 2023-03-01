import {randomUser} from '../../repository/domain/user-maker';
import {list} from '../../../src/handler/user/list';
import NotFoundError from '../../../src/error/NotFoundError';
import UserListResponse from '../../../src/rest/user/UserListResponse';
import * as userService from '../../../src/service/user-service';

const mockGetUserListResponse = jest
  .spyOn(userService, 'getUserListResponse')
  .mockImplementation();

describe('List Users', () => {
  test('Happy Path', async () => {
    const user1 = randomUser();
    const user2 = randomUser();
    const user3 = randomUser();
    const user4 = randomUser();
    const expected = UserListResponse.from([user1, user2, user3, user4]);
    const callback = jest.fn();

    mockGetUserListResponse.mockResolvedValueOnce(expected);

    await list({}, null, callback);

    expect(mockGetUserListResponse).toHaveBeenCalled();
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

    mockGetUserListResponse.mockImplementation(() => {
      throw new NotFoundError(errorMessage);
    });

    await list({}, null, callback);

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

    mockGetUserListResponse.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await list({}, null, callback);

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
