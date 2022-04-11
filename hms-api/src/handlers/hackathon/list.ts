import {buildResponse} from '../../rest/responses';
import {listHackathons} from '../../repository/hackathon-repository';
import HackathonListResponse from '../../rest/HackathonListResponse';
import HackathonPreviewResponse from '../../rest/HackathonPreviewResponse';

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  const previews = HackathonPreviewResponse.fromArray(await listHackathons());
  callback(null, buildResponse(200, new HackathonListResponse(previews)));
}
