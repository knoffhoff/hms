/* eslint-disable require-jsdoc */

import {deleteSkill, getSkill, putSkill} from '../repository/skill-repository';
import Skill from '../repository/domain/Skill';
import Uuid from '../util/Uuid';
import SkillResponse from '../rest/SkillResponse';

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
  return new SkillResponse(
      skill.id,
      skill.name,
      skill.description,
  );
}

export async function removeSkill(id: Uuid) {
  await deleteSkill(id);
}
