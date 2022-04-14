/* eslint-disable require-jsdoc */

import {hackathonExists} from '../repository/hackathon-repository';
import {userExists} from '../repository/user-repository';
import {putParticipant} from '../repository/participant-repository';
import {Uuid} from '../util/uuids';
import Participant from '../repository/domain/Participant';
import ReferenceNotFoundError from '../repository/error/ReferenceNotFoundError';

export async function createParticipant(
    userId: Uuid,
    hackathonId: Uuid,
): Promise<Participant> {
  if (!await hackathonExists(hackathonId)) {
    throw new ReferenceNotFoundError(`Cannot create Participant, ` +
        `Hackathon with id: ${hackathonId} does not exist`);
  } else if (!await userExists(userId)) {
    throw new ReferenceNotFoundError(`Cannot create Participant, ` +
        `User with id: ${userId} does not exist`);
  }

  const participant = new Participant(userId, hackathonId);

  await putParticipant(participant);

  return participant;
}
