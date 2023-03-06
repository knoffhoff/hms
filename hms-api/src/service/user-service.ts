/* eslint-disable require-jsdoc */

import {
  deleteUser,
  getUser,
  getUsers,
  listUsers,
  putUser,
  userExistsByEmail,
} from '../repository/user-repository';
import {getSkills, skillExists} from '../repository/skill-repository';
import Participant from '../repository/domain/Participant';
import User from '../repository/domain/User';
import Uuid from '../util/Uuid';
import Role from '../repository/domain/Role';
import ReferenceNotFoundError from '../error/ReferenceNotFoundError';
import UserResponse from '../rest/user/UserResponse';
import UserListResponse from '../rest/user/UserListResponse';
import UserDeleteResponse from '../rest/user/UserDeleteResponse';
import NotFoundError from '../error/NotFoundError';
import ValidationError from '../error/ValidationError';
import UserExistsResponse from '../rest/user/UserExistsResponse';

const ADMIN_USERS = (): string[] => {
  const adminUserString = process.env.ADMIN_USERS || '';
  return adminUserString.split(',');
};

export async function createUser(
  lastName: string,
  firstName: string,
  emailAddress: string,
  skills: Uuid[],
  imageUrl: string,
): Promise<User> {
  await verifyAllSkillsExist(skills);

  // TODO test this
  const roles = [Role.Participant] as Role[];
  if (ADMIN_USERS().includes(emailAddress)) {
    roles.push(Role.Admin);
  }

  const user = new User(
    lastName,
    firstName,
    emailAddress,
    roles,
    skills,
    imageUrl,
  );
  const result = user.validate();
  if (result.hasFailed()) {
    throw new ValidationError('Cannot create User', result);
  }

  await putUser(user);
  return user;
}

export async function getUserResponse(id: Uuid): Promise<UserResponse> {
  let user: User;
  try {
    user = await getUser(id);
  } catch (e) {
    throw new NotFoundError(
      `Cannot get User with id: ${id}, it does not exist`,
    );
  }

  let skills;
  try {
    skills = await getSkills(user.skills);
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get User with id: ${id}, ` +
        `unable to get Skills with ids: ${user.skills}`,
    );
  }

  return UserResponse.from(user, skills);
}

export async function getUserExistsResponse(
  email: string,
): Promise<UserExistsResponse> {
  let id: Uuid;
  let exists: boolean;
  try {
    ({id, exists} = await userExistsByEmail(email));
  } catch (e) {
    throw new NotFoundError(
      `Cannot get User with email: ${email}, ` +
        `unable to get User with email: ${email}`,
    );
  }

  return UserExistsResponse.from(id, email, exists);
}

export async function getUserListResponse(): Promise<UserListResponse> {
  let users: User[];
  try {
    users = await listUsers();
  } catch (e) {
    throw new NotFoundError(
      `Cannot get User list, ` + `unable to get User list`,
    );
  }

  return UserListResponse.from(users);
}

export async function editUser(
  id: Uuid,
  lastName: string,
  firstName: string,
  skills: Uuid[],
  imageUrl: string,
): Promise<void> {
  let existing: User;
  try {
    existing = await getUser(id);
    existing.lastName = lastName;
    existing.firstName = firstName;
    existing.skills = skills;
    existing.imageUrl = imageUrl;
  } catch (e) {
    throw new NotFoundError(
      `Cannot edit User with id: ${id}, it does not exist`,
    );
  }

  const result = existing.validate();
  if (result.hasFailed()) {
    throw new ValidationError(`Cannot edit User with id: ${id}`, result);
  }

  await putUser(existing);
}

export async function removeUser(id: Uuid): Promise<UserDeleteResponse> {
  let existing: User;
  try {
    existing = await getUser(id);
  } catch (e) {
    throw new NotFoundError(
      `Cannot delete User with id: ${id}, it does not exist`,
    );
  }

  await deleteUser(existing.id);

  return new UserDeleteResponse(id);
}

export async function usersFor(participants: Participant[]): Promise<User[]> {
  return await getUsers(participants.map((p) => p.userId));
}

export function extractUser(users: User[], participant: Participant): User {
  return users.find((user) => user.id === participant.userId)!;
}

async function verifyAllSkillsExist(skillIds: Uuid[]): Promise<void> {
  for (const skillId of skillIds) {
    if (!(await skillExists(skillId))) {
      throw new ReferenceNotFoundError(
        `Cannot create Idea, Skill with id: ${skillId} does not exist`,
      );
    }
  }
}
