import {buildResponse} from '../../rest/responses';
import {getParticipant} from '../../repository/participant-repository';
import ParticipantResponse from '../../rest/ParticipantResponse';
import HackathonPreviewResponse from '../../rest/HackathonPreviewResponse';
import {getHackathon} from '../../repository/hackathon-repository';
import UserPreviewResponse from '../../rest/UserPreviewResponse';
import {getUser} from '../../repository/user-repository';

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  const participant = await getParticipant(event.pathParameters.id);

  if (participant) {
    const user = await getUser(participant.userId);
    const hackathon = await getHackathon(participant.hackathonId);
    const responseBody = new ParticipantResponse(
        participant.userId,
        UserPreviewResponse.from(user),
        HackathonPreviewResponse.from(hackathon),
        participant.creationDate,
    );

    callback(null, buildResponse(200, responseBody));
  } else {
    callback(null, buildResponse(404, {}));
  }
}
