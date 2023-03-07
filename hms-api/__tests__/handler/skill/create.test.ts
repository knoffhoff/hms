import * as skillService from '../../../src/service/skill-service';
import {create} from '../../../src/handler/skill/create';
import {randomSkill} from '../../repository/domain/skill-maker';
import SkillCreateResponse from '../../../src/rest/skill/SkillCreateResponse';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';
import Skill from '../../../src/repository/domain/Skill';
import SkillCreateRequest from '../../../src/rest/skill/SkillCreateRequest';

const mockCreateSkill = jest
  .spyOn(skillService, 'createSkill')
  .mockImplementation();

describe('Create Skill', () => {
  test('Happy Path', async () => {
    const expected = randomSkill();
    mockCreateSkill.mockResolvedValueOnce(expected);
    const callback = jest.fn();

    await create(toEvent(expected), null, callback);

    expect(mockCreateSkill).toHaveBeenCalledWith(
      expected.name,
      expected.description,
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new SkillCreateResponse(expected.id)),
    });
  });

  test('Throws ReferenceNotFoundError', async () => {
    const errorMessage = 'reference error message';
    mockCreateSkill.mockImplementation(() => {
      throw new ReferenceNotFoundError(errorMessage);
    });
    const callback = jest.fn();

    await create(toEvent(randomSkill()), null, callback);
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
    mockCreateSkill.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const callback = jest.fn();

    await create(toEvent(randomSkill()), null, callback);
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

const toEvent = (skill: Skill): object => ({
  body: JSON.stringify(new SkillCreateRequest(skill.name, skill.description)),
});
