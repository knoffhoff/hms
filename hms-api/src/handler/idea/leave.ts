import {wrapHandler} from '../handler-wrapper';
import {buildResponse} from '../../rest/responses';
import JoinIdeaResponse from '../../rest/JoinIdeaResponse';

// eslint-disable-next-line require-jsdoc
export async function join(event, context, callback) {
  await wrapHandler(async () => {
    const ideaId = event.pathParameters.id;
    const participantId = event.pathParameters.participantId;
    await removeParticipant(ideaId, participantId);

    callback(null, buildResponse(
        200,
        new JoinIdeaResponse(ideaId, participantId)));
  }, callback);
}
