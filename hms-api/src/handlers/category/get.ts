import {buildResponse} from '../../rest/responses';
import {getCategory} from '../../repository/category-repository';
import {getHackathon} from '../../repository/hackathon-repository';
import Category from '../../repository/domain/Category';
import CategoryResponse from '../../rest/CategoryResponse';
import Hackathon from '../../repository/domain/Hackathon';
import HackathonPreviewResponse from '../../rest/HackathonPreviewResponse';

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  const category = await getCategory(event.pathParameters.id);
  if (category instanceof Category) {
    const hackathon = await getHackathon(category.hackathonId);
    if (hackathon instanceof Hackathon) {
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
  } else {
    callback(null, buildResponse(404, {}));
  }
}
