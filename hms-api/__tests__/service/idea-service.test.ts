import {
  addParticipant,
  addVoter,
  createIdea,
  editIdea,
  getAllIdeasResponse,
  getIdeaResponse,
  getIdeasForHackathonListResponse,
  removeIdea,
  removeIdeasForCategory,
  removeIdeasForHackathon,
  removeIdeasForOwner,
  removeParticipant,
  removeParticipantFromIdeas,
} from '../../src/service/idea-service';
import {uuid} from '../../src/util/Uuid';
import {IdeaData, makeIdea, randomIdea} from '../repository/domain/idea-maker';
import {
  HackathonData,
  makeHackathon,
  randomHackathon,
} from '../repository/domain/hackathon-maker';

import {randomUser} from '../repository/domain/user-maker';
import {
  makeParticipant,
  ParticipantData,
  randomParticipant,
} from '../repository/domain/participant-maker';
import {randomCategory} from '../repository/domain/category-maker';
import {randomSkill} from '../repository/domain/skill-maker';
import IdeaResponse from '../../src/rest/Idea/IdeaResponse';
import NotFoundError from '../../src/error/NotFoundError';
import ReferenceNotFoundError from '../../src/error/ReferenceNotFoundError';
import IdeaListResponse from '../../src/rest/Idea/IdeaListResponse';
import DeletionError from '../../src/error/DeletionError';
import Idea from '../../src/repository/domain/Idea';
import * as participantRepository from '../../src/repository/participant-repository';
import * as hackathonRepository from '../../src/repository/hackathon-repository';
import * as categoryRepository from '../../src/repository/category-repository';
import * as skillRepository from '../../src/repository/skill-repository';
import * as userRepository from '../../src/repository/user-repository';
import * as ideaRepository from '../../src/repository/idea-repository';
import * as userService from '../../src/service/user-service';
import InvalidStateError from '../../src/error/InvalidStateError';
import ValidationResult from '../../src/error/ValidationResult';
import ValidationError from '../../src/error/ValidationError';
import IdeaListAllResponse from '../../src/rest/Idea/IdeaListAllResponse';
import User from '../../src/repository/domain/User';
import Participant from '../../src/repository/domain/Participant';
import Hackathon from '../../src/repository/domain/Hackathon';
import Category from '../../src/repository/domain/Category';
import Skill from '../../src/repository/domain/Skill';

const mockPutIdea = jest.fn();
jest.spyOn(ideaRepository, 'putIdea').mockImplementation(mockPutIdea);
const mockGetIdea = jest.fn();
jest.spyOn(ideaRepository, 'getIdea').mockImplementation(mockGetIdea);
const mockListIdeasForHackathon = jest.fn();
jest
  .spyOn(ideaRepository, 'listIdeasForHackathon')
  .mockImplementation(mockListIdeasForHackathon);
const mockAllIdeas = jest.fn();
jest.spyOn(ideaRepository, 'listIdeasAll').mockImplementation(mockAllIdeas);
const mockListIdeasForOwner = jest.fn();
jest
  .spyOn(ideaRepository, 'listIdeasForOwner')
  .mockImplementation(mockListIdeasForOwner);
const mockListIdeasForCategory = jest.fn();
jest
  .spyOn(ideaRepository, 'listIdeasForCategory')
  .mockImplementation(mockListIdeasForCategory);
const mockListIdeasForParticipant = jest.fn();
jest
  .spyOn(ideaRepository, 'listIdeasForParticipant')
  .mockImplementation(mockListIdeasForParticipant);
const mockAddParticipantToIdea = jest.fn();
jest
  .spyOn(ideaRepository, 'addParticipantToIdea')
  .mockImplementation(mockAddParticipantToIdea);
const mockAddVoterToIdea = jest.fn();
jest
  .spyOn(ideaRepository, 'addVoterToIdea')
  .mockImplementation(mockAddVoterToIdea);
const mockDeleteParticipantFromIdea = jest.fn();
jest
  .spyOn(ideaRepository, 'deleteParticipantFromIdea')
  .mockImplementation(mockDeleteParticipantFromIdea);
