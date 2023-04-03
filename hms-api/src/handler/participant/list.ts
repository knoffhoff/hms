import { buildResponse } from '../../rest/responses'
import { wrapHandler } from '../handler-wrapper'
import Uuid from '../../util/Uuid'
import { getParticipantListResponse } from '../../service/participant-service'

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  await wrapHandler(async () => {
    const hackathonId: Uuid = event.pathParameters.id
    const responseBody = await getParticipantListResponse(hackathonId)
    callback(null, buildResponse(200, responseBody))
  }, callback)
}
