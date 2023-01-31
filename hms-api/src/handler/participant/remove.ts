import {buildResponse} from '../../rest/responses';
import {removeParticipant} from '../../service/participant-service';
import {wrapHandler} from '../handler-wrapper';
import Uuid from '../../util/Uuid';
import ParticipantDeleteResponse from '../../rest/participant/ParticipantDeleteResponse';

// eslint-disable-next-line require-jsdoc
export async function remove(event, context, callback) {
  await wrapHandler(async () => {
    const id: Uuid = event.pathParameters.id;
    await removeParticipant(id);
    callback(null, buildResponse(200, new ParticipantDeleteResponse(id)));
  }, callback);
}
