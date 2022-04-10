/* eslint-disable require-jsdoc */

import SkillPreviewResponse from './SkillPreviewResponse';

export default class {
  skills: SkillPreviewResponse[];

  constructor(skills: SkillPreviewResponse[]) {
    this.skills = skills;
  }
}
