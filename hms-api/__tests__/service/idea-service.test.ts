import {
  createIdea,
  editIdea,
  getIdeaListResponse,
  getIdeaResponse,
  removeIdea,
  removeIdeasForCategory,
  removeIdeasForHackathon,
  removeIdeasForOwner,
  removeParticipantFromIdeas,
} from '../../src/service/idea-service';
import {uuid} from '../../src/util/Uuid';
import {randomIdea} from '../repository/domain/idea-maker';
import {randomHackathon} from '../repository/domain/hackathon-maker';

import {randomUser} from '../repository/domain/user-maker';
import {
  makeParticipant,
  ParticipantData,
  randomParticipant,
} from '../repository/domain/participant-maker';
import {randomCategory} from '../repository/domain/category-maker';
import {randomSkill} from '../repository/domain/skill-maker';
import IdeaResponse from '../../src/rest/IdeaResponse';
import NotFoundError from '../../src/error/NotFoundError';
import ReferenceNotFoundError from '../../src/error/ReferenceNotFoundError';
import IdeaListResponse from '../../src/rest/IdeaListResponse';
import DeletionError from '../../src/error/DeletionError';
import Idea from '../../src/repository/domain/Idea';
import * as participantRepository
  from '../../src/repository/participant-repository';
import * as hackathonRepository
  from '../../src/repository/hackathon-repository';
import * as categoryRepository from '../../src/repository/category-repository';
import * as skillRepository from '../../src/repository/skill-repository';
import * as userRepository from '../../src/repository/user-repository';
import * as ideaRepository from '../../src/repository/idea-repository';

const mockPutIdea = jest.fn();
jest.spyOn(ideaRepository, 'putIdea')
    .mockImplementation(mockPutIdea);
const mockGetIdea = jest.fn();
jest.spyOn(ideaRepository, 'getIdea')
    .mockImplementation(mockGetIdea);
const mockListIdeasForHackathon = jest.fn();
jest.spyOn(ideaRepository, 'listIdeasForHackathon')
    .mockImplementation(mockListIdeasForHackathon);
const mockListIdeasForOwner = jest.fn();
jest.spyOn(ideaRepository, 'listIdeasForOwner')
    .mockImplementation(mockListIdeasForOwner);
const mockListIdeasForCategory = jest.fn();
jest.spyOn(ideaRepository, 'listIdeasForCategory')
    .mockImplementation(mockListIdeasForCategory);
const mockListIdeasForParticipant = jest.fn();
jest.spyOn(ideaRepository, 'listIdeasForParticipant')
    .mockImplementation(mockListIdeasForParticipant);
const mockDeleteParticipantFromIdea = jest.fn();
jest.spyOn(ideaRepository, 'deleteParticipantFromIdea')
    .mockImplementation(mockDeleteParticipantFromIdea);
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
jest.spyOn(participantRepository, 'participantExistsForHackathon')
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
    expect(mockDeleteIdea).not.toHaveBeenCalled();
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
    expect(mockDeleteIdea).not.toHaveBeenCalled();
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
    expect(mockDeleteIdea).not.toHaveBeenCalled();
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
    expect(mockDeleteIdea).not.toHaveBeenCalled();
  });

  test('Happy Path', async () => {
    mockParticipantExists.mockResolvedValue(true);
    mockHackathonExists.mockResolvedValue(true);
    mockCategoryExists.mockResolvedValue(true);
    mockSkillExists.mockResolvedValue(true);

    const expected = randomIdea();

    expect(await createIdea(
        expected.ownerId,
        expected.hackathonId,
        expected.title,
        expected.description,
        expected.problem,
        expected.goal,
        expected.requiredSkills,
        expected.categoryId,
    )).toEqual(expect.objectContaining({
      ownerId: expected.ownerId,
      hackathonId: expected.hackathonId,
      title: expected.title,
      description: expected.description,
      problem: expected.problem,
      goal: expected.goal,
      requiredSkills: expected.requiredSkills,
      categoryId: expected.categoryId,
    }));

    expect(mockPutIdea).toHaveBeenCalledWith(expect.objectContaining({
      ownerId: expected.ownerId,
      hackathonId: expected.hackathonId,
      title: expected.title,
      description: expected.description,
      problem: expected.problem,
      goal: expected.goal,
      requiredSkills: expected.requiredSkills,
      categoryId: expected.categoryId,
    }));
  });
});

