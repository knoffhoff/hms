import {mockPut, mockSend} from '../repository/dynamo-db-mock';
import {mockDate} from '../util/date-mock';
import {mockUuid} from '../util/uuids-mock';

import {createParticipant} from '../../src/service/participant-service';
import {uuid} from '../../src/util/uuids';
import ReferenceNotFoundError
  from '../../src/repository/error/ReferenceNotFoundError';
import {randomParticipant} from '../repository/domain/participant-maker';

import * as hackathonRepository
  from '../../src/repository/hackathon-repository';
import * as userRepository from '../../src/repository/user-repository';

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
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('Missing User', async () => {
    mockHackathonExists.mockResolvedValue(true);
    mockUserExists.mockResolvedValue(false);

    await expect(createParticipant(uuid(), uuid()))
        .rejects
        .toThrow(ReferenceNotFoundError);
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('Happy Path', async () => {
    mockPut();
    mockDate();

    mockHackathonExists.mockResolvedValue(true);
    mockUserExists.mockResolvedValue(true);

    const expected = randomParticipant();
    mockUuid(expected.id);

    expect(await createParticipant(expected.userId, expected.hackathonId))
        .toStrictEqual(expected);
  });
});
