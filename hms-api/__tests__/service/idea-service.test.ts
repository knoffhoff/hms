import {mockPut, mockSend} from '../repository/dynamo-db-mock';
import {mockUuid} from '../util/uuids-mock';

import {createIdea} from '../../src/service/idea-service';
import {uuid} from '../../src/util/uuids';
import ReferenceNotFoundError
  from '../../src/repository/error/ReferenceNotFoundError';
import {randomIdea} from '../repository/domain/idea-maker';

import * as participantRepository
  from '../../src/repository/participant-repository';
import * as hackathonRepository
  from '../../src/repository/hackathon-repository';
import * as categoryRepository from '../../src/repository/category-repository';
import * as skillRepository from '../../src/repository/skill-repository';
import {mockDate} from '../util/date-mock';

const mockParticipantExists = jest.fn();
jest.spyOn(participantRepository, 'participantExists')
    .mockImplementation(mockParticipantExists);

const mockHackathonExists = jest.fn();
jest.spyOn(hackathonRepository, 'hackathonExists')
    .mockImplementation(mockHackathonExists);

const mockCategoryExists = jest.fn();
jest.spyOn(categoryRepository, 'categoryExists')
    .mockImplementation(mockCategoryExists);

const mockSkillExists = jest.fn();
jest.spyOn(skillRepository, 'skillExists')
    .mockImplementation(mockSkillExists);

describe('Create Idea', () => {
  test('Missing Participant', async () => {
    mockParticipantExists.mockResolvedValue(false);
    mockHackathonExists.mockResolvedValue(true);
    mockCategoryExists.mockResolvedValue(true);
    mockSkillExists.mockResolvedValue(true);

    await expect(createIdea(
        uuid(),
        uuid(),
        'title',
        'description',
        'problem',
        'goal',
        [uuid()],
        uuid()))
        .rejects
        .toThrow(ReferenceNotFoundError);
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('Missing Hackathon', async () => {
    mockParticipantExists.mockResolvedValue(true);
    mockHackathonExists.mockResolvedValue(false);
    mockCategoryExists.mockResolvedValue(true);
    mockSkillExists.mockResolvedValue(true);

    await expect(createIdea(
        uuid(),
        uuid(),
        'title',
        'description',
        'problem',
        'goal',
        [uuid()],
        uuid()))
        .rejects
        .toThrow(ReferenceNotFoundError);
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('Missing Category', async () => {
    mockParticipantExists.mockResolvedValue(true);
    mockHackathonExists.mockResolvedValue(true);
    mockCategoryExists.mockResolvedValue(false);
    mockSkillExists.mockResolvedValue(true);

    await expect(createIdea(
        uuid(),
        uuid(),
        'title',
        'description',
        'problem',
        'goal',
        [uuid()],
        uuid()))
        .rejects
        .toThrow(ReferenceNotFoundError);
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('Missing Skill', async () => {
    mockParticipantExists.mockResolvedValue(true);
    mockHackathonExists.mockResolvedValue(true);
    mockCategoryExists.mockResolvedValue(true);
    mockSkillExists.mockResolvedValue(false);

    await expect(createIdea(
        uuid(),
        uuid(),
        'title',
        'description',
        'problem',
        'goal',
        [uuid()],
        uuid()))
        .rejects
        .toThrow(ReferenceNotFoundError);
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('Happy Path', async () => {
    mockPut();
    mockDate();

    mockParticipantExists.mockResolvedValue(true);
    mockHackathonExists.mockResolvedValue(true);
    mockCategoryExists.mockResolvedValue(true);
    mockSkillExists.mockResolvedValue(true);

    const expected = randomIdea();
    mockUuid(expected.id);

    expect(await createIdea(
        expected.ownerId,
        expected.hackathonId,
        expected.title,
        expected.description,
        expected.problem,
        expected.goal,
        expected.requiredSkills,
        expected.categoryId,
    )).toStrictEqual(expected);
  });
});
