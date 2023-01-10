import {
  createParticipant,
  getParticipantListResponse,
  getParticipantResponse,
  removeParticipant,
  removeParticipantsForHackathon,
} from '../../src/service/participant-service';
import {
  makeParticipant,
  ParticipantData,
  randomParticipant,
} from '../repository/domain/participant-maker';
import {randomUser} from '../repository/domain/user-maker';
import {randomHackathon} from '../repository/domain/hackathon-maker';
import {uuid} from '../../src/util/Uuid';
import ParticipantResponse from '../../src/rest/Participant/ParticipantResponse';
import ParticipantListResponse from '../../src/rest/Participant/ParticipantListResponse';
import NotFoundError from '../../src/error/NotFoundError';
import ReferenceNotFoundError from '../../src/error/ReferenceNotFoundError';
import DeletionError from '../../src/error/DeletionError';
import ParticipantDeleteResponse from '../../src/rest/Participant/ParticipantDeleteResponse';
import * as participantRepository from '../../src/repository/participant-repository';
import * as hackathonRepository from '../../src/repository/hackathon-repository';
import * as userRepository from '../../src/repository/user-repository';
import * as ideaService from '../../src/service/idea-service';
import ValidationError from '../../src/error/ValidationError';

const mockPutParticipant = jest.fn();
jest
  .spyOn(participantRepository, 'putParticipant')
  .mockImplementation(mockPutParticipant);
const mockGetParticipant = jest.fn();
jest
  .spyOn(participantRepository, 'getParticipant')
  .mockImplementation(mockGetParticipant);
const mockListParticipants = jest.fn();
jest
  .spyOn(participantRepository, 'listParticipants')
  .mockImplementation(mockListParticipants);
const mockDeleteParticipant = jest.fn();
jest
  .spyOn(participantRepository, 'deleteParticipant')
  .mockImplementation(mockDeleteParticipant);

const mockGetHackathon = jest.fn();
jest
  .spyOn(hackathonRepository, 'getHackathon')
  .mockImplementation(mockGetHackathon);
const mockHackathonExists = jest.fn();
jest
  .spyOn(hackathonRepository, 'hackathonExists')
  .mockImplementation(mockHackathonExists);

const mockGetUser = jest.fn();
jest.spyOn(userRepository, 'getUser').mockImplementation(mockGetUser);
const mockGetUsers = jest.fn();
jest.spyOn(userRepository, 'getUsers').mockImplementation(mockGetUsers);
const mockUserExists = jest.fn();
jest.spyOn(userRepository, 'userExists').mockImplementation(mockUserExists);

const mockRemoveIdeasForOwner = jest.fn();
jest
  .spyOn(ideaService, 'removeIdeasForOwner')
  .mockImplementation(mockRemoveIdeasForOwner);
const mockRemoveParticipantFromIdeas = jest.fn();
jest
  .spyOn(ideaService, 'removeParticipantFromIdeas')
  .mockImplementation(mockRemoveParticipantFromIdeas);

describe('Create Participant', () => {
  test('Validation Error', async () => {
    mockHackathonExists.mockResolvedValue(true);
    mockUserExists.mockResolvedValue(true);

    await expect(createParticipant(null, uuid())).rejects.toThrow(
      ValidationError,
    );
  });

  test('Missing Hackathon', async () => {
    mockHackathonExists.mockResolvedValue(false);
    mockUserExists.mockResolvedValue(true);

    await expect(createParticipant(uuid(), uuid())).rejects.toThrow(
      ReferenceNotFoundError,
    );

    expect(mockPutParticipant).not.toHaveBeenCalled();
    expect(mockDeleteParticipant).not.toHaveBeenCalled();
  });

  test('Missing User', async () => {
    mockHackathonExists.mockResolvedValue(true);
    mockUserExists.mockResolvedValue(false);

    await expect(createParticipant(uuid(), uuid())).rejects.toThrow(
      ReferenceNotFoundError,
    );

    expect(mockPutParticipant).not.toHaveBeenCalled();
    expect(mockDeleteParticipant).not.toHaveBeenCalled();
  });

  test('Happy Path', async () => {
    mockHackathonExists.mockResolvedValue(true);
    mockUserExists.mockResolvedValue(true);

    const expected = randomParticipant();

    expect(
      await createParticipant(expected.userId, expected.hackathonId),
    ).toEqual(
      expect.objectContaining({
        userId: expected.userId,
        hackathonId: expected.hackathonId,
      }),
    );

    expect(mockPutParticipant).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: expected.userId,
        hackathonId: expected.hackathonId,
      }),
    );
    expect(mockDeleteParticipant).not.toHaveBeenCalled();
  });
});

