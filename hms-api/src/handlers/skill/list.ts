import {buildResponse} from '../../rest/responses';
import {listSkills} from '../../repository/skill-repository';
import SkillListResponse from '../../rest/SkillListResponse';
import SkillPreviewResponse from '../../rest/SkillPreviewResponse';

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  const previews = SkillPreviewResponse.fromArray(await listSkills());
  callback(null, buildResponse(200, new SkillListResponse(previews)));
}
