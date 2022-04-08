import {buildResponse} from '../../rest/responses';
import {getHackathons} from '../../repository/hackathon-repository';
import HackathonListResponse from '../../rest/HackathonListResponse';

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  const hackathons = await getHackathons();

  const hackathonIds = hackathons.map((hackathon) => {
    return hackathon.id;
  });

  const response = buildResponse(200, new HackathonListResponse(hackathonIds));

  callback(null, response);
}
