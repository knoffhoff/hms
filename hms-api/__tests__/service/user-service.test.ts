import {
  createUser,
  editUser,
  extractUser,
  getUserExistsResponse,
  getUserListResponse,
  getUserResponse,
  removeUser,
  usersFor,
} from '../../src/service/user-service';
import {uuid} from '../../src/util/Uuid';
import {makeUser, randomUser, UserData} from '../repository/domain/user-maker';
import {makeParticipant, ParticipantData, randomParticipant,} from '../repository/domain/participant-maker';
import ReferenceNotFoundError from '../../src/error/ReferenceNotFoundError';

import * as skillRepository from '../../src/repository/skill-repository';
import * as userRepository from '../../src/repository/user-repository';
import {randomSkill} from '../repository/domain/skill-maker';
import NotFoundError from '../../src/error/NotFoundError';
import UserResponse from '../../src/rest/UserResponse';
import UserListResponse from '../../src/rest/UserListResponse';
import UserDeleteResponse from '../../src/rest/UserDeleteResponse';
import User from '../../src/repository/domain/User';
import ValidationResult from '../../src/error/ValidationResult';
import {randomCategory} from '../repository/domain/category-maker';
import ValidationError from '../../src/error/ValidationError';
import UserExistsResponse from '../../src/rest/UserExistsResponse';

const mockGetSkills = jest.fn();
jest.spyOn(skillRepository, 'getSkills')
    .mockImplementation(mockGetSkills);
const mockSkillExists = jest.fn();
jest.spyOn(skillRepository, 'skillExists')
    .mockImplementation(mockSkillExists);

const mockPutUser = jest.fn();
jest.spyOn(userRepository, 'putUser')
    .mockImplementation(mockPutUser);
const mockGetUser = jest.fn();
jest.spyOn(userRepository, 'getUser')
    .mockImplementation(mockGetUser);
const mockGetUsers = jest.fn();
jest.spyOn(userRepository, 'getUsers')
    .mockImplementation(mockGetUsers);
const mockUserExistsByEmail = jest.fn();
jest.spyOn(userRepository, 'userExistsByEmail')
    .mockImplementation(mockUserExistsByEmail);
const mockListUsers = jest.fn();
jest.spyOn(userRepository, 'listUsers')
    .mockImplementation(mockListUsers);
const mockDeleteUser = jest.fn();
jest.spyOn(userRepository, 'deleteUser')
    .mockImplementation(mockDeleteUser);

describe('Create User', () => {
  test('Validation Error', async () => {
    mockSkillExists.mockResolvedValue(true);

    await expect(
        createUser(
            'lastNaaaaaame',
            '',
            'e.m@i.l',
            [uuid()],
            'image.url'))
        .rejects
        .toThrow(ValidationError);
  });

  test('Missing Skill', async () => {
    mockSkillExists.mockResolvedValue(false);

    await expect(createUser(
        'lastName',
        'firstName',
        'em@il.com',
        [uuid()],
        'https://image.jpg/img.png'))
        .rejects
        .toThrow(ReferenceNotFoundError);

    expect(mockPutUser).not.toHaveBeenCalled();
  });

  test('Happy Path', async () => {
    mockSkillExists.mockResolvedValue(true);

    const expected = randomUser();

    expect(await createUser(
        expected.lastName,
        expected.firstName,
        expected.emailAddress,
        expected.skills,
        expected.imageUrl))
        .toEqual(expect.objectContaining({
          lastName: expected.lastName,
          firstName: expected.firstName,
          emailAddress: expected.emailAddress,
          skills: expected.skills,
          imageUrl: expected.imageUrl,
        }));

    expect(mockPutUser).toHaveBeenCalledWith(expect.objectContaining({
      lastName: expected.lastName,
      firstName: expected.firstName,
      emailAddress: expected.emailAddress,
      skills: expected.skills,
      imageUrl: expected.imageUrl,
    }));
  });
});

describe('Edit User', () => {
  test('Happy Path', async () => {
    const oldUser = randomUser();
    const lastName = 'Nach';
    const firstName = 'Vor';
    const skills = [uuid(), uuid()];
    const imageUrl = 'www.a.new.image.com/img.png';
    const expected = new User(
        lastName,
        firstName,
        oldUser.emailAddress,
        oldUser.roles,
        skills,
        imageUrl,
        oldUser.id,
        oldUser.creationDate);

    mockGetUser.mockResolvedValue(oldUser);

    await editUser(oldUser.id, lastName, firstName, skills, imageUrl);

    expect(mockPutUser).toHaveBeenCalledWith(expected);
  });

  test('Validation Error', async () => {
    const failedValidation = new ValidationResult();
    failedValidation.addFailure('FAILURE');

    const mockUser = randomCategory();
    jest.spyOn(mockUser, 'validate')
        .mockReturnValue(failedValidation);
    mockGetUser.mockResolvedValue(mockUser);

    await expect(
        editUser(
            uuid(),
            'lastNaaaaaame',
            'fiiiiiiirstName',
            [uuid()],
            'image.url'))
        .rejects
        .toThrow(ValidationError);
  });

  test('User is missing', async () => {
    const id = uuid();

    mockGetUser.mockImplementation(() => {
      throw new Error('Uh oh');
    });

    await expect(editUser(
        id,
        'Nach',
        'Vor',
        [uuid()],
        'www.aol.com/img.png'))
        .rejects
        .toThrow(NotFoundError);
    expect(mockPutUser).not.toHaveBeenCalled();
    expect(mockGetUser).toHaveBeenCalledWith(id);
  });
});

