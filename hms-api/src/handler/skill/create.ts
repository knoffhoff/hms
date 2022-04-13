import {buildResponse} from '../../rest/responses';
import {createSkill} from '../../repository/skill-repository';
import {wrapHandler} from '../handler-wrapper';
import SkillCreateRequest from '../../rest/SkillCreateRequest';
import SkillCreateResponse from '../../rest/SkillCreateResponse';
import Skill from '../../repository/domain/Skill';

// eslint-disable-next-line require-jsdoc
export async function create(event, context, callback) {
  await wrapHandler(async () => {
    const request: SkillCreateRequest = JSON.parse(event.body);
    const skill = new Skill(
        request.name,
        request.description,
    );
    await createSkill(skill);

    callback(null, buildResponse(201, new SkillCreateResponse(skill.id)));
  }, callback);
}
