import {Uuid} from '../../util/uuids';
import {buildResponse} from '../../rest/responses';
import {listParticipants} from '../../repository/participant-repository';
import ParticipantListResponse from '../../rest/ParticipantListResponse';
import ParticipantPreviewResponse from '../../rest/ParticipantPreviewResponse';
import {usersFor} from '../../service/user-service';

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  const hackathonId: Uuid = event.pathParameters.hackathonId;
  const participants = await listParticipants(hackathonId);
  const users = await usersFor(participants);
  const previews = ParticipantPreviewResponse.fromArray(participants, users);
  const responseBody = new ParticipantListResponse(previews, hackathonId);

  callback(null, buildResponse(200, responseBody));
}
