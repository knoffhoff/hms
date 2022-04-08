import {buildResponse} from '../../rest/responses';
import {listHackathons} from '../../repository/hackathon-repository';
import HackathonListResponse from '../../rest/HackathonListResponse';

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  const hackathons = await listHackathons();

  const hackathonIds = hackathons.map((hackathon) => hackathon.id);
  const response = buildResponse(200, new HackathonListResponse(hackathonIds));

  callback(null, response);
}
