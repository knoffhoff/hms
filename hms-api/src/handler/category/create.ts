import {buildResponse} from '../../rest/responses';
import {wrapHandler} from '../handler-wrapper';
import {createCategory} from '../../service/category-service';
import CategoryCreateRequest from '../../rest/category/CategoryCreateRequest';
import CategoryCreateResponse from '../../rest/category/CategoryCreateResponse';

// eslint-disable-next-line require-jsdoc
export async function create(event, context, callback) {
  await wrapHandler(async () => {
    const request = CategoryCreateRequest.parse(event.body);
    const category = await createCategory(
      request.title,
      request.description,
      request.hackathonId,
    );

    callback(null, buildResponse(201, new CategoryCreateResponse(category.id)));
  }, callback);
}
