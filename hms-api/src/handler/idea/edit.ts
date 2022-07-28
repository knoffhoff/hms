import {wrapHandler} from '../handler-wrapper';
import {buildResponse} from '../../rest/responses';
import {editIdea} from '../../service/idea-service';
import IdeaEditRequest from '../../rest/IdeaEditRequest';
import IdeaEditResponse from '../../rest/IdeaEditResponse';
import Uuid from '../../util/Uuid';

// eslint-disable-next-line require-jsdoc
export async function edit(event, context, callback) {
  await wrapHandler(async () => {
    const id: Uuid = event.pathParameters.id;
    const request = IdeaEditRequest.parse(event.body);

    await editIdea(
      id,
      request.title,
      request.description,
      request.problem,
      request.goal,
      request.requiredSkills,
      request.categoryId,
    );

    callback(null, buildResponse(200, new IdeaEditResponse(id)));
  }, callback);
}
