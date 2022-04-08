import {CreateSkillRequest, CreateSkillResponse} from '../../rest/skill';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function create(event, context, callback) {
  const request: CreateSkillRequest = JSON.parse(event.body);

  const createSkillResponse = new CreateSkillResponse(
      request.name,
      request.description,
  );
  const response = buildResponse(201, createSkillResponse);

  callback(null, response);
}
