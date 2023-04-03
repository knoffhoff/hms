import { buildResponse } from '../../rest/responses'
import { removeCategory } from '../../service/category-service'
import { wrapHandler } from '../handler-wrapper'

// eslint-disable-next-line require-jsdoc
export async function remove(event, context, callback) {
  await wrapHandler(async () => {
    const responseBody = await removeCategory(event.pathParameters.id)
    callback(null, buildResponse(200, responseBody))
  }, callback)
}
