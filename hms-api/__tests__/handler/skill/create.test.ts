import * as skillService from '../../../src/service/skill-service';
import {create} from '../../../src/handler/skill/create';
import {randomSkill} from '../../repository/domain/skill-maker';
import SkillCreateResponse from '../../../src/rest/SkillCreateResponse';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';
import Skill from '../../../src/repository/domain/Skill';

const mockCreateSkill = jest.fn();
jest.spyOn(skillService, 'createSkill')
    .mockImplementation(mockCreateSkill);

describe('Create Skill', () => {
  test('Happy Path', async () => {
    const expected = randomSkill();
    mockCreateSkill.mockResolvedValue(expected);
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

const toEvent = (skill: Skill): any => ({
  body: JSON.stringify({
    name: skill.name,
    description: skill.description,
  }),
});
