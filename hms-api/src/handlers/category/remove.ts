import {Uuid} from '../../util/uuids';
import {CategoryDeleteResponse} from '../../rest/category';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function remove(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  const response = buildResponse(200, new CategoryDeleteResponse(id));

  callback(null, response);
}
