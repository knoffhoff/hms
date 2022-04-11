/* eslint-disable require-jsdoc */

import Participant from '../repository/domain/Participant';
import User from '../repository/domain/User';
import {getUsers} from '../repository/user-repository';

export async function usersFor(participants: Participant[]): Promise<User[]> {
  return await getUsers(participants.map((p) => p.userId));
}
