/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';
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

  static from = (skill: Skill): SkillPreviewResponse =>
    new SkillPreviewResponse(
        skill.id,
        skill.name,
    );

  static fromArray(skills: Skill[]): SkillPreviewResponse[] {
    const previews: SkillPreviewResponse[] = [];
    for (const skill of skills) {
      previews.push(SkillPreviewResponse.from(skill));
    }
    return previews.sort(this.compare);
  }

  static compare(a: Skill, b: Skill): number {
    if (a.name === b.name) {
      return a.id.localeCompare(b.id);
    }

    return a.name.localeCompare(b.name);
  }
}

export default SkillPreviewResponse;
