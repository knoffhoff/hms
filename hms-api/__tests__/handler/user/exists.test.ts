import {exists} from '../../../src/handler/user/exists';
import * as userService from '../../../src/service/user-service';
import UserExistsResponse from '../../../src/rest/user/UserExistsResponse';
import {uuid} from '../../../src/util/Uuid';
import NotFoundError from '../../../src/error/NotFoundError';

const mockGetUserExistsResponse = jest
  .spyOn(userService, 'getUserExistsResponse')
  .mockImplementation();

describe('User Exists', () => {
  test('Happy Path', async () => {
    const id = uuid();
    const email = 'lame@ema.il';
    const expected = UserExistsResponse.from(id, email, true);
    const event = toEvent(email);
    const callback = jest.fn();

    mockGetUserExistsResponse.mockResolvedValueOnce(expected);

    await exists(event, null, callback);

    expect(mockGetUserExistsResponse).toHaveBeenCalledWith(email);
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
    const errorMessage = 'generic error message';
    const callback = jest.fn();

    mockGetUserExistsResponse.mockImplementation(() => {
      throw new NotFoundError(errorMessage);
    });

    await exists(toEvent('fake@ema.il'), null, callback);

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

    mockGetUserExistsResponse.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await exists(toEvent('fake@ema.il'), null, callback);

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

const toEvent = (email: string): object => ({
  pathParameters: {
    email: email,
  },
});
