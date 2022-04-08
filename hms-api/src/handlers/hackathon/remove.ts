import {Uuid} from '../../util/uuids';
import {buildResponse} from '../../rest/responses';
import {removeHackathon} from '../../repository/hackathon-repository';
import HackathonDeleteResponse from '../../rest/HackathonDeleteResponse';

// eslint-disable-next-line require-jsdoc
export async function remove(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  await removeHackathon(id);

  callback(null, buildResponse(200, new HackathonDeleteResponse(id)));
}
