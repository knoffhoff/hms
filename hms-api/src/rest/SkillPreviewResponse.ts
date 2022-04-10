/* eslint-disable require-jsdoc */

import {Uuid} from '../util/uuids';
import Skill from '../repository/domain/Skill';

class SkillPreviewResponse {
  id: Uuid;
  name: string;

  constructor(
      id: Uuid,
      name: string,
  ) {
    this.id = id;
    this.name = name;
  }
}

export const mapSkillToSkillPreview = (skill: Skill) =>
  new SkillPreviewResponse(skill.id, skill.name);

export default SkillPreviewResponse;
