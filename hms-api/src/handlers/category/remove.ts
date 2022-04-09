import {Uuid} from '../../util/uuids';
import {buildResponse} from '../../rest/responses';
import {removeCategory} from '../../repository/category-repository';
import CategoryDeleteResponse from '../../rest/CategoryDeleteResponse';

// eslint-disable-next-line require-jsdoc
export async function remove(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  await removeCategory(id);

  callback(null, buildResponse(200, new CategoryDeleteResponse(id)));
}
