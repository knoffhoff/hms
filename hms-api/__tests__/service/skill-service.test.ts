import {mockUuid} from '../util/uuids-mock';
import {randomSkill} from '../repository/domain/skill-maker';
import {createSkill, removeSkill} from '../../src/service/skill-service';
import {uuid} from '../../src/util/Uuid';
import * as skillRepository from '../../src/repository/skill-repository';

const mockDeleteSkill = jest.fn();
jest.spyOn(skillRepository, 'deleteSkill')
    .mockImplementation(mockDeleteSkill);

const mockPutSkill = jest.fn();
jest.spyOn(skillRepository, 'putSkill')
    .mockImplementation(mockPutSkill);

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

describe('Delete Skill', () => {
  test('Happy Path', async () => {
    const id = uuid();
    await removeSkill(id);
    expect(mockDeleteSkill).toHaveBeenCalledWith(id);
  });
});
