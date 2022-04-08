import {buildResponse} from '../../rest/responses';
import {getCategory} from '../../repository/category-repository';
import CategoryResponse from '../../rest/CategoryResponse';

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  const category = await getCategory(event.pathParameters.id);
  if (category) {
    const responseBody = new CategoryResponse(
        category.id,
        category.title,
        category.description,
        category.hackathonId,
    );

    callback(null, buildResponse(200, responseBody));
  } else {
    callback(null, buildResponse(404, {}));
  }
}
