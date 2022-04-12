import {buildResponse} from '../../rest/responses';
import {createIdea} from '../../repository/idea-repository';
import {wrapHandler} from '../handler-wrapper';
import IdeaCreateRequest from '../../rest/IdeaCreateRequest';
import IdeaCreateResponse from '../../rest/IdeaCreateResponse';
import Idea from '../../repository/domain/Idea';

// eslint-disable-next-line require-jsdoc
export async function create(event, context, callback) {
  await wrapHandler(async () => {
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
  }, callback);
}
