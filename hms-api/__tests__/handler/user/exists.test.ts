import {exists} from '../../../src/handler/user/exists';
import * as userService from '../../../src/service/user-service';
import UserExistsResponse from '../../../src/rest/user/UserExistsResponse';
import {uuid} from '../../../src/util/Uuid';

const mockGetUserExistsResponse = jest
  .spyOn(userService, 'getUserExistsResponse')
  .mockImplementation();

describe('User Exists', () => {
  test('Happy Path', async () => {
    const id = uuid();
    const email = 'lame@ema.il';
    const expected = UserExistsResponse.from(id, email, true);

    mockGetUserExistsResponse.mockResolvedValueOnce(expected);
    const event = toEvent(email);
    const callback = jest.fn();

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

  test('Throws Error', async () => {
    const errorMessage = 'generic error message';
    mockGetUserExistsResponse.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const callback = jest.fn();

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
