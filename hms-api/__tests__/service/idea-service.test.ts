import {mockUuid} from '../util/uuids-mock';
import {mockDate} from '../util/date-mock';

import {
  createIdea,
  getIdeaListResponse,
  getIdeaResponse,
  removeIdea,
} from '../../src/service/idea-service';
import {uuid} from '../../src/util/Uuid';
import ReferenceNotFoundError from '../../src/error/ReferenceNotFoundError';
import {randomIdea} from '../repository/domain/idea-maker';

import {randomHackathon} from '../repository/domain/hackathon-maker';
import {randomUser} from '../repository/domain/user-maker';
import {
  makeParticipant,
  ParticipantData,
  randomParticipant,
} from '../repository/domain/participant-maker';
import {randomCategory} from '../repository/domain/category-maker';
import IdeaResponse from '../../src/rest/IdeaResponse';
import {randomSkill} from '../repository/domain/skill-maker';
import * as participantRepository
  from '../../src/repository/participant-repository';
import * as hackathonRepository
  from '../../src/repository/hackathon-repository';
import * as categoryRepository from '../../src/repository/category-repository';
import * as skillRepository from '../../src/repository/skill-repository';
import * as userRepository from '../../src/repository/user-repository';
import * as ideaRepository from '../../src/repository/idea-repository';
import NotFoundError from '../../src/error/NotFoundError';
import IdeaListResponse from '../../src/rest/IdeaListResponse';

const mockPutIdea = jest.fn();
jest.spyOn(ideaRepository, 'putIdea')
    .mockImplementation(mockPutIdea);
const mockGetIdea = jest.fn();
jest.spyOn(ideaRepository, 'getIdea')
    .mockImplementation(mockGetIdea);
const mockListIdeas = jest.fn();
jest.spyOn(ideaRepository, 'listIdeas')
    .mockImplementation(mockListIdeas);
const mockDeleteIdea = jest.fn();
jest.spyOn(ideaRepository, 'deleteIdea')
    .mockImplementation(mockDeleteIdea);

const mockGetParticipant = jest.fn();
jest.spyOn(participantRepository, 'getParticipant')
    .mockImplementation(mockGetParticipant);
const mockGetParticipants = jest.fn();
jest.spyOn(participantRepository, 'getParticipants')
    .mockImplementation(mockGetParticipants);
const mockParticipantExists = jest.fn();
jest.spyOn(participantRepository, 'participantExists')
    .mockImplementation(mockParticipantExists);

const mockGetUser = jest.fn();
jest.spyOn(userRepository, 'getUser')
    .mockImplementation(mockGetUser);
const mockGetUsers = jest.fn();
jest.spyOn(userRepository, 'getUsers')
    .mockImplementation(mockGetUsers);

const mockGetHackathon = jest.fn();
jest.spyOn(hackathonRepository, 'getHackathon')
    .mockImplementation(mockGetHackathon);
const mockHackathonExists = jest.fn();
jest.spyOn(hackathonRepository, 'hackathonExists')
    .mockImplementation(mockHackathonExists);

const mockGetCategory = jest.fn();
jest.spyOn(categoryRepository, 'getCategory')
    .mockImplementation(mockGetCategory);
const mockCategoryExists = jest.fn();
jest.spyOn(categoryRepository, 'categoryExists')
    .mockImplementation(mockCategoryExists);

const mockGetSkills = jest.fn();
jest.spyOn(skillRepository, 'getSkills')
    .mockImplementation(mockGetSkills);
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

    expect(mockPutIdea).not.toHaveBeenCalled();
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

    expect(mockPutIdea).not.toHaveBeenCalled();
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

    expect(mockPutIdea).not.toHaveBeenCalled();
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

    expect(mockPutIdea).not.toHaveBeenCalled();
  });

  test('Happy Path', async () => {
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

    expect(mockPutIdea).toHaveBeenCalledWith(expected);
  });
});

