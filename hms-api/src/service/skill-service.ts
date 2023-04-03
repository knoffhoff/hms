/* eslint-disable require-jsdoc */

import { deleteSkill, getSkill, listSkills, putSkill, } from '../repository/skill-repository'
import Skill from '../repository/domain/Skill'
import Uuid from '../util/Uuid'
import SkillResponse from '../rest/skill/SkillResponse'
import SkillListResponse from '../rest/skill/SkillListResponse'
import SkillDeleteResponse from '../rest/skill/SkillDeleteResponse'
import NotFoundError from '../error/NotFoundError'
import ValidationError from '../error/ValidationError'

export async function createSkill(
  name: string,
  description: string,
): Promise<Skill> {
  const skill = new Skill(name, description)
  const result = skill.validate()
  if (result.hasFailed()) {
    throw new ValidationError(`Cannot create Skill`, result)
  }

  await putSkill(skill)
  return skill
}

export async function editSkill(
  id: Uuid,
  name: string,
  description: string,
): Promise<void> {
  let existing
  try {
    existing = await getSkill(id)
    existing.name = name
    existing.description = description
  } catch (e) {
    throw new NotFoundError(
      `Cannot edit Skill with id: ${id}, it does not exist`,
    )
  }

  const result = existing.validate()
  if (result.hasFailed()) {
    throw new ValidationError(`Cannot edit Skill with id: ${id}`, result)
  }

  await putSkill(existing)
}

export async function getSkillResponse(id: Uuid): Promise<SkillResponse> {
  const skill = await getSkill(id)

  return SkillResponse.from(skill)
}

export async function getSkillListResponse(): Promise<SkillListResponse> {
  const skills = await listSkills()

  return SkillListResponse.from(skills)
}

export async function removeSkill(id: Uuid): Promise<SkillDeleteResponse> {
  await deleteSkill(id)

  return new SkillDeleteResponse(id)
}