describe('Get Participant Response', () => {
  test('Happy Path', async () => {
    const user = randomUser();
    const participant = makeParticipant({userId: user.id} as ParticipantData);
    const hackathon = randomHackathon();

    const expected = ParticipantResponse.from(participant, user, hackathon);

    mockGetParticipant.mockResolvedValue(participant);
    mockGetUser.mockResolvedValue(user);
    mockGetHackathon.mockResolvedValue(hackathon);

    expect(await getParticipantResponse(participant.id)).toStrictEqual(
      expected,
    );
    expect(mockGetParticipant).toHaveBeenCalledWith(participant.id);
    expect(mockGetUser).toHaveBeenCalledWith(participant.userId);
    expect(mockGetHackathon).toHaveBeenCalledWith(participant.hackathonId);
  });

  test('Missing Hackathon', async () => {
    const user = randomUser();
    const participant = makeParticipant({userId: user.id} as ParticipantData);

    mockGetParticipant.mockResolvedValue(participant);
    mockGetUser.mockResolvedValue(user);
    mockGetHackathon.mockImplementation(() => {
      throw new NotFoundError('IT IS MISSING');
    });

    await expect(getParticipantResponse(participant.id)).rejects.toThrow(
      ReferenceNotFoundError,
    );
    expect(mockGetParticipant).toHaveBeenCalledWith(participant.id);
    expect(mockGetUser).toHaveBeenCalledWith(participant.userId);
    expect(mockGetHackathon).toHaveBeenCalledWith(participant.hackathonId);
  });

  test('Missing User', async () => {
    const participant = randomParticipant();

    mockGetParticipant.mockResolvedValue(participant);
    mockGetUser.mockImplementation(() => {
      throw new NotFoundError('IT IS MISSING');
    });

    await expect(getParticipantResponse(participant.id)).rejects.toThrow(
      ReferenceNotFoundError,
    );
    expect(mockGetParticipant).toHaveBeenCalledWith(participant.id);
    expect(mockGetUser).toHaveBeenCalledWith(participant.userId);
    expect(mockGetHackathon).not.toHaveBeenCalled();
  });

  test('Missing Participant', async () => {
    const id = uuid();

    mockGetParticipant.mockImplementation(() => {
      throw new NotFoundError('IT IS MISSING');
    });

    await expect(getParticipantResponse(id)).rejects.toThrow(NotFoundError);
    expect(mockGetParticipant).toHaveBeenCalledWith(id);
    expect(mockGetUser).not.toHaveBeenCalled();
    expect(mockGetHackathon).not.toHaveBeenCalled();
  });
});

describe('Get Participant List Response', () => {
  test('Happy Path', async () => {
    const hackathonId = uuid();
    const user1 = randomUser();
    const participant1 = makeParticipant({userId: user1.id} as ParticipantData);
    const user2 = randomUser();
    const participant2 = makeParticipant({userId: user2.id} as ParticipantData);
    const expected = ParticipantListResponse.from(
      [participant1, participant2],
      [user1, user2],
      hackathonId,
    );

    mockHackathonExists.mockResolvedValue(true);
    mockListParticipants.mockResolvedValue([participant1, participant2]);
    mockGetUsers.mockResolvedValue([user1, user2]);

    expect(await getParticipantListResponse(hackathonId)).toStrictEqual(
      expected,
    );
    expect(mockHackathonExists).toHaveBeenCalledWith(hackathonId);
    expect(mockGetUsers).toHaveBeenCalledWith([
      participant1.userId,
      participant2.userId,
    ]);
    expect(mockListParticipants).toHaveBeenCalledWith(hackathonId);
  });

  test('Missing Users', async () => {
    const hackathonId = uuid();
    const participant1 = randomParticipant();
    const participant2 = randomParticipant();

    mockHackathonExists.mockResolvedValue(true);
    mockListParticipants.mockResolvedValue([participant1, participant2]);
    mockGetUsers.mockImplementation(() => {
      throw new NotFoundError('FAIIIILLLUUUURE');
    });

    await expect(getParticipantListResponse(hackathonId)).rejects.toThrow(
      ReferenceNotFoundError,
    );
    expect(mockHackathonExists).toHaveBeenCalledWith(hackathonId);
    expect(mockGetUsers).toHaveBeenCalledWith([
      participant1.userId,
      participant2.userId,
    ]);
    expect(mockListParticipants).toHaveBeenCalledWith(hackathonId);
  });

  test('Missing Hackathon', async () => {
    const hackathonId = uuid();
    const participant1 = randomParticipant();
    const participant2 = randomParticipant();

    mockHackathonExists.mockResolvedValue(false);
    mockListParticipants.mockResolvedValue([participant1, participant2]);
    mockGetUsers.mockImplementation(() => {
      throw new NotFoundError('FAIIIILLLUUUURE');
    });

    await expect(getParticipantListResponse(hackathonId)).rejects.toThrow(
      NotFoundError,
    );
    expect(mockHackathonExists).toHaveBeenCalledWith(hackathonId);
    expect(mockGetUsers).not.toHaveBeenCalled();
    expect(mockListParticipants).not.toHaveBeenCalled();
  });
});

