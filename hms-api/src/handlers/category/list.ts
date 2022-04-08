import {Uuid} from '../../util/uuids';
import {buildResponse} from '../../rest/responses';
import {listCategories} from '../../repository/category-repository';
import CategoryListResponse from '../../rest/CategoryListResponse';

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  const hackathonId: Uuid = event.pathParameters.hackathonId;
  const categories = await listCategories(hackathonId);

  const categoryIds = categories.map((category) => category.id);
  const response = buildResponse(
      200,
      new CategoryListResponse(categoryIds, hackathonId));

  callback(null, response);
}