describe('Get User Response', () => {
  test('Happy Path', async () => {
    const user = randomUser();
    const skill1 = randomSkill();
    const skill2 = randomSkill();
    const skill3 = randomSkill();

    const expected = UserResponse.from(user, [skill1, skill2, skill3]);

    mockGetUser.mockResolvedValue(user);
    mockGetSkills.mockResolvedValue([skill1, skill2, skill3]);

    expect(await getUserResponse(user.id))
        .toStrictEqual(expected);
    expect(mockGetUser).toHaveBeenCalledWith(user.id);
    expect(mockGetSkills).toHaveBeenCalledWith(user.skills);
  });

  test('Missing Skills', async () => {
    const user = randomUser();

    mockGetUser.mockResolvedValue(user);
    mockGetSkills.mockImplementation(() => {
      throw new NotFoundError('Not a chance');
    });

    await expect(getUserResponse(user.id))
        .rejects
        .toThrow(ReferenceNotFoundError);
    expect(mockGetUser).toHaveBeenCalledWith(user.id);
    expect(mockGetSkills).toHaveBeenCalledWith(user.skills);
  });

  test('Missing User', async () => {
    const id = uuid();

    mockGetUser.mockImplementation(() => {
      throw new NotFoundError('Not a chance');
    });

    await expect(getUserResponse(id))
        .rejects
        .toThrow(NotFoundError);
    expect(mockGetUser).toHaveBeenCalledWith(id);
    expect(mockGetSkills).not.toHaveBeenCalled();
  });
});

describe('Get User Exists Response', () => {
  test('User Exists', async () => {
    const id = uuid()
    const email = 'eee.mmm@iii.ll';
    const expected = UserExistsResponse.from(id, email, true);

    mockUserExistsByEmail.mockResolvedValue({id: id, exists: true});

    expect(await getUserExistsResponse(email))
        .toStrictEqual(expected);
    expect(mockUserExistsByEmail).toHaveBeenCalledWith(email);
  });

  test('User Does Not Exist', async () => {
    const id = uuid()
    const email = 'eee.mmm@iii.ll';
    const expected = UserExistsResponse.from(id, email, false);

    mockUserExistsByEmail.mockResolvedValue({id: id, exists: false});

    expect(await getUserExistsResponse(email))
        .toStrictEqual(expected);
    expect(mockUserExistsByEmail).toHaveBeenCalledWith(email);
  });
});

describe('Get User List Response', () => {
  test('Happy Path', async () => {
    const user1 = randomUser();
    const user2 = randomUser();
    const user3 = randomUser();
    const expected = UserListResponse.from(
        [user1, user2, user3],
    );

    mockListUsers.mockResolvedValue([user1, user2, user3]);

    expect(await getUserListResponse()).toStrictEqual(expected);
    expect(mockListUsers).toHaveBeenCalled();
  });
});

describe('Extract User For Participant', () => {
  test('When user not in list', () => {
    const participant = randomParticipant();

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

describe('Users For', () => {
  test('Happy path', async () => {
    const userId1 = uuid();
    const participant1 = makeParticipant({userId: userId1} as ParticipantData);
    const user1 = makeUser({id: userId1} as UserData);

    const userId2 = uuid();
    const participant2 = makeParticipant({userId: userId2} as ParticipantData);
    const user2 = makeUser({id: userId2} as UserData);

    const userId3 = uuid();
    const participant3 = makeParticipant({userId: userId3} as ParticipantData);
    const user3 = makeUser({id: userId3} as UserData);

    mockGetUsers.mockResolvedValue([user1, user2, user3]);

    const users = await usersFor([participant1, participant2, participant3]);

    expect(mockGetUsers).toHaveBeenCalledWith([userId1, userId2, userId3]);
    expect(users).toStrictEqual([user1, user2, user3]);
  });
});

describe('Delete User', () => {
  test('Happy Path', async () => {
    const id = uuid();
    expect(await removeUser(id)).toStrictEqual(new UserDeleteResponse(id));
    expect(mockDeleteUser).toHaveBeenCalledWith(id);
  });
});
