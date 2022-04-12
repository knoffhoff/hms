import {buildResponse} from '../../rest/responses';
import {getParticipant} from '../../repository/participant-repository';
import {getHackathon} from '../../repository/hackathon-repository';
import {getUser} from '../../repository/user-repository';
import {wrapHandler} from '../handler-wrapper';
import ParticipantResponse from '../../rest/ParticipantResponse';
import HackathonPreviewResponse from '../../rest/HackathonPreviewResponse';
import UserPreviewResponse from '../../rest/UserPreviewResponse';

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  await wrapHandler(async () => {
    const participant = await getParticipant(event.pathParameters.id);
    const user = await getUser(participant.userId);
    const hackathon = await getHackathon(participant.hackathonId);
    const responseBody = new ParticipantResponse(
        participant.userId,
        UserPreviewResponse.from(user),
        HackathonPreviewResponse.from(hackathon),
        participant.creationDate,
    );

    callback(null, buildResponse(200, responseBody));
  }, callback);
}
