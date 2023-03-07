import {randomSkill} from '../repository/domain/skill-maker';
import {
  createSkill,
  editSkill,
  getSkillListResponse,
  getSkillResponse,
  removeSkill,
} from '../../src/service/skill-service';
import {uuid} from '../../src/util/Uuid';
import Skill from '../../src/repository/domain/Skill';
import SkillResponse from '../../src/rest/skill/SkillResponse';
import NotFoundError from '../../src/error/NotFoundError';
import SkillListResponse from '../../src/rest/skill/SkillListResponse';
import SkillDeleteResponse from '../../src/rest/skill/SkillDeleteResponse';
import * as skillRepository from '../../src/repository/skill-repository';
import ValidationResult from '../../src/error/ValidationResult';
import {randomCategory} from '../repository/domain/category-maker';
import ValidationError from '../../src/error/ValidationError';

const mockPutSkill = jest.fn();
jest.spyOn(skillRepository, 'putSkill').mockImplementation(mockPutSkill);
const mockGetSkill = jest.fn();
jest.spyOn(skillRepository, 'getSkill').mockImplementation(mockGetSkill);
const mockListSkills = jest.fn();
jest.spyOn(skillRepository, 'listSkills').mockImplementation(mockListSkills);
const mockDeleteSkill = jest.fn();
jest.spyOn(skillRepository, 'deleteSkill').mockImplementation(mockDeleteSkill);

describe('Create Skill', () => {
  test('Happy Path', async () => {
    const expected = randomSkill();

    expect(await createSkill(expected.name, expected.description)).toEqual(
      expect.objectContaining({
        name: expected.name,
        description: expected.description,
      }),
    );

    expect(mockPutSkill).toHaveBeenCalledWith(
      expect.objectContaining({
        name: expected.name,
        description: expected.description,
      }),
    );
  });

  test('Validation Error', async () => {
    await expect(createSkill('', 'descriiiiption')).rejects.toThrow(
      ValidationError,
    );
  });
});

describe('Edit Skill', () => {
  test('Happy Path', async () => {
    const oldSkill = randomSkill();
    const title = 'Worst Skill Ever';
    const description = 'Best description ever!';
    const expected = new Skill(title, description, oldSkill.id);

    mockGetSkill.mockResolvedValueOnce(oldSkill);

    await editSkill(oldSkill.id, title, description);

    expect(mockPutSkill).toHaveBeenCalledWith(expected);
  });

  test('Validation Error', async () => {
    const failedValidation = new ValidationResult();
    failedValidation.addFailure('FAILURE');

    const mockSkill = randomCategory();
    jest.spyOn(mockSkill, 'validate').mockReturnValue(failedValidation);
    mockGetSkill.mockResolvedValueOnce(mockSkill);

    await expect(
      editSkill(uuid(), 'naaaaaaame', 'descriiiiption'),
    ).rejects.toThrow(ValidationError);
  });

  test('Skill is missing', async () => {
    const id = uuid();

    mockGetSkill.mockImplementation(() => {
      throw new Error('Uh oh');
    });

    await expect(
      editSkill(id, 'Anything', 'There once was a man from Nantucket...'),
    ).rejects.toThrow(NotFoundError);
    expect(mockPutSkill).not.toHaveBeenCalled();
    expect(mockGetSkill).toHaveBeenCalledWith(id);
  });
});

describe('Get Skill Response', () => {
  test('Happy Path', async () => {
    const skill = randomSkill();

    const expected = SkillResponse.from(skill);

    mockGetSkill.mockResolvedValueOnce(skill);

    expect(await getSkillResponse(skill.id)).toStrictEqual(expected);
    expect(mockGetSkill).toHaveBeenCalledWith(skill.id);
  });

  test('Missing Skill', async () => {
    const id = uuid();

    mockGetSkill.mockImplementation(() => {
      throw new NotFoundError('Nope nope nope');
    });

    await expect(getSkillResponse(id)).rejects.toThrow(NotFoundError);
    expect(mockGetSkill).toHaveBeenCalledWith(id);
  });
});

describe('Get Skill List Response', () => {
  test('Happy Path', async () => {
    const skill1 = randomSkill();
    const skill2 = randomSkill();
    const skill3 = randomSkill();
    const expected = SkillListResponse.from([skill1, skill2, skill3]);

    mockListSkills.mockResolvedValueOnce([skill1, skill2, skill3]);

    expect(await getSkillListResponse()).toStrictEqual(expected);
    expect(mockListSkills).toHaveBeenCalled();
  });
});

describe('Delete Skill', () => {
  test('Happy Path', async () => {
    const id = uuid();
    expect(await removeSkill(id)).toStrictEqual(new SkillDeleteResponse(id));
    expect(mockDeleteSkill).toHaveBeenCalledWith(id);
  });
});
