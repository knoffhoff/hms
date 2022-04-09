import {Uuid} from '../../util/uuids';
import {buildResponse} from '../../rest/responses';
import {listParticipants} from '../../repository/participant-repository';
import ParticipantListResponse from '../../rest/ParticipantListResponse';

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  const hackathonId: Uuid = event.pathParameters.hackathonId;
  const participants = await listParticipants(hackathonId);

  const participantIds = participants.map((participant) => participant.id);
  const response = buildResponse(
      200,
      new ParticipantListResponse(participantIds, hackathonId));

  callback(null, response);
}
