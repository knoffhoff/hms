/* eslint-disable require-jsdoc */

import {participantExists} from '../repository/participant-repository';
import {hackathonExists} from '../repository/hackathon-repository';
import {categoryExists} from '../repository/category-repository';
import {skillExists} from '../repository/skill-repository';
import {deleteIdea, putIdea} from '../repository/idea-repository';
import Uuid from '../util/Uuid';
import Idea from '../repository/domain/Idea';
import ReferenceNotFoundError from '../repository/error/ReferenceNotFoundError';

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

  return idea;
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
