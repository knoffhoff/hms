/* eslint-disable require-jsdoc */

import {
  deleteUser,
  getUser,
  getUsers,
  listUsers,
  putUser,
} from '../repository/user-repository';
import {getSkills, skillExists} from '../repository/skill-repository';
import Participant from '../repository/domain/Participant';
import User from '../repository/domain/User';
import Uuid from '../util/Uuid';
import Role from '../repository/domain/Role';
import ReferenceNotFoundError from '../error/ReferenceNotFoundError';
import UserResponse from '../rest/UserResponse';
import UserListResponse from '../rest/UserListResponse';
import UserDeleteResponse from '../rest/UserDeleteResponse';

export async function createUser(
    lastName: string,
    firstName: string,
    emailAddress: string,
    roles: Role[],
    skills: Uuid[],
    imageUrl: string,
): Promise<User> {
  await verifyAllSkillsExist(skills);

  const user = new User(
      lastName,
      firstName,
      emailAddress,
      roles,
      skills,
      imageUrl,
  );
  await putUser(user);
  return user;
}

export async function getUserResponse(id: Uuid): Promise<UserResponse> {
  const user = await getUser(id);

  let skills;
  try {
    skills = await getSkills(user.skills);
  } catch (e) {
    throw new ReferenceNotFoundError(`Cannot get User with id: ${id}, ` +
        `unable to get Skills with ids: ${user.skills}`);
  }

  return UserResponse.from(user, skills);
}

export async function getUserListResponse(): Promise<UserListResponse> {
  const users = await listUsers();
  return UserListResponse.from(users);
}

export async function removeUser(id: Uuid): Promise<UserDeleteResponse> {
  await deleteUser(id);
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
    if (!await skillExists(skillId)) {
      throw new ReferenceNotFoundError(`Cannot create Idea, ` +
          `Skill with id: ${skillId} does not exist`);
    }
  }
}
