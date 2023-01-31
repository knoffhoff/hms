/* eslint-disable require-jsdoc */

import Uuid from '../../util/Uuid';
import Skill from '../../repository/domain/Skill';

class SkillResponse {
  id: Uuid;
  name: string;
  description: string;

  constructor(id: Uuid, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static from = (skill: Skill): SkillResponse =>
    new SkillResponse(skill.id, skill.name, skill.description);
}

export default SkillResponse;
