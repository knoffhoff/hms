import {Uuid} from '../../util/uuids';
import {buildResponse} from '../../rest/responses';
import {getUser} from '../../repository/user-repository';
import UserResponse from '../../rest/UserResponse';
import {mapRolesToStrings} from '../../repository/domain/Role';
import {mapSkillToSkillPreview} from '../../rest/SkillPreviewResponse';
import {getSkills} from '../../repository/skill-repository';

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  const id: Uuid = event.pathParameters.id;
  const user = await getUser(id);

  if (user) {
    const skills = await getSkills(user.skills);

    const responseBody = new UserResponse(
        user.id,
        user.lastName,
        user.firstName,
        user.emailAddress,
        mapRolesToStrings(user.roles),
        skills.map((skill) => mapSkillToSkillPreview(skill)),
        user.imageUrl,
        user.creationDate,
    );

    callback(null, buildResponse(200, responseBody));
  } else {
    callback(null, buildResponse(404, {}));
  }
}
