import {buildResponse} from '../../rest/responses';
import SkillDeleteResponse from '../../rest/SkillDeleteResponse';
import {removeSkill} from '../../repository/skill-repository';

// eslint-disable-next-line require-jsdoc
export async function remove(event, context, callback) {
  const id: string = event.pathParameters.id;

  await removeSkill(id);

  callback(null, buildResponse(200, new SkillDeleteResponse(id)));
}
