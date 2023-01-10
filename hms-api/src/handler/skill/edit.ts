import {wrapHandler} from '../handler-wrapper';
import {buildResponse} from '../../rest/responses';
import {editSkill} from '../../service/skill-service';
import SkillEditRequest from '../../rest/Skill/SkillEditRequest';
import SkillEditResponse from '../../rest/Skill/SkillEditResponse';
import Uuid from '../../util/Uuid';

// eslint-disable-next-line require-jsdoc
export async function edit(event, context, callback) {
  await wrapHandler(async () => {
    const id: Uuid = event.pathParameters.id;
    const request = SkillEditRequest.parse(event.body);

    await editSkill(id, request.name, request.description);

    callback(null, buildResponse(200, new SkillEditResponse(id)));
  }, callback);
}
