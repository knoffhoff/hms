import {buildResponse} from '../../rest/responses';
import {getHackathon} from '../../repository/hackathon-repository';
import {listParticipants} from '../../repository/participant-repository';
import {listCategories} from '../../repository/category-repository';
import {listIdeas} from '../../repository/idea-repository';
import {usersFor} from '../../service/user-service';
import {wrapHandler} from '../handler-wrapper';
import HackathonResponse from '../../rest/HackathonResponse';
import ParticipantPreviewResponse from '../../rest/ParticipantPreviewResponse';
import CategoryPreviewResponse from '../../rest/CategoryPreviewResponse';
import IdeaPreviewResponse from '../../rest/IdeaPreviewResponse';

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  await wrapHandler(async () => {
    const hackathon = await getHackathon(event.pathParameters.id);
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
  }, callback);
}
