import {buildResponse} from '../../rest/responses';
import {SkillDeleteResponse} from '../../rest/skill';

// eslint-disable-next-line require-jsdoc
export function remove(event, context, callback) {
  const name: string = event.pathParameters.name;

  const response = buildResponse(200, new SkillDeleteResponse(name));

  callback(null, response);
}
