import { buildResponse } from '../../rest/responses'
import { getHackathonResponse } from '../../service/hackathon-service'
import { wrapHandler } from '../handler-wrapper'

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  await wrapHandler(async () => {
    const responseBody = await getHackathonResponse(event.pathParameters.id)
    callback(null, buildResponse(200, responseBody))
  }, callback)
}
