import { buildResponse } from '../../rest/responses'
import { wrapHandler } from '../handler-wrapper'
import { getUserListResponse } from '../../service/user-service'

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  await wrapHandler(async () => {
    const responseBody = await getUserListResponse()
    callback(null, buildResponse(200, responseBody))
  }, callback)
}
