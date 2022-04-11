import {Uuid} from '../../util/uuids';
import {buildResponse} from '../../rest/responses';
import {listCategories} from '../../repository/category-repository';
import CategoryListResponse from '../../rest/CategoryListResponse';
import CategoryPreviewResponse from '../../rest/CategoryPreviewResponse';

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  const hackathonId: Uuid = event.pathParameters.hackathonId;
  const previews = CategoryPreviewResponse.fromArray(
      await listCategories(hackathonId));
  callback(null, buildResponse(
      200,
      new CategoryListResponse(previews, hackathonId)));
}
