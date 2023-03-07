import {randomUser} from '../../repository/domain/user-maker';
import {get} from '../../../src/handler/user/get';
import NotFoundError from '../../../src/error/NotFoundError';
import * as userService from '../../../src/service/user-service';
import Uuid, {uuid} from '../../../src/util/Uuid';
import UserResponse from '../../../src/rest/user/UserResponse';
import {randomSkill} from '../../repository/domain/skill-maker';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';

const mockGetUser = jest
  .spyOn(userService, 'getUserResponse')
  .mockImplementation();

describe('Get User', () => {
  test('Happy Path', async () => {
    const user = randomUser();
    const expected = UserResponse.from(user, [randomSkill(), randomSkill()]);

    mockGetUser.mockResolvedValueOnce(expected);
    const event = toEvent(user.id);
    const callback = jest.fn();

    await get(event, null, callback);

    expect(mockGetUser).toHaveBeenCalledWith(user.id);
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
    mockGetUser.mockImplementation(() => {
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
    mockGetUser.mockImplementation(() => {
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
    mockGetUser.mockImplementation(() => {
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

const toEvent = (id: Uuid): object => ({
  pathParameters: {
    id: id,
  },
});
