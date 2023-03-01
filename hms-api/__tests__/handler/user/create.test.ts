import * as userService from '../../../src/service/user-service';
import {create} from '../../../src/handler/user/create';
import {randomUser} from '../../repository/domain/user-maker';
import UserCreateResponse from '../../../src/rest/user/UserCreateResponse';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';
import User from '../../../src/repository/domain/User';
import UserCreateRequest from '../../../src/rest/user/UserCreateRequest';
import ValidationError from '../../../src/error/ValidationError';
import ValidationResult from '../../../src/error/ValidationResult';

const mockCreateUser = jest
  .spyOn(userService, 'createUser')
  .mockImplementation();

describe('Create User', () => {
  test('Happy Path', async () => {
    const expected = randomUser();
    const event = toEvent(expected);
    const callback = jest.fn();

    mockCreateUser.mockResolvedValueOnce(expected);

    await create(event, null, callback);

    expect(mockCreateUser).toHaveBeenCalledWith(
      expected.lastName,
      expected.firstName,
      expected.emailAddress,
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

  test('Validation Error', async () => {
    const errorMessage = 'validation error message';
    const callback = jest.fn();

    mockCreateUser.mockRejectedValueOnce(
      new ValidationError(errorMessage, new ValidationResult()),
    );

    await create(toEvent(randomUser()), null, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 422,
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

    mockCreateUser.mockImplementation(() => {
      throw new Error(errorMessage);
    });

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

const toEvent = (user: User): object => ({
  body: JSON.stringify(
    new UserCreateRequest(
      user.lastName,
      user.firstName,
      user.emailAddress,
      user.skills,
      user.imageUrl,
    ),
  ),
});
