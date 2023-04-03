import { buildResponse } from '../../rest/responses'
import { wrapHandler } from '../handler-wrapper'
import { getUserResponse } from '../../service/user-service'

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  await wrapHandler(async () => {
    const responseBody = await getUserResponse(event.pathParameters.id)
    callback(null, buildResponse(200, responseBody))
  }, callback)
}