describe('Delete Participant', () => {
  test('Happy Path', async () => {
    const id = uuid();

    // mockRemoveIdeasForOwner.mockImplementation(() => {});
    mockRemoveParticipantFromIdeas.mockImplementation(() => {});

    expect(await removeParticipant(id)).toStrictEqual(
      new ParticipantDeleteResponse(id),
    );
    // expect(mockRemoveIdeasForOwner).toHaveBeenCalledWith(id);
    expect(mockRemoveParticipantFromIdeas).toHaveBeenCalledWith(id);
    expect(mockDeleteParticipant).toHaveBeenCalledWith(id);
  });

  test('Remove Participant from Ideas Fails', async () => {
    const id = uuid();

    // mockRemoveIdeasForOwner.mockImplementation(() => {});
    mockRemoveParticipantFromIdeas.mockImplementation(() => {
      throw new DeletionError('OOPS!');
    });

    await expect(removeParticipant(id)).rejects.toThrow(DeletionError);
    // expect(mockRemoveIdeasForOwner).toHaveBeenCalledWith(id);
    expect(mockRemoveParticipantFromIdeas).toHaveBeenCalledWith(id);
    expect(mockDeleteParticipant).not.toHaveBeenCalled();
  });

  // test('Remove Ideas for Owner Fails', async () => {
  //   const id = uuid();
  //
  //   mockRemoveIdeasForOwner.mockImplementation(() => {
  //     throw new DeletionError('OOPS!');
  //   });
  //   mockRemoveParticipantFromIdeas.mockImplementation(() => {});
  //
  //   await expect(removeParticipant(id)).rejects.toThrow(DeletionError);
  //   expect(mockRemoveIdeasForOwner).toHaveBeenCalledWith(id);
  //   expect(mockRemoveParticipantFromIdeas).not.toHaveBeenCalled();
  //   expect(mockDeleteParticipant).not.toHaveBeenCalled();
  // });
});

describe('Remove Participants for Hackathon', () => {
  test('Happy Path', async () => {
    const hackathonId = uuid();
    const participant1 = makeParticipant({
      hackathonId: hackathonId,
    } as ParticipantData);
    const participant2 = makeParticipant({
      hackathonId: hackathonId,
    } as ParticipantData);

    mockListParticipants.mockResolvedValue([participant1, participant2]);

    mockRemoveIdeasForOwner.mockImplementation(() => {});
    mockRemoveParticipantFromIdeas.mockImplementation(() => {});

    await removeParticipantsForHackathon(hackathonId);

    // expect(mockRemoveIdeasForOwner).toHaveBeenCalledWith(participant1.id);
    // expect(mockRemoveIdeasForOwner).toHaveBeenCalledWith(participant2.id);
    expect(mockRemoveParticipantFromIdeas).toHaveBeenCalledWith(
      participant1.id,
    );
    expect(mockRemoveParticipantFromIdeas).toHaveBeenCalledWith(
      participant2.id,
    );
    expect(mockDeleteParticipant).toHaveBeenCalledWith(participant1.id);
    expect(mockDeleteParticipant).toHaveBeenCalledWith(participant2.id);
  });
});