const mockDeleteIdea = jest.fn();
jest.spyOn(ideaRepository, 'deleteIdea').mockImplementation(mockDeleteIdea);

const mockGetParticipant = jest.fn();
jest
  .spyOn(participantRepository, 'getParticipant')
  .mockImplementation(mockGetParticipant);
const mockGetParticipants = jest.fn();
jest
  .spyOn(participantRepository, 'getParticipants')
  .mockImplementation(mockGetParticipants);
const mockParticipantExists = jest.fn();
jest
  .spyOn(participantRepository, 'participantExistsForHackathon')
  .mockImplementation(mockParticipantExists);

const mockGetUser = jest.fn();
jest.spyOn(userRepository, 'getUser').mockImplementation(mockGetUser);

const mockUsersFor = jest.fn();
jest.spyOn(userService, 'usersFor').mockImplementation(mockUsersFor);

const mockGetHackathon = jest.fn();
jest
  .spyOn(hackathonRepository, 'getHackathon')
  .mockImplementation(mockGetHackathon);
const mockHackathonExists = jest.fn();
jest
  .spyOn(hackathonRepository, 'hackathonExists')
  .mockImplementation(mockHackathonExists);

const mockGetCategory = jest.fn();
jest
  .spyOn(categoryRepository, 'getCategory')
  .mockImplementation(mockGetCategory);
const mockCategoryExists = jest.fn();
jest
  .spyOn(categoryRepository, 'categoryExists')
  .mockImplementation(mockCategoryExists);

const mockGetSkills = jest.fn();
jest.spyOn(skillRepository, 'getSkills').mockImplementation(mockGetSkills);
const mockSkillExists = jest.fn();
jest.spyOn(skillRepository, 'skillExists').mockImplementation(mockSkillExists);

