/* eslint-disable require-jsdoc */

import {buildResponse} from '../../rest/responses';
import {getHackathon} from '../../repository/hackathon-repository';
import HackathonResponse from '../../rest/HackathonResponse';
import {listParticipants} from '../../repository/participant-repository';
import ParticipantPreviewResponse from '../../rest/ParticipantPreviewResponse';
import {listCategories} from '../../repository/category-repository';
import CategoryPreviewResponse from '../../rest/CategoryPreviewResponse';
import IdeaPreviewResponse from '../../rest/IdeaPreviewResponse';
import {listIdeas} from '../../repository/idea-repository';
import {usersFor} from '../../service/user-service';

export async function get(event, context, callback) {
  const hackathon = await getHackathon(event.pathParameters.id);
  if (hackathon) {
    const participants = await listParticipants(event.pathParameters.id);
    const participantPreviews = ParticipantPreviewResponse.fromArray(
        participants,
        await usersFor(participants));
    const responseBody = new HackathonResponse(
        hackathon.id,
        hackathon.title,
        hackathon.startDate,
        hackathon.endDate,
        participantPreviews,
        CategoryPreviewResponse.fromArray(await listCategories(hackathon.id)),
        IdeaPreviewResponse.fromArray(await listIdeas(hackathon.id)),
    );

    callback(null, buildResponse(200, responseBody));
  } else {
    callback(null, buildResponse(404, {}));
  }
}
