/* eslint-disable require-jsdoc */

import {deleteSkill, putSkill} from '../repository/skill-repository';
import Skill from '../repository/domain/Skill';
import Uuid from '../util/Uuid';

export async function createSkill(
    name: string,
    description: string,
): Promise<Skill> {
  const skill = new Skill(name, description);
  await putSkill(skill);
  return skill;
}

export async function removeSkill(id: Uuid) {
  await deleteSkill(id);
}