describe('Create Idea', () => {
  test('Validation Error', async () => {
    mockParticipantExists.mockResolvedValue(true);
    mockHackathonExists.mockResolvedValue(true);
    mockCategoryExists.mockResolvedValue(true);
    mockSkillExists.mockResolvedValue(true);

    await expect(
      createIdea(
        uuid(),
        uuid(),
        '',
        'descriiiiption',
        '1 + 1 = x',
        'toooooorrr',
        [uuid()],
        uuid(),
      ),
    ).rejects.toThrow(ValidationError);
  });

  test('Missing Hackathon', async () => {
    mockParticipantExists.mockResolvedValue(true);
    mockHackathonExists.mockResolvedValue(false);
    mockCategoryExists.mockResolvedValue(true);
    mockSkillExists.mockResolvedValue(true);

    await expect(
      createIdea(
        uuid(),
        uuid(),
        'title',
        'description',
        'problem',
        'goal',
        [uuid()],
        uuid(),
      ),
    ).rejects.toThrow(ReferenceNotFoundError);

    expect(mockPutIdea).not.toHaveBeenCalled();
    expect(mockDeleteIdea).not.toHaveBeenCalled();
  });

  test('Missing Category', async () => {
    mockParticipantExists.mockResolvedValue(true);
    mockHackathonExists.mockResolvedValue(true);
    mockCategoryExists.mockResolvedValue(false);
    mockSkillExists.mockResolvedValue(true);

    await expect(
      createIdea(
        uuid(),
        uuid(),
        'title',
        'description',
        'problem',
        'goal',
        [uuid()],
        uuid(),
      ),
    ).rejects.toThrow(ReferenceNotFoundError);

    expect(mockPutIdea).not.toHaveBeenCalled();
    expect(mockDeleteIdea).not.toHaveBeenCalled();
  });

  test('Missing Skill', async () => {
    mockParticipantExists.mockResolvedValue(true);
    mockHackathonExists.mockResolvedValue(true);
    mockCategoryExists.mockResolvedValue(true);
    mockSkillExists.mockResolvedValue(false);

    await expect(
      createIdea(
        uuid(),
        uuid(),
        'title',
        'description',
        'problem',
        'goal',
        [uuid()],
        uuid(),
      ),
    ).rejects.toThrow(ReferenceNotFoundError);

    expect(mockPutIdea).not.toHaveBeenCalled();
    expect(mockDeleteIdea).not.toHaveBeenCalled();
  });

  test('Happy Path', async () => {
    mockParticipantExists.mockResolvedValue(true);
    mockHackathonExists.mockResolvedValue(true);
    mockCategoryExists.mockResolvedValue(true);
    mockSkillExists.mockResolvedValue(true);

    const expected = randomIdea();

    expect(
      await createIdea(
        expected.ownerId,
        expected.hackathonId,
        expected.title,
        expected.description,
        expected.problem,
        expected.goal,
        expected.requiredSkills,
        expected.categoryId,
      ),
    ).toEqual(
      expect.objectContaining({
        ownerId: expected.ownerId,
        hackathonId: expected.hackathonId,
        title: expected.title,
        description: expected.description,
        problem: expected.problem,
        goal: expected.goal,
        requiredSkills: expected.requiredSkills,
        categoryId: expected.categoryId,
      }),
    );

    expect(mockPutIdea).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerId: expected.ownerId,
        hackathonId: expected.hackathonId,
        title: expected.title,
        description: expected.description,
        problem: expected.problem,
        goal: expected.goal,
        requiredSkills: expected.requiredSkills,
        categoryId: expected.categoryId,
      }),
    );
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
      oldIdea.participantIds,
      oldIdea.voterIds,
    );

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
      categoryId,
    );

    expect(mockGetIdea).toHaveBeenCalledWith(oldIdea.id);
    expect(mockCategoryExists).toHaveBeenCalledWith(
      categoryId,
      oldIdea.hackathonId,
    );
    expect(mockSkillExists).toHaveBeenCalledWith(requiredSkills[0]);
    expect(mockSkillExists).toHaveBeenCalledWith(requiredSkills[1]);
    expect(mockPutIdea).toHaveBeenCalledWith(expected);
  });

  test('Validation Error', async () => {
    mockGetIdea.mockResolvedValue(randomIdea());
    mockCategoryExists.mockResolvedValue(true);
    mockSkillExists.mockResolvedValue(true);

    const failedValidation = new ValidationResult();
    failedValidation.addFailure('FAILURE');

    const mockIdea = randomHackathon();
    jest.spyOn(mockIdea, 'validate').mockReturnValue(failedValidation);
    mockGetIdea.mockResolvedValue(mockIdea);

    await expect(
      editIdea(
        uuid(),
        'tiiitle',
        'descriiiiption',
        '1 + 1 = x',
        'toooooorrr',
        [uuid()],
        uuid(),
      ),
    ).rejects.toThrow(ValidationError);
  });

  test('Idea is missing', async () => {
    const id = uuid();

    mockGetIdea.mockImplementation(() => {
      throw new Error('Uh oh');
    });
    mockCategoryExists.mockResolvedValue(true);
    mockSkillExists.mockResolvedValue(true);

    await expect(
      editIdea(
        id,
        'Anything',
        'Super excellent Idea',
        'Praw-blem',
        'Go-well',
        [uuid(), uuid()],
        uuid(),
      ),
    ).rejects.toThrow(NotFoundError);
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
    await expect(
      editIdea(
        id,
        'Anything',
        'Super excellent Idea',
        'Praw-blem',
        'Go-well',
        [uuid(), uuid()],
        categoryId,
      ),
    ).rejects.toThrow(ReferenceNotFoundError);
    expect(mockGetIdea).toHaveBeenCalledWith(id);
    expect(mockCategoryExists).toHaveBeenCalledWith(
      categoryId,
      oldIdea.hackathonId,
    );
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
    await expect(
      editIdea(
        id,
        'Anything',
        'Super excellent Idea',
        'Praw-blem',
        'Go-well',
        [skillId1, uuid()],
        categoryId,
      ),
    ).rejects.toThrow(ReferenceNotFoundError);
    expect(mockGetIdea).toHaveBeenCalledWith(id);
    expect(mockCategoryExists).toHaveBeenCalledWith(
      categoryId,
      oldIdea.hackathonId,
    );
    expect(mockSkillExists).toHaveBeenCalledWith(skillId1);
    expect(mockPutIdea).not.toHaveBeenCalled();
  });
});

