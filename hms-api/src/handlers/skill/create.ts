import {buildResponse} from '../../rest/responses';
import SkillCreateRequest from '../../rest/SkillCreateRequest';
import SkillCreateResponse from '../../rest/SkillCreateResponse';
import Skill from '../../repository/domain/Skill';
import {createSkill} from '../../repository/skill-repository';

// eslint-disable-next-line require-jsdoc
export async function create(event, context, callback) {
  const request: SkillCreateRequest = JSON.parse(event.body);

  const skill = new Skill(
      request.name,
      request.description,
  );

  await createSkill(skill);

  callback(null, buildResponse(201, new SkillCreateResponse(skill.id)));
}
