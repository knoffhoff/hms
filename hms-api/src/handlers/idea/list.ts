import {Uuid} from '../../util/uuids';
import {buildResponse} from '../../rest/responses';
import {listIdeas} from '../../repository/idea-repository';
import IdeaListResponse from '../../rest/IdeaListResponse';
import IdeaPreviewResponse from '../../rest/IdeaPreviewResponse';

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  const hackathonId: Uuid = event.pathParameters.hackathonId;
  const previews = IdeaPreviewResponse.fromArray(await listIdeas(hackathonId));
  callback(null, buildResponse(
      200,
      new IdeaListResponse(previews, hackathonId)));
}