describe('Get Idea Response', () => {
  function mockResolvedValues(
    idea: Idea | null,
    ownerUser: User | null,
    participantUsers: User[] | null,
    participants: Participant[] | null,
    voterUsers: User[] | null,
    voters: Participant[] | null,
    hackathon: Hackathon | null,
    skills: Skill[] | null,
    category: Category | null,
  ): void {
    if (idea) {
      mockGetIdea.mockResolvedValueOnce(idea);
    } else {
      mockGetIdea.mockImplementationOnce(() => {
        throw new NotFoundError('Fail');
      });
    }

    if (ownerUser) {
      mockGetUser.mockResolvedValueOnce(ownerUser);
    } else {
      mockGetUser.mockImplementationOnce(() => {
        throw new NotFoundError('Fail');
      });
    }

    if (participants) {
      mockGetParticipants.mockResolvedValueOnce(participants);
    } else {
      mockGetParticipants.mockImplementationOnce(() => {
        throw new NotFoundError('Fail');
      });
    }

    if (voters) {
      mockGetParticipants.mockResolvedValueOnce(voters);
    } else {
      mockGetParticipants.mockImplementationOnce(() => {
        throw new NotFoundError('Fail');
      });
    }

    if (participantUsers) {
      mockUsersFor.mockResolvedValueOnce(participantUsers);
    } else {
      mockUsersFor.mockImplementationOnce(() => {
        throw new NotFoundError('Fail');
      });
    }

    if (voterUsers) {
      mockUsersFor.mockResolvedValueOnce(voterUsers);
    } else {
      mockUsersFor.mockImplementationOnce(() => {
        throw new NotFoundError('Fail');
      });
    }

    if (hackathon) {
      mockGetHackathon.mockResolvedValueOnce(hackathon);
    } else {
      mockGetHackathon.mockImplementationOnce(() => {
        throw new NotFoundError('Fail');
      });
    }

    if (skills) {
      mockGetSkills.mockResolvedValueOnce(skills);
    } else {
      mockGetSkills.mockImplementationOnce(() => {
        throw new NotFoundError('Fail');
      });
    }

    if (category) {
      mockGetCategory.mockResolvedValueOnce(category);
    } else {
      mockGetCategory.mockImplementationOnce(() => {
        throw new NotFoundError('Fail');
      });
    }
  }

  test('Happy Path', async () => {
    const idea = randomIdea();
    const ownerUser = randomUser();
    const participantUser = randomUser();
    const voterUser = randomUser();
    const owner = makeParticipant({
      userId: ownerUser.id,
      hackathonId: idea.hackathonId,
    } as ParticipantData);
    const participant = makeParticipant({
      userId: participantUser.id,
      hackathonId: idea.hackathonId,
    } as ParticipantData);
    const participants = [owner, participant];
    const participantUsers = [ownerUser, participantUser];
    const voter = makeParticipant({
      userId: voterUser.id,
      hackathonId: idea.hackathonId,
    } as ParticipantData);
    const voters = [voter];
    const voterUsers = [voterUser];
    const hackathon = makeHackathon({id: idea.id} as HackathonData);
    const skills = [randomSkill(), randomSkill(), randomSkill()];
    const category = randomCategory();

    const expected = IdeaResponse.from(
      idea,
      ownerUser,
      hackathon,
      participants,
      voters,
      participantUsers,
      voterUsers,
      skills,
      category,
    );
    mockResolvedValues(
      idea,
      ownerUser,
      participantUsers,
      participants,
      voterUsers,
      voters,
      hackathon,
      skills,
      category,
    );

    expect(await getIdeaResponse(idea.id)).toStrictEqual(expected);
    expect(mockGetIdea).toHaveBeenCalledWith(idea.id);
    expect(mockGetUser).toHaveBeenCalledWith(idea.ownerId);
    expect(mockGetParticipants).toHaveBeenNthCalledWith(1, idea.participantIds);
    expect(mockUsersFor).toHaveBeenNthCalledWith(1, participants);
    expect(mockGetParticipants).toHaveBeenNthCalledWith(2, idea.voterIds);
    expect(mockUsersFor).toHaveBeenNthCalledWith(2, voters);
    expect(mockGetHackathon).toHaveBeenCalledWith(idea.hackathonId);
    expect(mockGetSkills).toHaveBeenCalledWith(idea.requiredSkills);
    expect(mockGetCategory).toHaveBeenCalledWith(idea.categoryId);
  });

  test('Missing Category', async () => {
    const idea = randomIdea();
    const ownerUser = randomUser();
    const participantUser = randomUser();
    const voterUser = randomUser();
    const owner = makeParticipant({
      userId: ownerUser.id,
      hackathonId: idea.hackathonId,
    } as ParticipantData);
    const participant = makeParticipant({
      userId: participantUser.id,
      hackathonId: idea.hackathonId,
    } as ParticipantData);
    const participants = [owner, participant];
    const participantUsers = [ownerUser, participantUser];
    const voter = makeParticipant({
      userId: voterUser.id,
      hackathonId: idea.hackathonId,
    } as ParticipantData);
    const voters = [voter];
    const voterUsers = [voterUser];
    const hackathon = makeHackathon({id: idea.id} as HackathonData);
    const skills = [randomSkill(), randomSkill(), randomSkill()];

    mockResolvedValues(
      idea,
      ownerUser,
      participantUsers,
      participants,
      voterUsers,
      voters,
      hackathon,
      skills,
      null,
    );

    await expect(getIdeaResponse(idea.id)).rejects.toThrow(
      ReferenceNotFoundError,
    );
  });

  test('Missing Skills', async () => {
    const idea = randomIdea();
    const ownerUser = randomUser();
    const participantUser = randomUser();
    const voterUser = randomUser();
    const owner = makeParticipant({
      userId: ownerUser.id,
      hackathonId: idea.hackathonId,
    } as ParticipantData);
    const participant = makeParticipant({
      userId: participantUser.id,
      hackathonId: idea.hackathonId,
    } as ParticipantData);
    const participants = [owner, participant];
    const participantUsers = [ownerUser, participantUser];
    const voter = makeParticipant({
      userId: voterUser.id,
      hackathonId: idea.hackathonId,
    } as ParticipantData);
    const voters = [voter];
    const voterUsers = [voterUser];
    const hackathon = makeHackathon({id: idea.id} as HackathonData);
    const category = randomCategory();

    mockResolvedValues(
      idea,
      ownerUser,
      participantUsers,
      participants,
      voterUsers,
      voters,
      hackathon,
      null,
      category,
    );

    await expect(getIdeaResponse(idea.id)).rejects.toThrow(
      ReferenceNotFoundError,
    );
  });

  test('Missing Hackathon', async () => {
    const idea = randomIdea();
    const ownerUser = randomUser();
    const participantUser = randomUser();
    const voterUser = randomUser();
    const owner = makeParticipant({
      userId: ownerUser.id,
      hackathonId: idea.hackathonId,
    } as ParticipantData);
    const participant = makeParticipant({
      userId: participantUser.id,
      hackathonId: idea.hackathonId,
    } as ParticipantData);
    const participants = [owner, participant];
    const participantUsers = [ownerUser, participantUser];
    const voter = makeParticipant({
      userId: voterUser.id,
      hackathonId: idea.hackathonId,
    } as ParticipantData);
    const voters = [voter];
    const voterUsers = [voterUser];
    const skills = [randomSkill(), randomSkill(), randomSkill()];
    const category = randomCategory();

    mockResolvedValues(
      idea,
      ownerUser,
      participantUsers,
      participants,
      voterUsers,
      voters,
      null,
      skills,
      category,
    );

    await expect(getIdeaResponse(idea.id)).rejects.toThrow(
      ReferenceNotFoundError,
    );
  });

  test('Missing Users', async () => {
    const idea = randomIdea();
    const ownerUser = randomUser();
    const participantUser = randomUser();
    const voterUser = randomUser();
    const owner = makeParticipant({
      userId: ownerUser.id,
      hackathonId: idea.hackathonId,
    } as ParticipantData);
    const participant = makeParticipant({
      userId: participantUser.id,
      hackathonId: idea.hackathonId,
    } as ParticipantData);
    const participants = [owner, participant];
    const voter = makeParticipant({
      userId: voterUser.id,
      hackathonId: idea.hackathonId,
    } as ParticipantData);
    const voters = [voter];
    const hackathon = makeHackathon({id: idea.id} as HackathonData);
    const skills = [randomSkill(), randomSkill(), randomSkill()];
    const category = randomCategory();

    mockResolvedValues(
      idea,
      ownerUser,
      null,
      participants,
      null,
      voters,
      hackathon,
      skills,
      category,
    );

    await expect(getIdeaResponse(idea.id)).rejects.toThrow(
      ReferenceNotFoundError,
    );
  });

  test('Missing Participants', async () => {
    const idea = randomIdea();
    const ownerUser = randomUser();
    const participantUser = randomUser();
    const voterUser = randomUser();
    const participantUsers = [ownerUser, participantUser];
    const voterUsers = [voterUser];
    const hackathon = makeHackathon({id: idea.id} as HackathonData);
    const skills = [randomSkill(), randomSkill(), randomSkill()];
    const category = randomCategory();

    mockResolvedValues(
      idea,
      ownerUser,
      participantUsers,
      null,
      voterUsers,
      null,
      hackathon,
      skills,
      category,
    );
    await expect(getIdeaResponse(idea.id)).rejects.toThrow(
      ReferenceNotFoundError,
    );
  });

  test('Missing Owner User', async () => {
    const idea = randomIdea();
    const participantUser = randomUser();
    const voterUser = randomUser();
    const participant = makeParticipant({
      userId: participantUser.id,
      hackathonId: idea.hackathonId,
    } as ParticipantData);
    const participants = [participant];
    const participantUsers = [participantUser];
    const voter = makeParticipant({
      userId: voterUser.id,
      hackathonId: idea.hackathonId,
    } as ParticipantData);
    const voters = [voter];
    const voterUsers = [voterUser];
    const hackathon = makeHackathon({id: idea.id} as HackathonData);
    const skills = [randomSkill(), randomSkill(), randomSkill()];
    const category = randomCategory();

    mockResolvedValues(
      idea,
      null,
      participantUsers,
      participants,
      voterUsers,
      voters,
      hackathon,
      skills,
      category,
    );
    await expect(getIdeaResponse(idea.id)).rejects.toThrow(
      ReferenceNotFoundError,
    );
  });

  test('Missing Owner Participant', async () => {
    const idea = randomIdea();

    mockGetIdea.mockResolvedValue(idea);
    mockGetUser.mockImplementation(() => {
      throw new NotFoundError('That thing is missing');
    });

    await expect(getIdeaResponse(idea.id)).rejects.toThrow(
      ReferenceNotFoundError,
    );
  });

  test('Missing Idea', async () => {
    const id = uuid();
    mockGetIdea.mockImplementation(() => {
      throw new NotFoundError('That thing is missing');
    });

    await expect(getIdeaResponse(id)).rejects.toThrow(NotFoundError);
  });
});

