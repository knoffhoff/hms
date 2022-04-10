import {Uuid} from '../../util/uuids';
import {buildResponse} from '../../rest/responses';
import {removeIdea} from '../../repository/idea-repository';
import IdeaDeletionResponse from '../../rest/IdeaDeleteResponse';

// eslint-disable-next-line require-jsdoc
export async function remove(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  await removeIdea(id);

  callback(null, buildResponse(200, new IdeaDeletionResponse(id)));
}
