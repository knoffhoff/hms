import * as skillService from '../../../src/service/skill-service';
import {create} from '../../../src/handler/skill/create';
import {randomSkill} from '../../repository/domain/skill-maker';
import SkillCreateResponse from '../../../src/rest/skill/SkillCreateResponse';
import Skill from '../../../src/repository/domain/Skill';
import SkillCreateRequest from '../../../src/rest/skill/SkillCreateRequest';
import ValidationError from '../../../src/error/ValidationError';
import ValidationResult from '../../../src/error/ValidationResult';

const mockCreateSkill = jest
  .spyOn(skillService, 'createSkill')
  .mockImplementation();

describe('Create Skill', () => {
  test('Happy Path', async () => {
    const expected = randomSkill();
    const callback = jest.fn();

    mockCreateSkill.mockResolvedValueOnce(expected);

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

  test('Validation Error', async () => {
    const errorMessage = 'validation error message';
    const callback = jest.fn();

    mockCreateSkill.mockImplementation(() => {
      throw new ValidationError(errorMessage, new ValidationResult());
    });

    await create(toEvent(randomSkill()), null, callback);

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

    mockCreateSkill.mockImplementation(() => {
      throw new Error(errorMessage);
    });

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
