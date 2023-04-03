/* eslint-disable require-jsdoc */

import {
  deleteHackathon,
  getHackathon,
  hackathonSlugExists,
  listHackathons,
  putHackathon,
} from '../repository/hackathon-repository';
import {listParticipants} from '../repository/participant-repository';
import {usersFor} from './user-service';
import {listCategories} from '../repository/category-repository';
import {listIdeasForHackathon} from '../repository/idea-repository';
import Uuid from '../util/Uuid';
import Hackathon from '../repository/domain/Hackathon';
import HackathonResponse from '../rest/hackathon/HackathonResponse';
import ReferenceNotFoundError from '../error/ReferenceNotFoundError';
import HackathonListResponse from '../rest/hackathon/HackathonListResponse';
import HackathonDeleteResponse from '../rest/hackathon/HackathonDeleteResponse';
import NotFoundError from '../error/NotFoundError';
import {removeIdeasForHackathon} from './idea-service';
import DeletionError from '../error/DeletionError';
import {createCategory, removeCategoriesForHackathon} from './category-service';
import {removeParticipantsForHackathon} from './participant-service';
import ValidationError from '../error/ValidationError';
import InvalidStateError from '../error/InvalidStateError';

export async function createHackathon(
  title: string,
  description: string,
  slug: string,
  startDate: Date,
  endDate: Date,
): Promise<Hackathon> {
  const hackathon = new Hackathon(title, description, slug, startDate, endDate);
  const result = hackathon.validate();
  if (result.hasFailed()) {
    throw new ValidationError(`Cannot create Hackathon`, result);
  }

  if (await hackathonSlugExists(hackathon.slug)) {
    throw new InvalidStateError('Cannot create Hackathon, slug already exists');
  }

  await putHackathon(hackathon);

  // Auto create a category for the hackathon to make sure that there is at least one category to submit ideas to
  await createCategory('General', 'General', hackathon.id);

  return hackathon;
}

export async function getHackathonResponse(
  id: Uuid,
): Promise<HackathonResponse> {
  let participants;
  try {
    participants = await listParticipants(id);
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get Hackathon with id: ${id}, unable to list Participants`,
    );
  }

  let users;
  try {
    users = await usersFor(participants);
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get Hackathon with id: ${id}, ` +
        `unable to find Users for Participants ` +
        `${participants.map((p) => p.id)}`,
    );
  }

  let categories;
  try {
    categories = await listCategories(id);
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get Hackathon with id: ${id}, unable to list Categories`,
    );
  }

  let ideas;
  try {
    ideas = await listIdeasForHackathon(id);
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get Hackathon with id: ${id}, unable to list Ideas`,
    );
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

export async function editHackathon(
  id: Uuid,
  title: string,
  description: string,
  slug: string,
  startDate: Date,
  endDate: Date,
  votingOpened: boolean,
): Promise<void> {
  let existing: Hackathon;
  try {
    existing = await getHackathon(id);
    existing.title = title;
    existing.description = description;
    existing.slug = slug;
    existing.startDate = startDate;
    existing.endDate = endDate;
    existing.votingOpened = votingOpened;
  } catch (e) {
    throw new NotFoundError(
      `Cannot edit Hackathon with id: ${id}, it does not exist`,
    );
  }

  const result = existing.validate();
  if (result.hasFailed()) {
    throw new ValidationError(
      `Cannot edit Hackathon with id: ${id} because `,
      result,
    );
  }

  await putHackathon(existing);
}

export async function removeHackathon(
  id: Uuid,
): Promise<HackathonDeleteResponse> {
  try {
    await removeIdeasForHackathon(id);
    await removeCategoriesForHackathon(id);
    await removeParticipantsForHackathon(id);
  } catch (e) {
    throw new DeletionError(
      `Unable to remove Hackathon with id: ${id}, ` +
        `nested failure is: ${e.message}`,
    );
  }
  await deleteHackathon(id);
  return new HackathonDeleteResponse(id);
}
