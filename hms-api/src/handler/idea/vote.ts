import {wrapHandler} from '../handler-wrapper';
import {addVoter} from '../../service/idea-service';
import {buildResponse} from '../../rest/responses';
import IdeaVoteResponse from '../../rest/idea/IdeaVoteResponse';

// eslint-disable-next-line require-jsdoc
export async function vote(event, context, callback) {
  await wrapHandler(async () => {
    const ideaId = event.pathParameters.id;
    const participantId = event.pathParameters.participantId;
    await addVoter(ideaId, participantId);

    callback(
      null,
      buildResponse(200, new IdeaVoteResponse(ideaId, participantId)),
    );
  }, callback);
}
