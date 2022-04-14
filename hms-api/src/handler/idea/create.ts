import {buildResponse} from '../../rest/responses';
import {createIdea} from '../../service/idea-service';
import {wrapHandler} from '../handler-wrapper';
import IdeaCreateRequest from '../../rest/IdeaCreateRequest';
import IdeaCreateResponse from '../../rest/IdeaCreateResponse';

// eslint-disable-next-line require-jsdoc
export async function create(event, context, callback) {
  await wrapHandler(async () => {
    const request: IdeaCreateRequest = JSON.parse(event.body);

    const idea = await createIdea(
        request.ownerId,
        request.hackathonId,
        request.title,
        request.description,
        request.problem,
        request.goal,
        request.requiredSkills,
        request.categoryId,
    );

    callback(null, buildResponse(201, new IdeaCreateResponse(idea.id)));
  }, callback);
}
