import {Uuid} from '../../util/uuids';
import {buildResponse} from '../../rest/responses';
import {getHackathon} from '../../repository/hackathon-repository';
import HackathonResponse from '../../rest/HackathonResponse';

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  const hackathon = await getHackathon(id);
  if (hackathon) {
    const responseBody = new HackathonResponse(
        hackathon.id,
        hackathon.title,
        hackathon.startDate,
        hackathon.endDate,
        hackathon.participantIds,
        hackathon.categoryIds,
        hackathon.ideaIds,
    );

    callback(null, buildResponse(200, responseBody));
  } else {
    callback(null, buildResponse(404, {}));
  }
}
