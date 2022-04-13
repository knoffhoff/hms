import {buildResponse} from '../../rest/responses';
import {getCategory} from '../../repository/category-repository';
import {getHackathon} from '../../repository/hackathon-repository';
import {wrapHandler} from '../handler-wrapper';
import CategoryResponse from '../../rest/CategoryResponse';
import HackathonPreviewResponse from '../../rest/HackathonPreviewResponse';

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  await wrapHandler(async () => {
    const category = await getCategory(event.pathParameters.id);
    const hackathon = await getHackathon(category.hackathonId);
    const responseBody = new CategoryResponse(
        category.id,
        category.title,
        category.description,
        HackathonPreviewResponse.from(hackathon),
    );
    callback(null, buildResponse(200, responseBody));
  }, callback);
}
