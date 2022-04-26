import {wrapHandler} from '../handler-wrapper';
import {buildResponse} from '../../rest/responses';
import {editHackathon} from '../../service/hackathon-service';
import HackathonEditRequest from '../../rest/HackathonEditRequest';
import HackathonEditResponse from '../../rest/HackathonEditResponse';

// eslint-disable-next-line require-jsdoc
export async function create(event, context, callback) {
  await wrapHandler(async () => {
    const id = event.pathParameters.id;
    const request = HackathonEditRequest.parse(event.body);

    await editHackathon(id, request.title, request.startDate, request.endDate);

    callback(null, buildResponse(200, new HackathonEditResponse(id)));
  }, callback);
}
