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
  removeVoter,
} from '../../src/service/idea-service';
import {uuid} from '../../src/util/Uuid';
import {IdeaData, makeIdea, randomIdea} from '../repository/domain/idea-maker';
import {
  HackathonData,
  makeHackathon,
} from '../repository/domain/hackathon-maker';

import {randomUser} from '../repository/domain/user-maker';
import {
  makeParticipant,
  ParticipantData,
  randomParticipant,
} from '../repository/domain/participant-maker';
import {randomCategory} from '../repository/domain/category-maker';
import {randomSkill} from '../repository/domain/skill-maker';
import IdeaResponse from '../../src/rest/idea/IdeaResponse';
import NotFoundError from '../../src/error/NotFoundError';
import ReferenceNotFoundError from '../../src/error/ReferenceNotFoundError';
import IdeaListResponse from '../../src/rest/idea/IdeaListResponse';
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
import IdeaListAllResponse from '../../src/rest/idea/IdeaListAllResponse';
import User from '../../src/repository/domain/User';
import Participant from '../../src/repository/domain/Participant';
import Hackathon from '../../src/repository/domain/Hackathon';
import Category from '../../src/repository/domain/Category';
import Skill from '../../src/repository/domain/Skill';

const mockPutIdea = jest.spyOn(ideaRepository, 'putIdea').mockImplementation();
const mockGetIdea = jest.spyOn(ideaRepository, 'getIdea').mockImplementation();

const mockListIdeasForHackathon = jest
  .spyOn(ideaRepository, 'listIdeasForHackathon')
  .mockImplementation();
const mockAllIdeas = jest
  .spyOn(ideaRepository, 'listIdeasAll')
  .mockImplementation();
const mockListIdeasForOwner = jest
  .spyOn(ideaRepository, 'listIdeasForOwner')
  .mockImplementation();
const mockListIdeasForCategory = jest
  .spyOn(ideaRepository, 'listIdeasForCategory')
  .mockImplementation();
const mockListIdeasForParticipant = jest
  .spyOn(ideaRepository, 'listIdeasForParticipant')
  .mockImplementation();

const mockAddParticipantToIdea = jest
  .spyOn(ideaRepository, 'addParticipantToIdea')
  .mockImplementation();
const mockAddVoterToIdea = jest
  .spyOn(ideaRepository, 'addVoterToIdea')
  .mockImplementation();

const mockDeleteParticipantFromIdea = jest
  .spyOn(ideaRepository, 'deleteParticipantFromIdea')
  .mockImplementation();
const mockDeleteIdea = jest
  .spyOn(ideaRepository, 'deleteIdea')
  .mockImplementation();
const mockRemoveVoterFromIdea = jest
  .spyOn(ideaRepository, 'deleteVoterFromIdea')
  .mockImplementation();

const mockGetParticipant = jest
  .spyOn(participantRepository, 'getParticipant')
  .mockImplementation();
const mockGetParticipants = jest
  .spyOn(participantRepository, 'getParticipants')
  .mockImplementation();

const mockGetUser = jest.spyOn(userRepository, 'getUser').mockImplementation();
const mockUsersFor = jest.spyOn(userService, 'usersFor').mockImplementation();

const mockGetHackathon = jest
  .spyOn(hackathonRepository, 'getHackathon')
  .mockImplementation();
const mockHackathonExists = jest
  .spyOn(hackathonRepository, 'hackathonExists')
  .mockImplementation();

const mockGetCategory = jest
  .spyOn(categoryRepository, 'getCategory')
  .mockImplementation();
const mockCategoryExists = jest
  .spyOn(categoryRepository, 'categoryExists')
  .mockImplementation();

const mockGetSkills = jest
  .spyOn(skillRepository, 'getSkills')
  .mockImplementation();
const mockSkillExists = jest
  .spyOn(skillRepository, 'skillExists')
  .mockImplementation();

