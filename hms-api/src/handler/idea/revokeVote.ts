import {wrapHandler} from '../handler-wrapper';
import {buildResponse} from '../../rest/responses';
import {removeVoter} from '../../service/idea-service';
import IdeaVoteResponse from '../../rest/idea/IdeaVoteResponse';

// eslint-disable-next-line require-jsdoc
export async function revokeVote(event, context, callback) {
  await wrapHandler(async () => {
    const ideaId = event.pathParameters.id;
    const participantId = event.pathParameters.participantId;
    await removeVoter(ideaId, participantId);

    callback(
      null,
      buildResponse(200, new IdeaVoteResponse(ideaId, participantId)),
    );
  }, callback);
}
