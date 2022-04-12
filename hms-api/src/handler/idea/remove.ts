import {buildResponse} from '../../rest/responses';
import {removeIdea} from '../../repository/idea-repository';
import {wrapHandler} from '../handler-wrapper';
import {Uuid} from '../../util/uuids';
import IdeaDeletionResponse from '../../rest/IdeaDeleteResponse';

// eslint-disable-next-line require-jsdoc
export async function remove(event, context, callback) {
  await wrapHandler(async () => {
    const id: Uuid = event.pathParameters.id;
    await removeIdea(id);
    callback(null, buildResponse(200, new IdeaDeletionResponse(id)));
  }, callback);
}