describe('Create Idea', () => {
  test('Happy Path', async () => {
    mockHackathonExists.mockReset();
    mockCategoryExists.mockReset();
    mockSkillExists.mockReset();
    mockHackathonExists.mockResolvedValueOnce(true);
    mockCategoryExists.mockResolvedValueOnce(true);
    mockSkillExists.mockResolvedValueOnce(true);

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

  test('Validation Error', async () => {
    mockHackathonExists.mockReset();
    mockCategoryExists.mockReset();
    mockSkillExists.mockReset();
    mockHackathonExists.mockResolvedValueOnce(true);
    mockCategoryExists.mockResolvedValueOnce(true);
    mockSkillExists.mockResolvedValueOnce(true);

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
    mockHackathonExists.mockReset();
    mockCategoryExists.mockReset();
    mockSkillExists.mockReset();
    mockHackathonExists.mockResolvedValueOnce(false);
    mockCategoryExists.mockResolvedValueOnce(true);
    mockSkillExists.mockResolvedValueOnce(true);

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
    mockHackathonExists.mockReset();
    mockCategoryExists.mockReset();
    mockSkillExists.mockReset();
    mockHackathonExists.mockResolvedValueOnce(true);
    mockCategoryExists.mockResolvedValueOnce(false);
    mockSkillExists.mockResolvedValueOnce(true);

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
    mockHackathonExists.mockReset();
    mockCategoryExists.mockReset();
    mockSkillExists.mockReset();
    mockHackathonExists.mockResolvedValueOnce(true);
    mockCategoryExists.mockResolvedValueOnce(true);
    mockSkillExists.mockResolvedValueOnce(false);

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
});

describe('Edit Idea', () => {
  test('Happy Path', async () => {
    const oldIdea = randomIdea();
    const hackathonId = uuid();
    const title = 'Worst Idea Ever';
    const description = 'Best description ever!';
    const problem = 'A simple problem';
    const goal = 'An overly complicated goal';
    const requiredSkills = [uuid()];
    const categoryId = uuid();
    const expected = new Idea(
      oldIdea.ownerId,
      hackathonId,
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

    mockGetIdea.mockReset();
    mockCategoryExists.mockReset();
    mockSkillExists.mockReset();
    mockGetIdea.mockResolvedValueOnce(oldIdea);
    mockCategoryExists.mockResolvedValueOnce(true);
    mockSkillExists.mockResolvedValueOnce(true);

    await editIdea(
      oldIdea.id,
      hackathonId,
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
    expect(mockPutIdea).toHaveBeenCalledWith(expected);
  });

  test('Validation Error', async () => {
    mockGetIdea.mockReset();
    mockCategoryExists.mockReset();
    mockSkillExists.mockReset();
    mockGetIdea.mockResolvedValueOnce(randomIdea());
    mockCategoryExists.mockResolvedValueOnce(true);
    mockSkillExists.mockResolvedValueOnce(true);

    const failedValidation = new ValidationResult();
    failedValidation.addFailure('FAILURE');

    const mockIdea = randomIdea();
    jest.spyOn(mockIdea, 'validate').mockReturnValue(failedValidation);
    mockGetIdea.mockReset();
    mockGetIdea.mockResolvedValueOnce(mockIdea);

    await expect(
      editIdea(
        uuid(),
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
    mockCategoryExists.mockReset();
    mockSkillExists.mockReset();
    mockCategoryExists.mockResolvedValueOnce(true);
    mockSkillExists.mockResolvedValueOnce(true);

    await expect(
      editIdea(
        id,
        uuid(),
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
    const hackathonId = uuid();

    const oldIdea = randomIdea();
    mockGetIdea.mockReset();
    mockCategoryExists.mockReset();
    mockSkillExists.mockReset();
    mockGetIdea.mockResolvedValueOnce(oldIdea);
    mockCategoryExists.mockResolvedValueOnce(false);
    mockSkillExists.mockResolvedValueOnce(true);

    const categoryId = uuid();
    await expect(
      editIdea(
        id,
        hackathonId,
        'Anything',
        'Super excellent Idea',
        'Praw-blem',
        'Go-well',
        [uuid(), uuid()],
        categoryId,
      ),
    ).rejects.toThrow(ReferenceNotFoundError);
    expect(mockGetIdea).toHaveBeenCalledWith(id);
    expect(mockCategoryExists).toHaveBeenCalledWith(categoryId, hackathonId);
    expect(mockSkillExists).not.toHaveBeenCalled();
    expect(mockPutIdea).not.toHaveBeenCalled();
  });

  test('Skills are missing', async () => {
    const id = uuid();
    const hackathonId = uuid();

    const oldIdea = randomIdea();
    mockGetIdea.mockReset();
    mockCategoryExists.mockReset();
    mockSkillExists.mockReset();
    mockGetIdea.mockResolvedValueOnce(oldIdea);
    mockCategoryExists.mockResolvedValueOnce(true);
    mockSkillExists.mockResolvedValueOnce(false);

    const categoryId = uuid();
    const skillId1 = uuid();
    await expect(
      editIdea(
        id,
        hackathonId,
        'Anything',
        'Super excellent Idea',
        'Praw-blem',
        'Go-well',
        [skillId1, uuid()],
        categoryId,
      ),
    ).rejects.toThrow(ReferenceNotFoundError);
    expect(mockGetIdea).toHaveBeenCalledWith(id);
    expect(mockCategoryExists).toHaveBeenCalledWith(categoryId, hackathonId);
    expect(mockSkillExists).toHaveBeenCalledWith(skillId1);
    expect(mockPutIdea).not.toHaveBeenCalled();
  });
});

describe('Get Idea Response', () => {
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
  });

  test('Missing Category', async () => {
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

  test('Missing Participant Users', async () => {
    mockResolvedValues(
      idea,
      ownerUser,
      null,
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

  test('Missing Voter Users', async () => {
    mockResolvedValues(
      idea,
      ownerUser,
      participantUsers,
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

  test('Missing Voters', async () => {
    mockResolvedValues(
      idea,
      ownerUser,
      participantUsers,
      participants,
      null,
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
    mockGetIdea.mockResolvedValueOnce(idea);
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

    mockHackathonExists.mockResolvedValueOnce(true);
    mockListIdeasForHackathon.mockResolvedValueOnce([idea1, idea2, idea3]);

    expect(await getIdeasForHackathonListResponse(hackathonId)).toStrictEqual(
      expected,
    );
    expect(mockHackathonExists).toHaveBeenCalledWith(hackathonId);
    expect(mockListIdeasForHackathon).toHaveBeenCalledWith(hackathonId);
  });

  test('Hackathon Missing', async () => {
    const hackathonId = uuid();

    mockHackathonExists.mockResolvedValueOnce(false);
    mockListIdeasForHackathon.mockResolvedValueOnce([
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

    mockAllIdeas.mockResolvedValueOnce([idea1, idea2, idea3]);

    expect(await getAllIdeasResponse()).toStrictEqual(expected);
    expect(mockAllIdeas).toHaveBeenCalled();
  });
});

describe('Remove Participant', () => {
  const ideaId = uuid();
  const participantId = uuid();

  test('Happy Path', async () => {
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
    mockGetIdea.mockResolvedValueOnce(idea);
    const participant = makeParticipant({
      hackathonId: hackathonId,
    } as ParticipantData);
    mockGetParticipant.mockResolvedValueOnce(participant);

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
    mockGetIdea.mockResolvedValueOnce(idea);
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
    mockGetParticipant.mockResolvedValueOnce(participant);

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
    mockGetIdea.mockResolvedValueOnce(idea);
    const participant = makeParticipant({
      hackathonId: hackathonId2,
    } as ParticipantData);
    mockGetParticipant.mockResolvedValueOnce(participant);

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
    mockGetIdea.mockReset();
    mockGetIdea.mockResolvedValueOnce(idea);
    const participant = makeParticipant({
      hackathonId: hackathonId,
    } as ParticipantData);
    mockGetParticipant.mockReset();
    mockGetParticipant.mockResolvedValueOnce(participant);

    await addVoter(idea.id, participant.id);

    expect(mockGetIdea).toHaveBeenCalledWith(idea.id);
    expect(mockGetParticipant).toHaveBeenCalledWith(participant.id);
    expect(mockAddVoterToIdea).toHaveBeenCalledWith(idea.id, participant.id);
  });

  test('Missing Participant', async () => {
    const idea = randomIdea();
    mockGetIdea.mockResolvedValueOnce(idea);
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
    mockGetParticipant.mockResolvedValueOnce(participant);

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
    mockGetIdea.mockResolvedValueOnce(idea);
    const participant = makeParticipant({
      hackathonId: hackathonId2,
    } as ParticipantData);
    mockGetParticipant.mockResolvedValueOnce(participant);

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
  const ideaId = uuid();
  const participantId = uuid();

  test('Happy Path', async () => {
    await removeVoter(ideaId, participantId);

    expect(mockRemoveVoterFromIdea).toHaveBeenCalledWith(ideaId, participantId);
  });
});

describe('Delete Idea', () => {
  test('Happy Path', async () => {
    const id = uuid();
    await removeIdea(id);
    expect(mockDeleteIdea).toHaveBeenCalledWith(id);
  });

  test('Deletion Error', async () => {
    const id = uuid();
    mockDeleteIdea.mockImplementation(() => {
      throw new DeletionError('Well this stinks');
    });

    await expect(removeIdea(id)).rejects.toThrow(DeletionError);
    expect(mockDeleteIdea).toHaveBeenCalledWith(id);
  });
});

describe('Remove Ideas for Category', () => {
  test('Happy Path', async () => {
    const categoryId = uuid();
    const idea1 = randomIdea();
    const idea2 = randomIdea();
    mockListIdeasForCategory.mockResolvedValueOnce([idea1, idea2]);
    mockDeleteIdea.mockImplementation();

    await removeIdeasForCategory(categoryId);
    expect(mockDeleteIdea).toHaveBeenCalledWith(idea1.id);
    expect(mockDeleteIdea).toHaveBeenCalledWith(idea2.id);
  });

  test('Fails on first delete', async () => {
    const categoryId = uuid();
    const idea1 = randomIdea();
    const idea2 = randomIdea();
    mockListIdeasForCategory.mockResolvedValueOnce([idea1, idea2]);
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
    mockListIdeasForHackathon.mockReset();
    mockListIdeasForHackathon.mockResolvedValueOnce([idea1, idea2]);
    mockDeleteIdea.mockImplementation();

    await removeIdeasForHackathon(hackathonId);
    expect(mockDeleteIdea).toHaveBeenCalledWith(idea1.id);
    expect(mockDeleteIdea).toHaveBeenCalledWith(idea2.id);
  });

  test('Fails on first delete', async () => {
    const hackathonId = uuid();
    const idea1 = randomIdea();
    const idea2 = randomIdea();
    mockListIdeasForHackathon.mockResolvedValueOnce([idea1, idea2]);
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
    mockListIdeasForOwner.mockResolvedValueOnce([idea1, idea2]);
    mockDeleteIdea.mockImplementation();

    await removeIdeasForOwner(ownerId);
    expect(mockDeleteIdea).toHaveBeenCalledWith(idea1.id);
    expect(mockDeleteIdea).toHaveBeenCalledWith(idea2.id);
  });

  test('Fails on first delete', async () => {
    const ownerId = uuid();
    const idea1 = randomIdea();
    const idea2 = randomIdea();
    mockListIdeasForOwner.mockResolvedValueOnce([idea1, idea2]);
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
    mockListIdeasForParticipant.mockResolvedValueOnce([idea1, idea2]);
    mockDeleteParticipantFromIdea.mockImplementation();

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
    mockListIdeasForParticipant.mockResolvedValueOnce([idea1, idea2]);
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
