import {buildResponse} from '../../rest/responses';
import IdeaCreateRequest from '../../rest/IdeaCreateRequest';
import IdeaCreateResponse from '../../rest/IdeaCreateResponse';
import Idea from '../../repository/domain/Idea';
import {createIdea} from '../../repository/idea-repository';

// eslint-disable-next-line require-jsdoc
export async function create(event, context, callback) {
  const request: IdeaCreateRequest = JSON.parse(event.body);

  const idea = new Idea(
      request.ownerId,
      request.hackathonId,
      request.participantIds,
      request.title,
      request.description,
      request.problem,
      request.goal,
      request.requiredSkills,
      request.categoryId,
  );
  await createIdea(idea);

  callback(null, buildResponse(201, new IdeaCreateResponse(idea.id)));
}
