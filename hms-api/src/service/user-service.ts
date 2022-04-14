/* eslint-disable require-jsdoc */

import Participant from '../repository/domain/Participant';
import User from '../repository/domain/User';
import {getUsers, putUser} from '../repository/user-repository';
import {Uuid} from '../util/uuids';
import {Role} from '../repository/domain/Role';
import {skillExists} from '../repository/skill-repository';
import ReferenceNotFoundError from '../repository/error/ReferenceNotFoundError';

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
