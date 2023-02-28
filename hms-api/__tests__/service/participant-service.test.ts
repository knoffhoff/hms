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
import ParticipantResponse from '../../src/rest/participant/ParticipantResponse';
import ParticipantListResponse from '../../src/rest/participant/ParticipantListResponse';
import NotFoundError from '../../src/error/NotFoundError';
import ReferenceNotFoundError from '../../src/error/ReferenceNotFoundError';
import DeletionError from '../../src/error/DeletionError';
import ParticipantDeleteResponse from '../../src/rest/participant/ParticipantDeleteResponse';
import * as participantRepository from '../../src/repository/participant-repository';
import * as hackathonRepository from '../../src/repository/hackathon-repository';
import * as userRepository from '../../src/repository/user-repository';
import * as ideaService from '../../src/service/idea-service';
import ValidationError from '../../src/error/ValidationError';

const mockPutParticipant = jest
  .spyOn(participantRepository, 'putParticipant')
  .mockImplementation();
const mockGetParticipant = jest
  .spyOn(participantRepository, 'getParticipant')
  .mockImplementation();
const mockListParticipants = jest
  .spyOn(participantRepository, 'listParticipants')
  .mockImplementation();
const mockDeleteParticipant = jest
  .spyOn(participantRepository, 'deleteParticipant')
  .mockImplementation();

const mockGetHackathon = jest
  .spyOn(hackathonRepository, 'getHackathon')
  .mockImplementation();
const mockHackathonExists = jest
  .spyOn(hackathonRepository, 'hackathonExists')
  .mockImplementation();

const mockGetUser = jest.spyOn(userRepository, 'getUser').mockImplementation();
const mockGetUsers = jest
  .spyOn(userRepository, 'getUsers')
  .mockImplementation();
const mockUserExists = jest
  .spyOn(userRepository, 'userExists')
  .mockImplementation();

const mockRemoveIdeasForOwner = jest
  .spyOn(ideaService, 'removeIdeasForOwner')
  .mockImplementation();
const mockRemoveParticipantFromIdeas = jest
  .spyOn(ideaService, 'removeParticipantFromIdeas')
  .mockImplementation();

describe('Create Participant', () => {
  test('Happy Path', async () => {
    mockHackathonExists.mockResolvedValueOnce(true);
    mockUserExists.mockResolvedValueOnce(true);

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
  });

  test('Validation Error', async () => {
    mockHackathonExists.mockResolvedValueOnce(true);
    mockUserExists.mockResolvedValueOnce(true);

    await expect(createParticipant(null, uuid())).rejects.toThrow(
      ValidationError,
    );
  });

  test('Missing Hackathon', async () => {
    mockHackathonExists.mockResolvedValueOnce(false);

    await expect(createParticipant(uuid(), uuid())).rejects.toThrow(
      ReferenceNotFoundError,
    );

    expect(mockPutParticipant).not.toHaveBeenCalled();
  });

  test('Missing User', async () => {
    mockUserExists.mockResolvedValueOnce(false);

    await expect(createParticipant(uuid(), uuid())).rejects.toThrow(
      ReferenceNotFoundError,
    );

    expect(mockPutParticipant).not.toHaveBeenCalled();
  });
});

describe('Get Participant Response', () => {
  test('Happy Path', async () => {
    const user = randomUser();
    const participant = makeParticipant({userId: user.id} as ParticipantData);
    const hackathon = randomHackathon();

    const expected = ParticipantResponse.from(participant, user, hackathon);

    mockGetParticipant.mockResolvedValueOnce(participant);
    mockGetUser.mockResolvedValueOnce(user);
    mockGetHackathon.mockResolvedValueOnce(hackathon);

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

    mockGetParticipant.mockResolvedValueOnce(participant);
    mockGetUser.mockResolvedValueOnce(user);
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

    mockGetParticipant.mockResolvedValueOnce(participant);
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

    mockHackathonExists.mockResolvedValueOnce(true);
    mockListParticipants.mockResolvedValueOnce([participant1, participant2]);
    mockGetUsers.mockResolvedValueOnce([user1, user2]);

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

    mockHackathonExists.mockResolvedValueOnce(true);
    mockListParticipants.mockResolvedValueOnce([participant1, participant2]);
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

    mockHackathonExists.mockResolvedValueOnce(false);
    mockListParticipants.mockResolvedValueOnce([participant1, participant2]);

    await expect(getParticipantListResponse(hackathonId)).rejects.toThrow(
      NotFoundError,
    );
    expect(mockHackathonExists).toHaveBeenCalledWith(hackathonId);
    expect(mockListParticipants).not.toHaveBeenCalled();
    mockListParticipants.mockReset();
  });
});

describe('Delete Participant', () => {
  test('Happy Path', async () => {
    const id = uuid();

    mockRemoveIdeasForOwner.mockImplementation();
    mockRemoveParticipantFromIdeas.mockImplementation();

    expect(await removeParticipant(id)).toStrictEqual(
      new ParticipantDeleteResponse(id),
    );
    expect(mockRemoveIdeasForOwner).toHaveBeenCalledWith(id);
    expect(mockRemoveParticipantFromIdeas).toHaveBeenCalledWith(id);
    expect(mockDeleteParticipant).toHaveBeenCalledWith(id);
  });

  test('Remove Participant from Ideas Fails', async () => {
    const id = uuid();

    mockRemoveIdeasForOwner.mockImplementation();
    mockRemoveParticipantFromIdeas.mockImplementation(() => {
      throw new DeletionError('OOPS!');
    });

    await expect(removeParticipant(id)).rejects.toThrow(DeletionError);
    expect(mockRemoveIdeasForOwner).toHaveBeenCalledWith(id);
    expect(mockRemoveParticipantFromIdeas).toHaveBeenCalledWith(id);
    expect(mockDeleteParticipant).not.toHaveBeenCalled();
  });

  test('Remove Ideas for Owner Fails', async () => {
    const id = uuid();

    mockRemoveIdeasForOwner.mockImplementation(() => {
      throw new DeletionError('OOPS!');
    });
    mockRemoveParticipantFromIdeas.mockImplementation();

    await expect(removeParticipant(id)).rejects.toThrow(DeletionError);
    expect(mockRemoveIdeasForOwner).toHaveBeenCalledWith(id);
    expect(mockRemoveParticipantFromIdeas).not.toHaveBeenCalled();
    expect(mockDeleteParticipant).not.toHaveBeenCalled();
  });
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

    mockListParticipants.mockResolvedValueOnce([participant1, participant2]);

    mockRemoveIdeasForOwner.mockImplementation();
    mockRemoveParticipantFromIdeas.mockImplementation();

    await removeParticipantsForHackathon(hackathonId);

    expect(mockRemoveIdeasForOwner).toHaveBeenCalledWith(participant1.id);
    expect(mockRemoveIdeasForOwner).toHaveBeenCalledWith(participant2.id);
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
