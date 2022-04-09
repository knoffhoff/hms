import {buildResponse} from '../../rest/responses';
import ParticipantCreateRequest from '../../rest/ParticipantCreateRequest';
import ParticipantCreateResponse from '../../rest/ParticipantCreateResponse';
import Participant from '../../repository/domain/Participant';
import {createParticipant} from '../../repository/participant-repository';

// eslint-disable-next-line require-jsdoc
export async function create(event, context, callback) {
  const request: ParticipantCreateRequest = JSON.parse(event.body);

  const participant = new Participant(request.userId, request.hackathonId);
  await createParticipant(participant);

  callback(null, buildResponse(
      200,
      new ParticipantCreateResponse(participant.id)));
}
