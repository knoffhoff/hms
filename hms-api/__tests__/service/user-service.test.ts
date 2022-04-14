import {mockSend} from '../repository/dynamo-db-mock';
import {createUser, extractUser} from '../../src/service/user-service';
import Participant from '../../src/repository/domain/Participant';
import {uuid} from '../../src/util/uuids';
import {makeUser, randomUser, UserData} from '../repository/domain/user-maker';
import {
  makeParticipant,
  ParticipantData,
} from '../repository/domain/participant-maker';
import ReferenceNotFoundError
  from '../../src/repository/error/ReferenceNotFoundError';
import {Role} from '../../src/repository/domain/Role';

import * as skillRepository from '../../src/repository/skill-repository';
import {mockDate} from '../util/date-mock';
import {mockUuid} from '../util/uuids-mock';

const mockSkillExists = jest.fn();
jest.spyOn(skillRepository, 'skillExists')
    .mockImplementation(mockSkillExists);

describe('Create Idea', () => {
  test('Missing Skill', async () => {
    mockSkillExists.mockResolvedValue(false);

    await expect(createUser(
        'lastName',
        'firstName',
        'em@il.com',
        [Role.Admin],
        [uuid()],
        'https://image.jpg/img.png'))
        .rejects
        .toThrow(ReferenceNotFoundError);
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('Happy Path', async () => {
    mockDate();
    mockSkillExists.mockResolvedValue(true);

    const expected = randomUser();
    mockUuid(expected.id);

    expect(await createUser(
        expected.lastName,
        expected.firstName,
        expected.emailAddress,
        expected.roles,
        expected.skills,
        expected.imageUrl))
        .toStrictEqual(expected);
  });
});

describe('Extract User For Participant', () => {
  test('When user not in list', () => {
    const participant = new Participant(uuid(), uuid());

    expect(extractUser([], participant)).toBeUndefined();
  });

  test('When user in singleton list', () => {
    const user = makeUser({} as UserData);
    const participant = makeParticipant({userId: user.id} as ParticipantData);

    expect(extractUser([user], participant)).toStrictEqual(user);
  });

  test('When user in list', () => {
    const user = makeUser({} as UserData);
    const participant = makeParticipant({userId: user.id} as ParticipantData);

    expect(extractUser(
        [randomUser(), user, randomUser()],
        participant,
    )).toStrictEqual(user);
  });
});
