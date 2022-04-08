import {Uuid} from '../../util/uuids';
import {buildResponse} from '../../rest/responses';
import {listIdeas} from '../../repository/idea-repository';
import IdeaListResponse from '../../rest/IdeaListResponse';

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  const hackathonId: Uuid = event.pathParameters.hackathonId;
  const ideas = await listIdeas(hackathonId);

  const ideaIds = ideas.map((idea) => idea.id);
  const response = buildResponse(
      200,
      new IdeaListResponse(ideaIds, hackathonId));

  callback(null, response);
}
