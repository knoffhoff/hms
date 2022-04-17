import {randomUser} from '../../repository/domain/user-maker';
import {get} from '../../../src/handler/user/get';
import NotFoundError from '../../../src/error/NotFoundError';
import * as userService from '../../../src/service/user-service';
import Uuid, {uuid} from '../../../src/util/Uuid';
import UserResponse from '../../../src/rest/UserResponse';
import {mapRolesToStrings} from '../../../src/repository/domain/Role';
import {randomSkill} from '../../repository/domain/skill-maker';
import SkillPreviewResponse from '../../../src/rest/SkillPreviewResponse';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';

const mockGetUser = jest.fn();
jest.spyOn(userService, 'getUserResponse')
    .mockImplementation((mockGetUser));

describe('Get User', () => {
  test('Happy Path', async () => {
    const user = randomUser();
    const skill1 = randomSkill();
    const skill2 = randomSkill();
    const expected = new UserResponse(
        user.id,
        user.lastName,
        user.firstName,
        user.emailAddress,
        mapRolesToStrings(user.roles),
        [
          new SkillPreviewResponse(skill1.id, skill1.name),
          new SkillPreviewResponse(skill2.id, skill2.name),
        ],
        user.imageUrl,
        user.creationDate,
    );

    mockGetUser.mockResolvedValue(expected);
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

const toEvent = (id: Uuid): any => ({
  pathParameters: {
    id: id,
  },
});
