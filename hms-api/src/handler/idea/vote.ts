import {wrapHandler} from '../handler-wrapper';
import {addVoter} from '../../service/idea-service';
import {buildResponse} from '../../rest/responses';
import IdeaJoinResponse from '../../rest/IdeaJoinResponse';

// eslint-disable-next-line require-jsdoc
export async function vote(event, context, callback) {
  await wrapHandler(async () => {
    const ideaId = event.pathParameters.ideaId;
    const participantId = event.pathParameters.participantId;
    await addVoter(ideaId, participantId);

    callback(
      null,
      buildResponse(200, new IdeaJoinResponse(ideaId, participantId)),
    );
  }, callback);
}