describe('Edit Idea', () => {
  test('Happy Path', async () => {
    const oldIdea = randomIdea();
    const title = 'Worst Idea Ever';
    const description = 'Best description ever!';
    const problem = 'A simple problem';
    const goal = 'An overly complicated goal';
    const requiredSkills = [uuid(), uuid()];
    const categoryId = uuid();
    const expected = new Idea(
        oldIdea.ownerId,
        oldIdea.hackathonId,
        title,
        description,
        problem,
        goal,
        requiredSkills,
        categoryId,
        oldIdea.id,
        oldIdea.creationDate,
        oldIdea.participantIds);

    mockGetIdea.mockResolvedValue(oldIdea);
    mockCategoryExists.mockResolvedValue(true);
    mockSkillExists.mockResolvedValue(true);

    await editIdea(
        oldIdea.id,
        title,
        description,
        problem,
        goal,
        requiredSkills,
        categoryId);

    expect(mockGetIdea).toHaveBeenCalledWith(oldIdea.id);
    expect(mockCategoryExists)
        .toHaveBeenCalledWith(categoryId, oldIdea.hackathonId);
    expect(mockSkillExists).toHaveBeenCalledWith(requiredSkills[0]);
    expect(mockSkillExists).toHaveBeenCalledWith(requiredSkills[1]);
    expect(mockPutIdea).toHaveBeenCalledWith(expected);
  });

  test('Idea is missing', async () => {
    const id = uuid();

    mockGetIdea.mockImplementation(() => {
      throw new Error('Uh oh');
    });
    mockCategoryExists.mockResolvedValue(true);
    mockSkillExists.mockResolvedValue(true);

    await expect(editIdea(
        id,
        'Anything',
        'Super excellent Idea',
        'Praw-blem',
        'Go-well',
        [uuid(), uuid()],
        uuid()))
        .rejects
        .toThrow(NotFoundError);
    expect(mockGetIdea).toHaveBeenCalledWith(id);
    expect(mockCategoryExists).not.toHaveBeenCalled();
    expect(mockSkillExists).not.toHaveBeenCalled();
    expect(mockPutIdea).not.toHaveBeenCalled();
  });

  test('Category is missing', async () => {
    const id = uuid();

    const oldIdea = randomIdea();
    mockGetIdea.mockResolvedValue(oldIdea);
    mockCategoryExists.mockResolvedValue(false);
    mockSkillExists.mockResolvedValue(true);

    const categoryId = uuid();
    await expect(editIdea(
        id,
        'Anything',
        'Super excellent Idea',
        'Praw-blem',
        'Go-well',
        [uuid(), uuid()],
        categoryId))
        .rejects
        .toThrow(ReferenceNotFoundError);
    expect(mockGetIdea).toHaveBeenCalledWith(id);
    expect(mockCategoryExists)
        .toHaveBeenCalledWith(categoryId, oldIdea.hackathonId);
    expect(mockSkillExists).not.toHaveBeenCalled();
    expect(mockPutIdea).not.toHaveBeenCalled();
  });

  test('Skills are missing', async () => {
    const id = uuid();

    const oldIdea = randomIdea();
    mockGetIdea.mockResolvedValue(oldIdea);
    mockCategoryExists.mockResolvedValue(true);
    mockSkillExists.mockResolvedValue(false);

    const categoryId = uuid();
    const skillId1 = uuid();
    await expect(editIdea(
        id,
        'Anything',
        'Super excellent Idea',
        'Praw-blem',
        'Go-well',
        [skillId1, uuid()],
        categoryId))
        .rejects
        .toThrow(ReferenceNotFoundError);
    expect(mockGetIdea).toHaveBeenCalledWith(id);
    expect(mockCategoryExists)
        .toHaveBeenCalledWith(categoryId, oldIdea.hackathonId);
    expect(mockSkillExists).toHaveBeenCalledWith(skillId1);
    expect(mockPutIdea).not.toHaveBeenCalled();
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

    mockHackathonExists.mockResolvedValue(true);
    mockListIdeasForHackathon.mockResolvedValue([idea1, idea2, idea3]);

    expect(await getIdeaListResponse(hackathonId)).toStrictEqual(expected);
    expect(mockHackathonExists).toHaveBeenCalledWith(hackathonId);
    expect(mockListIdeasForHackathon).toHaveBeenCalledWith(hackathonId);
  });

  test('Hackathon Missing', async () => {
    const hackathonId = uuid();

    mockHackathonExists.mockResolvedValue(false);
    mockListIdeasForHackathon.mockResolvedValue([
      randomIdea(),
      randomIdea(),
      randomIdea(),
    ]);

    await expect(getIdeaListResponse(hackathonId))
        .rejects
        .toThrow(NotFoundError);
    expect(mockHackathonExists).toHaveBeenCalledWith(hackathonId);
    expect(mockListIdeasForHackathon).not.toHaveBeenCalledWith();
  });
});

