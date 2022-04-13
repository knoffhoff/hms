import {buildResponse} from '../../rest/responses';
import {removeParticipant} from '../../repository/participant-repository';
import {wrapHandler} from '../handler-wrapper';
import {Uuid} from '../../util/uuids';
import ParticipantDeleteResponse from '../../rest/ParticipantDeleteResponse';

// eslint-disable-next-line require-jsdoc
export async function remove(event, context, callback) {
  await wrapHandler(async () => {
    const id: Uuid = event.pathParameters.id;
    await removeParticipant(id);
    callback(null, buildResponse(200, new ParticipantDeleteResponse(id)));
  }, callback);
}
