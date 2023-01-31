/* eslint-disable require-jsdoc */

import SkillPreviewResponse from './SkillPreviewResponse';
import Skill from '../../repository/domain/Skill';

class SkillListResponse {
  skills: SkillPreviewResponse[];

  constructor(skills: SkillPreviewResponse[]) {
    this.skills = skills;
  }

  static from = (skills: Skill[]): SkillListResponse =>
    new SkillListResponse(SkillPreviewResponse.fromArray(skills));
}

export default SkillListResponse;
