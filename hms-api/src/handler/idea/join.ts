import {wrapHandler} from '../handler-wrapper';
import {addParticipant} from '../../service/idea-service';
import {buildResponse} from '../../rest/responses';
import IdeaJoinResponse from '../../rest/IdeaJoinResponse';

// eslint-disable-next-line require-jsdoc
export async function join(event, context, callback) {
  await wrapHandler(async () => {
    const ideaId = event.pathParameters.id;
    const participantId = event.pathParameters.participantId;
    await addParticipant(ideaId, participantId);

    callback(null, buildResponse(
        200,
        new IdeaJoinResponse(ideaId, participantId)));
  }, callback);
}
