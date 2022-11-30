import {buildResponse} from '../../rest/responses';
import {wrapHandler} from '../handler-wrapper';
import {
  getAllIdeasResponse,
  getIdeasForHackathonListResponse,
} from '../../service/idea-service';

// eslint-disable-next-line require-jsdoc
export async function listHackathonIdeas(event, context, callback) {
  await wrapHandler(async () => {
    const hackathonId = event.pathParameters.id;
    const responseBody = await getIdeasForHackathonListResponse(hackathonId);
    callback(null, buildResponse(200, responseBody));
  }, callback);
}

// eslint-disable-next-line require-jsdoc
export async function listAllIdeas(event, context, callback) {
  await wrapHandler(async () => {
    const responseBody = await getAllIdeasResponse();
    callback(null, buildResponse(200, responseBody));
  }, callback);
}
