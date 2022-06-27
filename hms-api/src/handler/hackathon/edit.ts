import {wrapHandler} from '../handler-wrapper';
import {buildResponse} from '../../rest/responses';
import {editHackathon} from '../../service/hackathon-service';
import HackathonEditRequest from '../../rest/HackathonEditRequest';
import HackathonEditResponse from '../../rest/HackathonEditResponse';
import Uuid from '../../util/Uuid';

// eslint-disable-next-line require-jsdoc
export async function edit(event, context, callback) {
  await wrapHandler(async () => {
    const id: Uuid = event.pathParameters.id;
    const request = HackathonEditRequest.parse(event.body);

    await editHackathon(
        id,
        request.title,
        request.description,
        request.startDate,
        request.endDate);

    callback(null, buildResponse(200, new HackathonEditResponse(id)));
  }, callback);
}
