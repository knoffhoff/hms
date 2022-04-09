import {buildResponse} from '../../rest/responses';
import {listSkills} from '../../repository/skill-repository';
import SkillListResponse from '../../rest/SkillListResponse';
import {mapSkillToSkillPreview} from '../../rest/SkillPreviewResponse';

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  const skills = await listSkills();
  const skillPreviews = skills.map((skill) => mapSkillToSkillPreview(skill));
  callback(null, buildResponse(200, new SkillListResponse(skillPreviews)));
}
