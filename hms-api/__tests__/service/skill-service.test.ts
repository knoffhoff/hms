import {mockUuid} from '../util/uuids-mock';
import {randomSkill} from '../repository/domain/skill-maker';
import {
  createSkill,
  getSkillListResponse,
  getSkillResponse,
  removeSkill,
} from '../../src/service/skill-service';
import {uuid} from '../../src/util/Uuid';
import * as skillRepository from '../../src/repository/skill-repository';
import SkillResponse from '../../src/rest/SkillResponse';
import NotFoundError from '../../src/error/NotFoundError';
import SkillListResponse from '../../src/rest/SkillListResponse';
import SkillDeleteResponse from '../../src/rest/SkillDeleteResponse';

const mockPutSkill = jest.fn();
jest.spyOn(skillRepository, 'putSkill')
    .mockImplementation(mockPutSkill);
const mockGetSkill = jest.fn();
jest.spyOn(skillRepository, 'getSkill')
    .mockImplementation(mockGetSkill);
const mockListSkills = jest.fn();
jest.spyOn(skillRepository, 'listSkills')
    .mockImplementation(mockListSkills);
const mockDeleteSkill = jest.fn();
jest.spyOn(skillRepository, 'deleteSkill')
    .mockImplementation(mockDeleteSkill);

describe('Create Skill', () => {
  test('Happy Path', async () => {
    const expected = randomSkill();
    mockUuid(expected.id);

    expect(await createSkill(
        expected.name,
        expected.description,
    )).toStrictEqual(expected);

    expect(mockPutSkill).toHaveBeenCalledWith(expected);
  });
});

describe('Get Skill Response', () => {
  test('Happy Path', async () => {
    const skill = randomSkill();

    const expected = SkillResponse.from(skill);

    mockGetSkill.mockResolvedValue(skill);

    expect(await getSkillResponse(skill.id))
        .toStrictEqual(expected);
    expect(mockGetSkill).toHaveBeenCalledWith(skill.id);
  });

  test('Missing Skill', async () => {
    const id = uuid();

    mockGetSkill.mockImplementation(() => {
      throw new NotFoundError('Nope nope nope');
    });

    await expect(getSkillResponse(id))
        .rejects
        .toThrow(NotFoundError);
    expect(mockGetSkill).toHaveBeenCalledWith(id);
  });
});

describe('Get Skill List Response', () => {
  test('Happy Path', async () => {
    const skill1 = randomSkill();
    const skill2 = randomSkill();
    const skill3 = randomSkill();
    const expected = SkillListResponse.from(
        [skill1, skill2, skill3],
    );

    mockListSkills.mockResolvedValue([skill1, skill2, skill3]);

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