describe('Get Hackathon Idea List Response', () => {
  test('Happy Path', async () => {
    const hackathonId = uuid();
    const idea1 = randomIdea();
    const idea2 = randomIdea();
    const idea3 = randomIdea();
    const expected = IdeaListResponse.from([idea1, idea2, idea3], hackathonId);

    mockHackathonExists.mockResolvedValue(true);
    mockListIdeasForHackathon.mockResolvedValue([idea1, idea2, idea3]);

    expect(await getIdeasForHackathonListResponse(hackathonId)).toStrictEqual(
      expected,
    );
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

    await expect(getIdeasForHackathonListResponse(hackathonId)).rejects.toThrow(
      NotFoundError,
    );
    expect(mockHackathonExists).toHaveBeenCalledWith(hackathonId);
    expect(mockListIdeasForHackathon).not.toHaveBeenCalledWith();
  });
});

describe('Get All Ideas Response', () => {
  test('Happy Path', async () => {
    const idea1 = randomIdea();
    const idea2 = randomIdea();
    const idea3 = randomIdea();
    const expected = IdeaListAllResponse.from([idea1, idea2, idea3]);

    mockAllIdeas.mockResolvedValue([idea1, idea2, idea3]);

    expect(await getAllIdeasResponse()).toStrictEqual(expected);
    expect(mockAllIdeas).toHaveBeenCalled();
  });
});

