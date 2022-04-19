/* eslint-disable require-jsdoc */

import {
  appendCategoryId,
  appendIdeaId,
  appendParticipantId,
  deleteHackathon,
  getHackathon,
  listHackathons,
  putHackathon,
} from '../repository/hackathon-repository';
import {listParticipants} from '../repository/participant-repository';
import {usersFor} from './user-service';
import {listCategories} from '../repository/category-repository';
import {listIdeas} from '../repository/idea-repository';
import Uuid from '../util/Uuid';
import Hackathon from '../repository/domain/Hackathon';
import HackathonResponse from '../rest/HackathonResponse';
import ReferenceNotFoundError from '../error/ReferenceNotFoundError';
import HackathonListResponse from '../rest/HackathonListResponse';

export async function createHackathon(
    title: string,
    startDate: Date,
    endDate: Date,
): Promise<Hackathon> {
  const hackathon = new Hackathon(title, startDate, endDate);

  await putHackathon(hackathon);

  return hackathon;
}

export async function addParticipantToHackathon(
    hackathonId: Uuid,
    participantId: Uuid,
) {
  await appendParticipantId(hackathonId, participantId);
}

export async function addCategoryToHackathon(
    hackathonId: Uuid,
    categoryId: Uuid,
) {
  await appendCategoryId(hackathonId, categoryId);
}

export async function addIdeaToHackathon(hackathonId: Uuid, ideaId: Uuid) {
  await appendIdeaId(hackathonId, ideaId);
}

export async function getHackathonResponse(
    id: Uuid,
): Promise<HackathonResponse> {
  let participants;
  try {
    participants = await listParticipants(id);
  } catch (e) {
    throw new ReferenceNotFoundError(`Cannot get Hackathon with id: ${id}, ` +
        `unable to list Participants`);
  }

  let users;
  try {
    users = await usersFor(participants);
  } catch (e) {
    throw new ReferenceNotFoundError(`Cannot get Hackathon with id: ${id}, ` +
        `unable to find Users for Participants ` +
        `${participants.map((p) => p.id)}`);
  }

  let categories;
  try {
    categories = await listCategories(id);
  } catch (e) {
    throw new ReferenceNotFoundError(`Cannot get Hackathon with id: ${id}, ` +
        `unable to list Categories`);
  }

  let ideas;
  try {
    ideas = await listIdeas(id);
  } catch (e) {
    throw new ReferenceNotFoundError(`Cannot get Hackathon with id: ${id}, ` +
        `unable to list Ideas`);
  }

  const hackathon = await getHackathon(id);
  return HackathonResponse.from(
      hackathon,
      participants,
      users,
      categories,
      ideas,
  );
}

export async function getHackathonListResponse(
): Promise<HackathonListResponse> {
  const hackathons = await listHackathons();
  return HackathonListResponse.from(hackathons);
}

export async function removeHackathon(id: Uuid) {
  await deleteHackathon(id);
}
