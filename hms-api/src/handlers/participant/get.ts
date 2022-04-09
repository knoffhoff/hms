import {buildResponse} from '../../rest/responses';
import {getParticipant} from '../../repository/participant-repository';
import ParticipantResponse from '../../rest/ParticipantResponse';

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  const participant = await getParticipant(event.pathParameters.id);

  if (participant) {
    const responseBody = new ParticipantResponse(
        participant.userId,
        participant.hackathonId,
        participant.id,
        participant.creationDate,
    );

    callback(null, buildResponse(200, responseBody));
  } else {
    callback(null, buildResponse(404, {}));
  }
}