describe('Remove Participant', () => {
  test('Happy Path', async () => {
    const ideaId = uuid();
    const participantId = uuid();

    await removeParticipant(ideaId, participantId);

    expect(mockDeleteParticipantFromIdea).toHaveBeenCalledWith(
      ideaId,
      participantId,
    );
  });
});

describe('Add Participant', () => {
  test('Happy Path', async () => {
    const hackathonId = uuid();
    const idea = makeIdea({hackathonId: hackathonId} as IdeaData);
    mockGetIdea.mockResolvedValue(idea);
    const participant = makeParticipant({
      hackathonId: hackathonId,
    } as ParticipantData);
    mockGetParticipant.mockResolvedValue(participant);

    await addParticipant(idea.id, participant.id);

    expect(mockGetIdea).toHaveBeenCalledWith(idea.id);
    expect(mockGetParticipant).toHaveBeenCalledWith(participant.id);
    expect(mockAddParticipantToIdea).toHaveBeenCalledWith(
      idea.id,
      participant.id,
    );
  });

  test('Missing Participant', async () => {
    const idea = randomIdea();
    mockGetIdea.mockResolvedValue(idea);
    const participantId = uuid();
    mockGetParticipant.mockImplementation(() => {
      throw new Error();
    });

    await expect(addParticipant(idea.id, participantId)).rejects.toThrow(
      NotFoundError,
    );
    expect(mockGetIdea).toHaveBeenCalledWith(idea.id);
    expect(mockGetParticipant).toHaveBeenCalledWith(participantId);
    expect(mockAddParticipantToIdea).not.toHaveBeenCalled();
  });

  test('Missing Idea', async () => {
    const ideaId = uuid();
    mockGetIdea.mockImplementation(() => {
      throw new Error();
    });
    const participant = randomParticipant();
    mockGetParticipant.mockResolvedValue(participant);

    await expect(addParticipant(ideaId, participant.id)).rejects.toThrow(
      NotFoundError,
    );
    expect(mockGetIdea).toHaveBeenCalledWith(ideaId);
    expect(mockGetParticipant).not.toHaveBeenCalled();
    expect(mockAddParticipantToIdea).not.toHaveBeenCalled();
  });

  test('Hackathon Mismatch', async () => {
    const hackathonId1 = uuid();
    const hackathonId2 = uuid();
    const idea = makeIdea({hackathonId: hackathonId1} as IdeaData);
    mockGetIdea.mockResolvedValue(idea);
    const participant = makeParticipant({
      hackathonId: hackathonId2,
    } as ParticipantData);
    mockGetParticipant.mockResolvedValue(participant);

    await expect(addParticipant(idea.id, participant.id)).rejects.toThrow(
      InvalidStateError,
    );
    expect(mockGetIdea).toHaveBeenCalledWith(idea.id);
    expect(mockGetParticipant).toHaveBeenCalledWith(participant.id);
    expect(mockAddParticipantToIdea).not.toHaveBeenCalled();
  });
});

