import {buildResponse} from '../../rest/responses';
import {getUser} from '../../repository/user-repository';
import {mapRolesToStrings} from '../../repository/domain/Role';
import {getSkills} from '../../repository/skill-repository';
import {wrapHandler} from '../handler-wrapper';
import Uuid from '../../util/Uuid';
import UserResponse from '../../rest/UserResponse';
import SkillPreviewResponse from '../../rest/SkillPreviewResponse';

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  await wrapHandler(async () => {
    const id: Uuid = event.pathParameters.id;
    const user = await getUser(id);
    const responseBody = new UserResponse(
        user.id,
        user.lastName,
        user.firstName,
        user.emailAddress,
        mapRolesToStrings(user.roles),
        SkillPreviewResponse.fromArray(await getSkills(user.skills)),
        user.imageUrl,
        user.creationDate,
    );

    callback(null, buildResponse(200, responseBody));
  }, callback);
}
