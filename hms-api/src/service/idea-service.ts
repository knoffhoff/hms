/* eslint-disable require-jsdoc */

import {
  getParticipant,
  getParticipants,
  participantExists,
} from '../repository/participant-repository';
import {
  getHackathon,
  hackathonExists,
} from '../repository/hackathon-repository';
import {categoryExists, getCategory} from '../repository/category-repository';
import {getSkills, skillExists} from '../repository/skill-repository';
import {
  deleteIdea,
  getIdea,
  listIdeas,
  putIdea,
} from '../repository/idea-repository';
import {usersFor} from './user-service';
import {getUser} from '../repository/user-repository';
import {addIdeaToHackathon} from './hackathon-service';
import Uuid from '../util/Uuid';
import Idea from '../repository/domain/Idea';
import ReferenceNotFoundError from '../error/ReferenceNotFoundError';
import IdeaResponse from '../rest/IdeaResponse';
import IdeaListResponse from '../rest/IdeaListResponse';
import ReferenceUpdateError from '../error/ReferenceUpdateError';

export async function createIdea(
    ownerId: Uuid,
    hackathonId: Uuid,
    title: string,
    description: string,
    problem: string,
    goal: string,
    requiredSkills: Uuid[],
    categoryId: Uuid,
): Promise<Idea> {
  if (!await participantExists(ownerId)) {
    throw new ReferenceNotFoundError(`Cannot create Idea, ` +
        `Category with id: ${categoryId} does not exist`);
  } else if (!await hackathonExists(hackathonId)) {
    throw new ReferenceNotFoundError(`Cannot create Idea, ` +
        `Hackathon with id: ${hackathonId} does not exist`);
  } else if (!await categoryExists(categoryId)) {
    throw new ReferenceNotFoundError(`Cannot create Idea, ` +
        `Category with id: ${categoryId} does not exist`);
  }

  await verifyAllSkillsExist(requiredSkills);

  const idea = new Idea(
      ownerId,
      hackathonId,
      title,
      description,
      problem,
      goal,
      requiredSkills,
      categoryId,
  );
  await putIdea(idea);

  try {
    await addIdeaToHackathon(idea.hackathonId, idea.id);
  } catch (e) {
    await deleteIdea(idea.id);
    throw new ReferenceUpdateError(`Failed to create Idea, ` +
        `failed to add Idea to linked Hackathon with id ${idea.hackathonId}`);
  }

  return idea;
}

export async function getIdeaResponse(id: Uuid): Promise<IdeaResponse> {
  const idea = await getIdea(id);

  let ownerParticipant;
  try {
    ownerParticipant = await getParticipant(idea.ownerId);
  } catch (e) {
    throw new ReferenceNotFoundError(`Cannot get Idea with id ${id}, ` +
        `unable to get owner Participant with id: ${idea.ownerId}`);
  }

  let ownerUser;
  try {
    ownerUser = await getUser(ownerParticipant.userId);
  } catch (e) {
    throw new ReferenceNotFoundError(`Cannot get Idea with id: ${id}, ` +
        `unable to get owner User with id: ${ownerParticipant.userId} ` +
        `for Participant with id: ${ownerParticipant.id}`);
  }

  let participants;
  try {
    participants = await getParticipants(idea.participantIds);
  } catch (e) {
    throw new ReferenceNotFoundError(`Cannot get Idea with id: ${id}, ` +
        `unable to get Participants with ids: ${idea.participantIds}`);
  }

  let users;
  try {
    users = await usersFor(participants);
  } catch (e) {
    throw new ReferenceNotFoundError(`Cannot get Idea with id: ${id}, ` +
        `unable to get Users for Participants with ids: ` +
        `${idea.participantIds}`);
  }

  let hackathon;
  try {
    hackathon = await getHackathon(idea.hackathonId);
  } catch (e) {
    throw new ReferenceNotFoundError(`Cannot get Idea with id: ${id}, ` +
        `unable to get Hackathon with id: ${idea.hackathonId}`);
  }

  let skills;
  try {
    skills = await getSkills(idea.requiredSkills);
  } catch (e) {
    throw new ReferenceNotFoundError(`Cannot get Idea with id: ${id}, ` +
        `unable to get Skills with ids: ${idea.requiredSkills}`);
  }

  let category;
  try {
    category = await getCategory(idea.categoryId);
  } catch (e) {
    throw new ReferenceNotFoundError(`Cannot get Idea with id: ${id}, ` +
        `unable to get Category with id: ${idea.categoryId}`);
  }

  return IdeaResponse.from(
      idea,
      ownerParticipant,
      ownerUser,
      hackathon,
      participants,
      users,
      skills,
      category,
  );
}

export async function getIdeaListResponse(
    hackathonId: Uuid,
): Promise<IdeaListResponse> {
  const ideas = await listIdeas(hackathonId);
  return IdeaListResponse.from(ideas, hackathonId);
}

export async function removeIdea(id: Uuid) {
  await deleteIdea(id);
}

async function verifyAllSkillsExist(skillIds: Uuid[]): Promise<void> {
  for (const skillId of skillIds) {
    if (!await skillExists(skillId)) {
      throw new ReferenceNotFoundError(`Cannot create Idea, ` +
          `Skill with id: ${skillId} does not exist`);
    }
  }
}
