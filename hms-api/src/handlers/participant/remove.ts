import {Uuid} from '../../util/uuids';
import {buildResponse} from '../../rest/responses';
import {removeParticipant} from '../../repository/participant-repository';
import ParticipantDeleteResponse from '../../rest/ParticipantDeleteResponse';

// eslint-disable-next-line require-jsdoc
export async function remove(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  await removeParticipant(id);

  const response = buildResponse(200, new ParticipantDeleteResponse(id));

  callback(null, response);
}
