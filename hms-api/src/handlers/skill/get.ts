import {buildResponse} from '../../rest/responses';
import {getSkill} from '../../repository/skill-repository';
import SkillResponse from '../../rest/SkillResponse';

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  const id: string = event.pathParameters.id;

  const skill = await getSkill(id);
  if (skill) {
    const responseBody = new SkillResponse(
        skill.id,
        skill.name,
        skill.description,
    );

    callback(null, buildResponse(200, responseBody));
  } else {
    callback(null, buildResponse(404, {}));
  }
}
