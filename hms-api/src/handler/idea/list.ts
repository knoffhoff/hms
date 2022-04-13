import {buildResponse} from '../../rest/responses';
import {listIdeas} from '../../repository/idea-repository';
import {wrapHandler} from '../handler-wrapper';
import {Uuid} from '../../util/uuids';
import IdeaListResponse from '../../rest/IdeaListResponse';
import IdeaPreviewResponse from '../../rest/IdeaPreviewResponse';

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  await wrapHandler(async () => {
    const hackathonId: Uuid = event.pathParameters.hackathonId;
    const ideas = await listIdeas(hackathonId);
    const previews = IdeaPreviewResponse.fromArray(ideas);
    callback(null, buildResponse(
        200,
        new IdeaListResponse(previews, hackathonId)));
  }, callback);
}
