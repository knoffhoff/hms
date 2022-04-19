/* eslint-disable require-jsdoc */

import {
  getHackathon,
  hackathonExists,
} from '../repository/hackathon-repository';
import {getUser, userExists} from '../repository/user-repository';
import {
  deleteParticipant,
  getParticipant,
  listParticipants,
  putParticipant,
} from '../repository/participant-repository';
import {usersFor} from './user-service';
import {addParticipantToHackathon} from './hackathon-service';
import Uuid from '../util/Uuid';
import Participant from '../repository/domain/Participant';
import ReferenceNotFoundError from '../error/ReferenceNotFoundError';
import ParticipantResponse from '../rest/ParticipantResponse';
import ParticipantListResponse from '../rest/ParticipantListResponse';
import ParticipantPreviewResponse from '../rest/ParticipantPreviewResponse';
import ReferenceUpdateError from '../error/ReferenceUpdateError';

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

  try {
    await addParticipantToHackathon(participant.hackathonId, participant.id);
  } catch (e) {
    await deleteParticipant(participant.id);
    throw new ReferenceUpdateError(`Failed to create Idea, ` +
        `failed to add Participant to linked Hackathon ` +
        `with id ${participant.hackathonId}`);
  }

  return participant;
}

export async function getParticipantResponse(
    id: Uuid,
): Promise<ParticipantResponse> {
  const participant = await getParticipant(id);

  let user;
  try {
    user = await getUser(participant.userId);
  } catch (e) {
    throw new ReferenceNotFoundError(`Cannot get Participant with id ${id}, ` +
        `unable to get User with id ${participant.userId}`);
  }

  let hackathon;
  try {
    hackathon = await getHackathon(participant.hackathonId);
  } catch (e) {
    throw new ReferenceNotFoundError(`Cannot get Participant with id ${id}, ` +
        `unable to get Hackathon with id ${participant.hackathonId}`);
  }

  return ParticipantResponse.from(participant, user, hackathon);
}

export async function getParticipantListResponse(
    hackathonId: Uuid,
): Promise<ParticipantListResponse> {
  const participants = await listParticipants(hackathonId);

  let users;
  try {
    users = await usersFor(participants);
  } catch (e) {
    throw new ReferenceNotFoundError(
        `Could not list Participants for Hackathon with id: ${hackathonId}, ` +
        `unable to list referenced Users`);
  }

  return new ParticipantListResponse(
      ParticipantPreviewResponse.fromArray(participants, users),
      hackathonId,
  );
}

export async function removeParticipant(id: Uuid) {
  await deleteParticipant(id);
}
