import {mockDate} from '../util/date-mock';
import {mockUuid} from '../util/uuids-mock';

import {
  createParticipant,
  removeParticipant,
} from '../../src/service/participant-service';
import {uuid} from '../../src/util/Uuid';
import ReferenceNotFoundError
  from '../../src/repository/error/ReferenceNotFoundError';
import {randomParticipant} from '../repository/domain/participant-maker';

import * as participantRepository
  from '../../src/repository/participant-repository';
import * as hackathonRepository
  from '../../src/repository/hackathon-repository';
import * as userRepository from '../../src/repository/user-repository';

const mockPutParticipant = jest.fn();
jest.spyOn(participantRepository, 'putParticipant')
    .mockImplementation(mockPutParticipant);

const mockDeleteParticipant = jest.fn();
jest.spyOn(participantRepository, 'deleteParticipant')
    .mockImplementation(mockDeleteParticipant);

const mockHackathonExists = jest.fn();
jest.spyOn(hackathonRepository, 'hackathonExists')
    .mockImplementation(mockHackathonExists);

const mockUserExists = jest.fn();
jest.spyOn(userRepository, 'userExists')
    .mockImplementation(mockUserExists);

describe('Create Participant', () => {
  test('Missing Hackathon', async () => {
    mockHackathonExists.mockResolvedValue(false);
    mockUserExists.mockResolvedValue(true);

    await expect(createParticipant(uuid(), uuid()))
        .rejects
        .toThrow(ReferenceNotFoundError);

    expect(mockPutParticipant).not.toHaveBeenCalled();
  });

  test('Missing User', async () => {
    mockHackathonExists.mockResolvedValue(true);
    mockUserExists.mockResolvedValue(false);

    await expect(createParticipant(uuid(), uuid()))
        .rejects
        .toThrow(ReferenceNotFoundError);

    expect(mockPutParticipant).not.toHaveBeenCalled();
  });

  test('Happy Path', async () => {
    mockDate();

    mockHackathonExists.mockResolvedValue(true);
    mockUserExists.mockResolvedValue(true);

    const expected = randomParticipant();
    mockUuid(expected.id);

    expect(await createParticipant(expected.userId, expected.hackathonId))
        .toStrictEqual(expected);

    expect(mockPutParticipant).toHaveBeenCalledWith(expected);
  });
});

describe('Delete Participant', () => {
  test('Happy Path', async () => {
    const id = uuid();
    await removeParticipant(id);
    expect(mockDeleteParticipant).toHaveBeenCalledWith(id);
  });
});

