import { buildResponse } from '../../rest/responses'
import { wrapHandler } from '../handler-wrapper'
import { getHackathonListResponse } from '../../service/hackathon-service'

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  await wrapHandler(async () => {
    const responseBody = await getHackathonListResponse()
    callback(null, buildResponse(200, responseBody))
  }, callback)
}