describe('Add Voter', () => {
  test('Happy Path', async () => {
    const hackathonId = uuid();
    const idea = makeIdea({hackathonId: hackathonId} as IdeaData);
    mockGetIdea.mockResolvedValue(idea);
    const participant = makeParticipant({
      hackathonId: hackathonId,
    } as ParticipantData);
    mockGetParticipant.mockResolvedValue(participant);

    await addVoter(idea.id, participant.id);

    expect(mockGetIdea).toHaveBeenCalledWith(idea.id);
    expect(mockGetParticipant).toHaveBeenCalledWith(participant.id);
    expect(mockAddVoterToIdea).toHaveBeenCalledWith(idea.id, participant.id);
  });

  test('Missing Participant', async () => {
    const idea = randomIdea();
    mockGetIdea.mockResolvedValue(idea);
    const participantId = uuid();
    mockGetParticipant.mockImplementation(() => {
      throw new Error();
    });

    await expect(addVoter(idea.id, participantId)).rejects.toThrow(
      NotFoundError,
    );
    expect(mockGetIdea).toHaveBeenCalledWith(idea.id);
    expect(mockGetParticipant).toHaveBeenCalledWith(participantId);
    expect(mockAddVoterToIdea).not.toHaveBeenCalled();
  });

  test('Missing Idea', async () => {
    const ideaId = uuid();
    mockGetIdea.mockImplementation(() => {
      throw new Error();
    });
    const participant = randomParticipant();
    mockGetParticipant.mockResolvedValue(participant);

    await expect(addVoter(ideaId, participant.id)).rejects.toThrow(
      NotFoundError,
    );
    expect(mockGetIdea).toHaveBeenCalledWith(ideaId);
    expect(mockGetParticipant).not.toHaveBeenCalled();
    expect(mockAddVoterToIdea).not.toHaveBeenCalled();
  });

  test('Hackathon Mismatch', async () => {
    const hackathonId1 = uuid();
    const hackathonId2 = uuid();
    const idea = makeIdea({hackathonId: hackathonId1} as IdeaData);
    mockGetIdea.mockResolvedValue(idea);
    const participant = makeParticipant({
      hackathonId: hackathonId2,
    } as ParticipantData);
    mockGetParticipant.mockResolvedValue(participant);

    await expect(addVoter(idea.id, participant.id)).rejects.toThrow(
      InvalidStateError,
    );
    expect(mockGetIdea).toHaveBeenCalledWith(idea.id);
  });
});

