import {buildResponse} from '../../rest/responses';
import {createSkill} from '../../service/skill-service';
import {wrapHandler} from '../handler-wrapper';
import SkillCreateRequest from '../../rest/SkillCreateRequest';
import SkillCreateResponse from '../../rest/SkillCreateResponse';

// eslint-disable-next-line require-jsdoc
export async function create(event, context, callback) {
  await wrapHandler(async () => {
    const request = SkillCreateRequest.parse(event.body);
    const skill = await createSkill(request.name, request.description);

    callback(null, buildResponse(201, new SkillCreateResponse(skill.id)));
  }, callback);
}
