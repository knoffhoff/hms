import {uuid} from '../../util/uuids';
import {IdeaCreateRequest, IdeaCreateResponse} from '../../rest/idea';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function create(event, context, callback) {
  const request: IdeaCreateRequest = JSON.parse(event.body);

  const ideaCreateResponse = new IdeaCreateResponse(
      uuid(),
      request.ownerId,
      request.hackathonId,
      request.participantIds,
      request.title,
      request.description,
      request.problem,
      request.goal,
      request.requiredSkills,
      request.categoryId,
      new Date(),
  );
  const response = buildResponse(201, ideaCreateResponse);

  callback(null, response);
}
