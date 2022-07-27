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
import Uuid from '../util/Uuid';
import Participant from '../repository/domain/Participant';
import ReferenceNotFoundError from '../error/ReferenceNotFoundError';
import ParticipantResponse from '../rest/ParticipantResponse';
import ParticipantListResponse from '../rest/ParticipantListResponse';
import ParticipantPreviewResponse from '../rest/ParticipantPreviewResponse';
import ParticipantDeleteResponse from '../rest/ParticipantDeleteResponse';
import {removeIdeasForOwner, removeParticipantFromIdeas} from './idea-service';
import DeletionError from '../error/DeletionError';
import NotFoundError from '../error/NotFoundError';
import ValidationError from '../error/ValidationError';

export async function createParticipant(
  userId: Uuid,
  hackathonId: Uuid,
): Promise<Participant> {
  if (!(await hackathonExists(hackathonId))) {
    throw new ReferenceNotFoundError(
      `Cannot create Participant, ` +
        `Hackathon with id: ${hackathonId} does not exist`,
    );
  } else if (!(await userExists(userId))) {
    throw new ReferenceNotFoundError(
      `Cannot create Participant, ` + `User with id: ${userId} does not exist`,
    );
  }

  const participant = new Participant(userId, hackathonId);
  const result = participant.validate();
  if (result.hasFailed()) {
    throw new ValidationError('Cannot create Participant', result);
  }

  await putParticipant(participant);

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
    throw new ReferenceNotFoundError(
      `Cannot get Participant with id ${id}, ` +
        `unable to get User with id ${participant.userId}`,
    );
  }

  let hackathon;
  try {
    hackathon = await getHackathon(participant.hackathonId);
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get Participant with id ${id}, ` +
        `unable to get Hackathon with id ${participant.hackathonId}`,
    );
  }

  return ParticipantResponse.from(participant, user, hackathon);
}

export async function getParticipantListResponse(
  hackathonId: Uuid,
): Promise<ParticipantListResponse> {
  if (!(await hackathonExists(hackathonId))) {
    throw new NotFoundError(
      `Cannot list Participants for Hackathon with id: ${hackathonId}, ` +
        `it does not exist`,
    );
  }

  const participants = await listParticipants(hackathonId);

  let users;
  try {
    users = await usersFor(participants);
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Could not list Participants for Hackathon with id: ${hackathonId}, ` +
        `unable to list linked Users`,
    );
  }

  return new ParticipantListResponse(
    ParticipantPreviewResponse.fromArray(participants, users),
    hackathonId,
  );
}

export async function removeParticipant(
  id: Uuid,
): Promise<ParticipantDeleteResponse> {
  try {
    await removeIdeasForOwner(id);
    await removeParticipantFromIdeas(id);
  } catch (e) {
    throw new DeletionError(
      `Unable to remove Participant with id ${id}, ` +
        `nested failure is: ${e.message}`,
    );
  }

  await deleteParticipant(id);
  return new ParticipantDeleteResponse(id);
}

export async function removeParticipantsForHackathon(
  hackathonId: Uuid,
): Promise<void> {
  const participants = await listParticipants(hackathonId);
  for (const participant of participants) {
    await removeParticipant(participant.id);
  }
}
