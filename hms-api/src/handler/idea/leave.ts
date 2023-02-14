import {wrapHandler} from '../handler-wrapper';
import {buildResponse} from '../../rest/responses';
import {removeParticipant} from '../../service/idea-service';
import IdeaLeaveResponse from '../../rest/idea/IdeaLeaveResponse';

// eslint-disable-next-line require-jsdoc
export async function leave(event, context, callback) {
  await wrapHandler(async () => {
    const ideaId = event.pathParameters.id;
    const participantId = event.pathParameters.participantId;
    await removeParticipant(ideaId, participantId);

    callback(
      null,
      buildResponse(200, new IdeaLeaveResponse(ideaId, participantId)),
    );
  }, callback);
}
