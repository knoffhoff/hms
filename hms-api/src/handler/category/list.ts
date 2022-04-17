import {buildResponse} from '../../rest/responses';
import {listCategories} from '../../repository/category-repository';
import {wrapHandler} from '../handler-wrapper';
import CategoryListResponse from '../../rest/CategoryListResponse';
import CategoryPreviewResponse from '../../rest/CategoryPreviewResponse';
import Uuid from '../../util/Uuid';

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  await wrapHandler(async () => {
    const hackathonId: Uuid = event.pathParameters.hackathonId;
    const categories = await listCategories(hackathonId);
    const previews = CategoryPreviewResponse.fromArray(categories);
    callback(null, buildResponse(
        200,
        new CategoryListResponse(previews, hackathonId)));
  }, callback);
}
