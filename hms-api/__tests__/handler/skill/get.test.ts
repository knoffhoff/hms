import {randomSkill} from '../../repository/domain/skill-maker';
import {get} from '../../../src/handler/skill/get';
import NotFoundError from '../../../src/error/NotFoundError';
import * as skillService from '../../../src/service/skill-service';
import Uuid, {uuid} from '../../../src/util/Uuid';
import SkillResponse from '../../../src/rest/SkillResponse';

const mockGetSkill = jest.fn();
jest.spyOn(skillService, 'getSkillResponse')
    .mockImplementation((mockGetSkill));

describe('Get Skill', () => {
  test('Happy Path', async () => {
    const skill = randomSkill();
    const expected = SkillResponse.from(skill);

    mockGetSkill.mockResolvedValue(expected);
    const event = toEvent(skill.id);
    const callback = jest.fn();

    await get(event, null, callback);

    expect(mockGetSkill).toHaveBeenCalledWith(skill.id);
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
    mockGetSkill.mockImplementation(() => {
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

  test('Throws Error', async () => {
    const errorMessage = 'generic error message';
    mockGetSkill.mockImplementation(() => {
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
