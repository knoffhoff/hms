/* eslint-disable require-jsdoc */

import {
  deleteSkill,
  getSkill,
  listSkills,
  putSkill,
} from '../repository/skill-repository';
import Skill from '../repository/domain/Skill';
import Uuid from '../util/Uuid';
import SkillResponse from '../rest/SkillResponse';
import SkillListResponse from '../rest/SkillListResponse';

export async function createSkill(
    name: string,
    description: string,
): Promise<Skill> {
  const skill = new Skill(name, description);
  await putSkill(skill);
  return skill;
}

export async function getSkillResponse(id: Uuid): Promise<SkillResponse> {
  const skill = await getSkill(id);
  return SkillResponse.from(skill);
}

export async function getSkillListResponse(): Promise<SkillListResponse> {
  const skills = await listSkills();
  return SkillListResponse.from(skills);
}

export async function removeSkill(id: Uuid) {
  await deleteSkill(id);
}
