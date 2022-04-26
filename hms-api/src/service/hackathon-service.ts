/* eslint-disable require-jsdoc */

import {
  deleteHackathon,
  getHackathon,
  listHackathons,
  putHackathon,
} from '../repository/hackathon-repository';
import {listParticipants} from '../repository/participant-repository';
import {usersFor} from './user-service';
import {listCategories} from '../repository/category-repository';
import {listIdeasForHackathon} from '../repository/idea-repository';
import Uuid from '../util/Uuid';
import Hackathon from '../repository/domain/Hackathon';
import HackathonResponse from '../rest/HackathonResponse';
import ReferenceNotFoundError from '../error/ReferenceNotFoundError';
import HackathonListResponse from '../rest/HackathonListResponse';
import HackathonDeleteResponse from '../rest/HackathonDeleteResponse';
import InvalidStateError from '../error/InvalidStateError';

export async function createHackathon(
    title: string,
    startDate: Date,
    endDate: Date,
): Promise<Hackathon> {
  if (endDate <= startDate) {
    throw new InvalidStateError(`Cannot create hackathon, ` +
        `startDate (${startDate}) is after endDate (${endDate})`);
  }

  const hackathon = new Hackathon(title, startDate, endDate);

  await putHackathon(hackathon);

  return hackathon;
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
    ideas = await listIdeasForHackathon(id);
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

export async function getHackathonListResponse(): Promise<HackathonListResponse> {
  const hackathons = await listHackathons();
  return HackathonListResponse.from(hackathons);
}

export async function removeHackathon(
    id: Uuid,
): Promise<HackathonDeleteResponse> {
  await deleteHackathon(id);
  return new HackathonDeleteResponse(id);
}
