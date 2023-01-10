import {buildResponse} from '../../rest/responses';
import {createParticipant} from '../../service/participant-service';
import {wrapHandler} from '../handler-wrapper';
import ParticipantCreateRequest from '../../rest/Participant/ParticipantCreateRequest';
import ParticipantCreateResponse from '../../rest/Participant/ParticipantCreateResponse';

// eslint-disable-next-line require-jsdoc
export async function create(event, context, callback) {
  await wrapHandler(async () => {
    const request = ParticipantCreateRequest.parse(event.body);
    const participant = await createParticipant(
      request.userId,
      request.hackathonId,
    );

    callback(
      null,
      buildResponse(201, new ParticipantCreateResponse(participant.id)),
    );
  }, callback);
}
