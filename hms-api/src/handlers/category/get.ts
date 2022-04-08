import {Uuid} from '../../util/uuids';
import {getCategory} from '../../mock/category';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function get(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  const response = buildResponse(2200, getCategory(id));

  callback(null, response);
}
