import {buildResponse} from '../../rest/responses';
import {removeHackathon} from '../../service/hackathon-service';
import {wrapHandler} from '../handler-wrapper';
import Uuid from '../../util/Uuid';
import HackathonDeleteResponse from '../../rest/HackathonDeleteResponse';

// eslint-disable-next-line require-jsdoc
export async function remove(event, context, callback) {
  await wrapHandler(async () => {
    const id: Uuid = event.pathParameters.id;
    await removeHackathon(id);
    callback(null, buildResponse(200, new HackathonDeleteResponse(id)));
  }, callback);
}
