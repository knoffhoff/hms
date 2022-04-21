import {buildResponse} from '../../rest/responses';
import {removeSkill} from '../../service/skill-service';
import {wrapHandler} from '../handler-wrapper';

// eslint-disable-next-line require-jsdoc
export async function remove(event, context, callback) {
  await wrapHandler(async () => {
    const id: string = event.pathParameters.id;
    const responseBody = await removeSkill(id);
    callback(null, buildResponse(200, responseBody));
  }, callback);
}
