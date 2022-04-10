import {buildResponse} from '../../rest/responses';
import CategoryCreateRequest from '../../rest/CategoryCreateRequest';
import CategoryCreateResponse from '../../rest/CategoryCreateResponse';
import Category from '../../repository/domain/Category';
import {createCategory} from '../../repository/category-repository';

// eslint-disable-next-line require-jsdoc
export async function create(event, context, callback) {
  const request: CategoryCreateRequest = JSON.parse(event.body);

  const category = new Category(
      request.title,
      request.description,
      request.hackathonId,
  );
  await createCategory(category);

  callback(null, buildResponse(200, new CategoryCreateResponse(category.id)));
}
