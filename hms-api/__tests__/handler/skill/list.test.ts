import {randomSkill} from '../../repository/domain/skill-maker';
import {list} from '../../../src/handler/skill/list';
import NotFoundError from '../../../src/error/NotFoundError';
import SkillListResponse from '../../../src/rest/skill/SkillListResponse';
import * as skillService from '../../../src/service/skill-service';

const mockGetSkillListResponse = jest
  .spyOn(skillService, 'getSkillListResponse')
  .mockImplementation();

describe('List Skills', () => {
  test('Happy Path', async () => {
    const skill1 = randomSkill();
    const skill2 = randomSkill();
    const skill3 = randomSkill();
    const skill4 = randomSkill();
    const expected = SkillListResponse.from([skill1, skill2, skill3, skill4]);

    mockGetSkillListResponse.mockResolvedValueOnce(expected);
    const callback = jest.fn();

    await list({}, null, callback);

    expect(mockGetSkillListResponse).toHaveBeenCalled();
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
    mockGetSkillListResponse.mockImplementation(() => {
      throw new NotFoundError(errorMessage);
    });
    const callback = jest.fn();

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
    mockGetSkillListResponse.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const callback = jest.fn();

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
