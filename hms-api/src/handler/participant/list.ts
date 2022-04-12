import {buildResponse} from '../../rest/responses';
import {listParticipants} from '../../repository/participant-repository';
import {usersFor} from '../../service/user-service';
import {wrapHandler} from '../handler-wrapper';
import {Uuid} from '../../util/uuids';
import ParticipantListResponse from '../../rest/ParticipantListResponse';
import ParticipantPreviewResponse from '../../rest/ParticipantPreviewResponse';

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  await wrapHandler(async () => {
    const hackathonId: Uuid = event.pathParameters.hackathonId;
    const participants = await listParticipants(hackathonId);
    const users = await usersFor(participants);
    const previews = ParticipantPreviewResponse.fromArray(participants, users);
    const responseBody = new ParticipantListResponse(previews, hackathonId);

    callback(null, buildResponse(200, responseBody));
  }, callback);
}
