import {buildResponse} from '../../rest/responses';
import {getIdea} from '../../repository/idea-repository';
import IdeaResponse from '../../rest/IdeaResponse';

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  const idea = await getIdea(event.pathParameters.id);

  if (idea) {
    const responseBody = new IdeaResponse(
        idea.id,
        idea.ownerId,
        idea.hackathonId,
        idea.participantIds,
        idea.title,
        idea.description,
        idea.problem,
        idea.goal,
        idea.requiredSkills,
        idea.categoryId,
        idea.creationDate,
    );

    callback(null, buildResponse(200, responseBody));
  } else {
    callback(null, buildResponse(404, {}));
  }
}
