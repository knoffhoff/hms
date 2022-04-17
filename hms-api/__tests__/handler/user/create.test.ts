import * as userService from '../../../src/service/user-service';
import {create} from '../../../src/handler/user/create';
import {randomUser} from '../../repository/domain/user-maker';
import {mockUuid} from '../../util/uuids-mock';
import UserCreateResponse from '../../../src/rest/UserCreateResponse';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';
import User from '../../../src/repository/domain/User';

const mockCreateUser = jest.fn();
jest.spyOn(userService, 'createUser')
    .mockImplementation(mockCreateUser);

describe('Create User', () => {
  test('Happy Path', async () => {
    const expected = randomUser();
    mockCreateUser.mockResolvedValue(expected);
    const event = toEvent(expected);
    mockUuid(expected.id);
    const callback = jest.fn();

    await create(event, null, callback);

    expect(mockCreateUser).toHaveBeenCalledWith(
        expected.lastName,
        expected.firstName,
        expected.emailAddress,
        expected.roles,
        expected.skills,
        expected.imageUrl,
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new UserCreateResponse(expected.id)),
    });
  });

  test('Throws ReferenceNotFoundError', async () => {
    const errorMessage = 'reference error message';
    mockCreateUser.mockImplementation(() => {
      throw new ReferenceNotFoundError(errorMessage);
    });
    const callback = jest.fn();

    await create(toEvent(randomUser()), null, callback);
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
    mockCreateUser.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const callback = jest.fn();

    await create(toEvent(randomUser()), null, callback);
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

const toEvent = (user: User): any => ({
  body: JSON.stringify({
    lastName: user.lastName,
    firstName: user.firstName,
    emailAddress: user.emailAddress,
    roles: user.roles,
    skills: user.skills,
    imageUrl: user.imageUrl,
  }),
});
