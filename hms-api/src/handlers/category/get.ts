import {buildResponse} from '../../rest/responses';
import {getCategory} from '../../repository/category-repository';
import CategoryResponse from '../../rest/CategoryResponse';
import {getHackathon} from '../../repository/hackathon-repository';
import HackathonPreviewResponse from '../../rest/HackathonPreviewResponse';

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  const category = await getCategory(event.pathParameters.id);
  if (category) {
    const hackathon = await getHackathon(category.hackathonId);
    const responseBody = new CategoryResponse(
        category.id,
        category.title,
        category.description,
        HackathonPreviewResponse.from(hackathon),
    );
    callback(null, buildResponse(200, responseBody));
  } else {
    callback(null, buildResponse(404, {}));
  }
}
