import {buildResponse} from '../../rest/responses';
import {createCategory} from '../../repository/category-repository';
import {wrapHandler} from '../handler-wrapper';
import CategoryCreateRequest from '../../rest/CategoryCreateRequest';
import CategoryCreateResponse from '../../rest/CategoryCreateResponse';
import Category from '../../repository/domain/Category';

// eslint-disable-next-line require-jsdoc
export async function create(event, context, callback) {
  await wrapHandler(async () => {
    const request: CategoryCreateRequest = JSON.parse(event.body);
    const category = new Category(
        request.title,
        request.description,
        request.hackathonId,
    );
    await createCategory(category);
    callback(null, buildResponse(201, new CategoryCreateResponse(category.id)));
  }, callback);
}
