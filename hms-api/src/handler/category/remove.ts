import {buildResponse} from '../../rest/responses';
import {removeCategory} from '../../service/category-service';
import {wrapHandler} from '../handler-wrapper';
import Uuid from '../../util/Uuid';
import CategoryDeleteResponse from '../../rest/CategoryDeleteResponse';

// eslint-disable-next-line require-jsdoc
export async function remove(event, context, callback) {
  await wrapHandler(async () => {
    const id: Uuid = event.pathParameters.id;
    await removeCategory(id);
    callback(null, buildResponse(200, new CategoryDeleteResponse(id)));
  }, callback);
}