describe('Remove Participant', () => {
  const ignored = null;
});

describe('Remove Voter', () => {
  const ignored = null;
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
      const ignored = null;
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

    await expect(removeIdeasForCategory(categoryId)).rejects.toThrow(
      DeletionError,
    );
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
      const ignored = null;
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

    await expect(removeIdeasForHackathon(hackathonId)).rejects.toThrow(
      DeletionError,
    );
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
      const ignored = null;
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

    await expect(removeIdeasForOwner(ownerId)).rejects.toThrow(DeletionError);
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
      const ignored = null;
    });

    await removeParticipantFromIdeas(participantId);
    expect(mockDeleteParticipantFromIdea).toHaveBeenCalledWith(
      idea1.id,
      participantId,
    );
    expect(mockDeleteParticipantFromIdea).toHaveBeenCalledWith(
      idea2.id,
      participantId,
    );
  });

  test('Fails on first delete', async () => {
    const participantId = uuid();
    const idea1 = randomIdea();
    const idea2 = randomIdea();
    mockListIdeasForParticipant.mockResolvedValue([idea1, idea2]);
    mockDeleteParticipantFromIdea.mockImplementation(() => {
      throw new DeletionError('Well this stinks');
    });

    await expect(removeParticipantFromIdeas(participantId)).rejects.toThrow(
      DeletionError,
    );
    expect(mockDeleteParticipantFromIdea).toHaveBeenCalledWith(
      idea1.id,
      participantId,
    );
  });
});