describe('Delete Idea', () => {
  test('Happy Path', async () => {
    const id = uuid();
    await removeIdea(id);
    expect(mockDeleteIdea).toHaveBeenCalledWith(id);
  });
});

describe('Remove Ideas for Category', () => {
  test('Happy Path', async () => {
    const categoryId = uuid();
    const idea1 = randomIdea();
    const idea2 = randomIdea();
    mockListIdeasForCategory.mockResolvedValue([idea1, idea2]);
    mockDeleteIdea.mockImplementation(() => {
    });

    await removeIdeasForCategory(categoryId);
    expect(mockDeleteIdea).toHaveBeenCalledWith(idea1.id);
    expect(mockDeleteIdea).toHaveBeenCalledWith(idea2.id);
  });

  test('Fails on first delete', async () => {
    const categoryId = uuid();
    const idea1 = randomIdea();
    const idea2 = randomIdea();
    mockListIdeasForCategory.mockResolvedValue([idea1, idea2]);
    mockDeleteIdea.mockImplementation(() => {
      throw new DeletionError('Well this stinks');
    });

    await expect(removeIdeasForCategory(categoryId))
        .rejects
        .toThrow(DeletionError);
    expect(mockDeleteIdea).toHaveBeenCalledWith(idea1.id);
  });
});

describe('Remove Ideas for Hackathon', () => {
  test('Happy Path', async () => {
    const hackathonId = uuid();
    const idea1 = randomIdea();
    const idea2 = randomIdea();
    mockListIdeasForHackathon.mockResolvedValue([idea1, idea2]);
    mockDeleteIdea.mockImplementation(() => {
    });

    await removeIdeasForHackathon(hackathonId);
    expect(mockDeleteIdea).toHaveBeenCalledWith(idea1.id);
    expect(mockDeleteIdea).toHaveBeenCalledWith(idea2.id);
  });

  test('Fails on first delete', async () => {
    const hackathonId = uuid();
    const idea1 = randomIdea();
    const idea2 = randomIdea();
    mockListIdeasForHackathon.mockResolvedValue([idea1, idea2]);
    mockDeleteIdea.mockImplementation(() => {
      throw new DeletionError('Well this stinks');
    });

    await expect(removeIdeasForHackathon(hackathonId))
        .rejects
        .toThrow(DeletionError);
    expect(mockDeleteIdea).toHaveBeenCalledWith(idea1.id);
  });
});

describe('Remove Ideas for Owner', () => {
  test('Happy Path', async () => {
    const ownerId = uuid();
    const idea1 = randomIdea();
    const idea2 = randomIdea();
    mockListIdeasForOwner.mockResolvedValue([idea1, idea2]);
    mockDeleteIdea.mockImplementation(() => {
    });

    await removeIdeasForOwner(ownerId);
    expect(mockDeleteIdea).toHaveBeenCalledWith(idea1.id);
    expect(mockDeleteIdea).toHaveBeenCalledWith(idea2.id);
  });

  test('Fails on first delete', async () => {
    const ownerId = uuid();
    const idea1 = randomIdea();
    const idea2 = randomIdea();
    mockListIdeasForOwner.mockResolvedValue([idea1, idea2]);
    mockDeleteIdea.mockImplementation(() => {
      throw new DeletionError('Well this stinks');
    });

    await expect(removeIdeasForOwner(ownerId))
        .rejects
        .toThrow(DeletionError);
    expect(mockDeleteIdea).toHaveBeenCalledWith(idea1.id);
  });
});

describe('Remove Participant from Ideas', () => {
  test('Happy Path', async () => {
    const participantId = uuid();
    const idea1 = randomIdea();
    const idea2 = randomIdea();
    mockListIdeasForParticipant.mockResolvedValue([idea1, idea2]);
    mockDeleteParticipantFromIdea.mockImplementation(() => {
    });

    await removeParticipantFromIdeas(participantId);
    expect(mockDeleteParticipantFromIdea)
        .toHaveBeenCalledWith(idea1.id, participantId);
    expect(mockDeleteParticipantFromIdea)
        .toHaveBeenCalledWith(idea2.id, participantId);
  });

  test('Fails on first delete', async () => {
    const participantId = uuid();
    const idea1 = randomIdea();
    const idea2 = randomIdea();
    mockListIdeasForParticipant.mockResolvedValue([idea1, idea2]);
    mockDeleteParticipantFromIdea.mockImplementation(() => {
      throw new DeletionError('Well this stinks');
    });

    await expect(removeParticipantFromIdeas(participantId))
        .rejects
        .toThrow(DeletionError);
    expect(mockDeleteParticipantFromIdea)
        .toHaveBeenCalledWith(idea1.id, participantId);
  });
});
