/* eslint-disable require-jsdoc */

import {putSkill} from '../repository/skill-repository';
import Skill from '../repository/domain/Skill';

export async function createSkill(
    name: string,
    description: string,
): Promise<Skill> {
  const skill = new Skill(name, description);
  await putSkill(skill);
  return skill;
}
