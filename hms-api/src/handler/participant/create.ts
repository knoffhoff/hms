import {buildResponse} from '../../rest/responses';
import {createParticipant} from '../../repository/participant-repository';
import {wrapHandler} from '../handler-wrapper';
import ParticipantCreateRequest from '../../rest/ParticipantCreateRequest';
import ParticipantCreateResponse from '../../rest/ParticipantCreateResponse';
import Participant from '../../repository/domain/Participant';

// eslint-disable-next-line require-jsdoc
export async function create(event, context, callback) {
  await wrapHandler(async () => {
    const request: ParticipantCreateRequest = JSON.parse(event.body);
    const participant = new Participant(request.userId, request.hackathonId);
    await createParticipant(participant);
    callback(null, buildResponse(
        201,
        new ParticipantCreateResponse(participant.id)));
  }, callback);
}