describe('Get Idea Response', () => {
  test('Happy Path', async () => {
    const idea = randomIdea();
    const ownerUser = randomUser();
    const ownerParticipant = makeParticipant(
        {userId: ownerUser.id} as ParticipantData);
    const user = randomUser();
    const participant = makeParticipant({userId: user.id} as ParticipantData);
    const hackathon = randomHackathon();
    const skill1 = randomSkill();
    const skill2 = randomSkill();
    const skill3 = randomSkill();
    const category = randomCategory();

    const expected = IdeaResponse.from(
        idea,
        ownerParticipant,
        ownerUser,
        hackathon,
        [ownerParticipant, participant],
        [ownerUser, user],
        [skill1, skill2, skill3],
        category,
    );

    mockGetIdea.mockResolvedValue(idea);
    mockGetParticipant.mockResolvedValue(ownerParticipant);
    mockGetUser.mockResolvedValue(ownerUser);
    mockGetParticipants.mockResolvedValue([ownerParticipant, participant]);
    mockGetUsers.mockResolvedValue([ownerUser, user]);
    mockGetHackathon.mockResolvedValue(hackathon);
    mockGetSkills.mockResolvedValue([skill1, skill2, skill3]);
    mockGetCategory.mockResolvedValue(category);

    expect(await getIdeaResponse(idea.id)).toStrictEqual(expected);
    expect(mockGetIdea).toHaveBeenCalledWith(idea.id);
    expect(mockGetParticipant).toHaveBeenCalledWith(idea.ownerId);
    expect(mockGetUser).toHaveBeenCalledWith(ownerParticipant.userId);
    expect(mockGetParticipants).toHaveBeenCalledWith(idea.participantIds);
    expect(mockGetUsers).toHaveBeenCalledWith([ownerUser.id, user.id]);
    expect(mockGetHackathon).toHaveBeenCalledWith(idea.hackathonId);
    expect(mockGetSkills).toHaveBeenCalledWith(idea.requiredSkills);
    expect(mockGetCategory).toHaveBeenCalledWith(idea.categoryId);
  });

  test('Missing Category', async () => {
    const idea = randomIdea();
    const ownerUser = randomUser();
    const ownerParticipant = makeParticipant(
        {userId: ownerUser.id} as ParticipantData);
    const user = randomUser();
    const participant = makeParticipant({userId: user.id} as ParticipantData);
    const hackathon = randomHackathon();
    const skill1 = randomSkill();
    const skill2 = randomSkill();
    const skill3 = randomSkill();

    mockGetIdea.mockResolvedValue(idea);
    mockGetParticipant.mockResolvedValue(ownerParticipant);
    mockGetUser.mockResolvedValue(ownerUser);
    mockGetParticipants.mockResolvedValue([ownerParticipant, participant]);
    mockGetUsers.mockResolvedValue([ownerUser, user]);
    mockGetHackathon.mockResolvedValue(hackathon);
    mockGetSkills.mockResolvedValue([skill1, skill2, skill3]);
    mockGetCategory.mockImplementation(() => {
      throw new NotFoundError('That thing is missing');
    });

    await expect(getIdeaResponse(idea.id))
        .rejects
        .toThrow(ReferenceNotFoundError);
    expect(mockGetIdea).toHaveBeenCalledWith(idea.id);
    expect(mockGetParticipant).toHaveBeenCalledWith(idea.ownerId);
    expect(mockGetUser).toHaveBeenCalledWith(ownerParticipant.userId);
    expect(mockGetParticipants).toHaveBeenCalledWith(idea.participantIds);
    expect(mockGetUsers).toHaveBeenCalledWith([ownerUser.id, user.id]);
    expect(mockGetHackathon).toHaveBeenCalledWith(idea.hackathonId);
    expect(mockGetSkills).toHaveBeenCalledWith(idea.requiredSkills);
    expect(mockGetCategory).toHaveBeenCalledWith(idea.categoryId);
  });

  test('Missing Skills', async () => {
    const idea = randomIdea();
    const ownerUser = randomUser();
    const ownerParticipant = makeParticipant(
        {userId: ownerUser.id} as ParticipantData);
    const user = randomUser();
    const participant = makeParticipant({userId: user.id} as ParticipantData);
    const hackathon = randomHackathon();

    mockGetIdea.mockResolvedValue(idea);
    mockGetParticipant.mockResolvedValue(ownerParticipant);
    mockGetUser.mockResolvedValue(ownerUser);
    mockGetParticipants.mockResolvedValue([ownerParticipant, participant]);
    mockGetUsers.mockResolvedValue([ownerUser, user]);
    mockGetHackathon.mockResolvedValue(hackathon);
    mockGetSkills.mockImplementation(() => {
      throw new NotFoundError('That thing is missing');
    });

    await expect(getIdeaResponse(idea.id))
        .rejects
        .toThrow(ReferenceNotFoundError);
    expect(mockGetIdea).toHaveBeenCalledWith(idea.id);
    expect(mockGetParticipant).toHaveBeenCalledWith(idea.ownerId);
    expect(mockGetUser).toHaveBeenCalledWith(ownerParticipant.userId);
    expect(mockGetParticipants).toHaveBeenCalledWith(idea.participantIds);
    expect(mockGetUsers).toHaveBeenCalledWith([ownerUser.id, user.id]);
    expect(mockGetHackathon).toHaveBeenCalledWith(idea.hackathonId);
    expect(mockGetSkills).toHaveBeenCalledWith(idea.requiredSkills);
    expect(mockGetCategory).not.toHaveBeenCalled();
  });

  test('Missing Hackathon', async () => {
    const idea = randomIdea();
    const ownerUser = randomUser();
    const ownerParticipant = makeParticipant(
        {userId: ownerUser.id} as ParticipantData);
    const user = randomUser();
    const participant = makeParticipant({userId: user.id} as ParticipantData);

    mockGetIdea.mockResolvedValue(idea);
    mockGetParticipant.mockResolvedValue(ownerParticipant);
    mockGetUser.mockResolvedValue(ownerUser);
    mockGetParticipants.mockResolvedValue([ownerParticipant, participant]);
    mockGetUsers.mockResolvedValue([ownerUser, user]);
    mockGetHackathon.mockImplementation(() => {
      throw new NotFoundError('That thing is missing');
    });

    await expect(getIdeaResponse(idea.id))
        .rejects
        .toThrow(ReferenceNotFoundError);
    expect(mockGetIdea).toHaveBeenCalledWith(idea.id);
    expect(mockGetParticipant).toHaveBeenCalledWith(idea.ownerId);
    expect(mockGetUser).toHaveBeenCalledWith(ownerParticipant.userId);
    expect(mockGetParticipants).toHaveBeenCalledWith(idea.participantIds);
    expect(mockGetUsers).toHaveBeenCalledWith([ownerUser.id, user.id]);
    expect(mockGetHackathon).toHaveBeenCalledWith(idea.hackathonId);
    expect(mockGetSkills).not.toHaveBeenCalled();
    expect(mockGetCategory).not.toHaveBeenCalled();
  });

  test('Missing Users', async () => {
    const idea = randomIdea();
    const ownerUser = randomUser();
    const ownerParticipant = makeParticipant(
        {userId: ownerUser.id} as ParticipantData);
    const user = randomUser();
    const participant = makeParticipant({userId: user.id} as ParticipantData);

    mockGetIdea.mockResolvedValue(idea);
    mockGetParticipant.mockResolvedValue(ownerParticipant);
    mockGetUser.mockResolvedValue(ownerUser);
    mockGetParticipants.mockResolvedValue([ownerParticipant, participant]);
    mockGetUsers.mockImplementation(() => {
      throw new NotFoundError('That thing is missing');
    });

    await expect(getIdeaResponse(idea.id))
        .rejects
        .toThrow(ReferenceNotFoundError);
    expect(mockGetIdea).toHaveBeenCalledWith(idea.id);
    expect(mockGetParticipant).toHaveBeenCalledWith(idea.ownerId);
    expect(mockGetUser).toHaveBeenCalledWith(ownerParticipant.userId);
    expect(mockGetParticipants).toHaveBeenCalledWith(idea.participantIds);
    expect(mockGetUsers).toHaveBeenCalledWith([ownerUser.id, user.id]);
    expect(mockGetHackathon).not.toHaveBeenCalled();
    expect(mockGetSkills).not.toHaveBeenCalled();
    expect(mockGetCategory).not.toHaveBeenCalled();
  });

  test('Missing Participants', async () => {
    const idea = randomIdea();
    const ownerUser = randomUser();
    const ownerParticipant = makeParticipant(
        {userId: ownerUser.id} as ParticipantData);

    mockGetIdea.mockResolvedValue(idea);
    mockGetParticipant.mockResolvedValue(ownerParticipant);
    mockGetUser.mockResolvedValue(ownerUser);
    mockGetParticipants.mockImplementation(() => {
      throw new NotFoundError('That thing is missing');
    });

    await expect(getIdeaResponse(idea.id))
        .rejects
        .toThrow(ReferenceNotFoundError);
    expect(mockGetIdea).toHaveBeenCalledWith(idea.id);
    expect(mockGetParticipant).toHaveBeenCalledWith(idea.ownerId);
    expect(mockGetUser).toHaveBeenCalledWith(ownerParticipant.userId);
    expect(mockGetParticipants).toHaveBeenCalledWith(idea.participantIds);
    expect(mockGetUsers).not.toHaveBeenCalled();
    expect(mockGetHackathon).not.toHaveBeenCalled();
    expect(mockGetSkills).not.toHaveBeenCalled();
    expect(mockGetCategory).not.toHaveBeenCalled();
  });

  test('Missing Owner User', async () => {
    const idea = randomIdea();
    const ownerParticipant = randomParticipant();

    mockGetIdea.mockResolvedValue(idea);
    mockGetParticipant.mockResolvedValue(ownerParticipant);
    mockGetUser.mockImplementation(() => {
      throw new NotFoundError('That thing is missing');
    });

    await expect(getIdeaResponse(idea.id))
        .rejects
        .toThrow(ReferenceNotFoundError);
    expect(mockGetIdea).toHaveBeenCalledWith(idea.id);
    expect(mockGetParticipant).toHaveBeenCalledWith(idea.ownerId);
    expect(mockGetUser).toHaveBeenCalledWith(ownerParticipant.userId);
    expect(mockGetParticipants).not.toHaveBeenCalled();
    expect(mockGetUsers).not.toHaveBeenCalled();
    expect(mockGetHackathon).not.toHaveBeenCalled();
    expect(mockGetSkills).not.toHaveBeenCalled();
    expect(mockGetCategory).not.toHaveBeenCalled();
  });

  test('Missing Owner Participant', async () => {
    const idea = randomIdea();

    mockGetIdea.mockResolvedValue(idea);
    mockGetParticipant.mockImplementation(() => {
      throw new NotFoundError('That thing is missing');
    });

    await expect(getIdeaResponse(idea.id))
        .rejects
        .toThrow(ReferenceNotFoundError);
    expect(mockGetIdea).toHaveBeenCalledWith(idea.id);
    expect(mockGetParticipant).toHaveBeenCalledWith(idea.ownerId);
    expect(mockGetUser).not.toHaveBeenCalled();
    expect(mockGetParticipants).not.toHaveBeenCalled();
    expect(mockGetUsers).not.toHaveBeenCalled();
    expect(mockGetHackathon).not.toHaveBeenCalled();
    expect(mockGetSkills).not.toHaveBeenCalled();
    expect(mockGetCategory).not.toHaveBeenCalled();
  });

  test('Missing Idea', async () => {
    const id = uuid();
    mockGetIdea.mockImplementation(() => {
      throw new NotFoundError('That thing is missing');
    });

    await expect(getIdeaResponse(id))
        .rejects
        .toThrow(NotFoundError);
    expect(mockGetIdea).toHaveBeenCalledWith(id);
    expect(mockGetParticipant).not.toHaveBeenCalled();
    expect(mockGetUser).not.toHaveBeenCalled();
    expect(mockGetParticipants).not.toHaveBeenCalled();
    expect(mockGetUsers).not.toHaveBeenCalled();
    expect(mockGetHackathon).not.toHaveBeenCalled();
    expect(mockGetSkills).not.toHaveBeenCalled();
    expect(mockGetCategory).not.toHaveBeenCalled();
  });
});

describe('Get Idea List Response', () => {
  test('Happy Path', async () => {
    const hackathonId = uuid();
    const idea1 = randomIdea();
    const idea2 = randomIdea();
    const idea3 = randomIdea();
    const expected = IdeaListResponse.from(
        [idea1, idea2, idea3],
        hackathonId);

    mockListIdeas.mockResolvedValue([idea1, idea2, idea3]);

    expect(await getIdeaListResponse(hackathonId)).toStrictEqual(expected);
    expect(mockListIdeas).toHaveBeenCalledWith(hackathonId);
  });
});

describe('Delete Idea', () => {
  test('Happy Path', async () => {
    const id = uuid();
    await removeIdea(id);
    expect(mockDeleteIdea).toHaveBeenCalledWith(id);
  });
});
