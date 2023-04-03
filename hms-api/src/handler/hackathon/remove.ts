import { buildResponse } from '../../rest/responses'
import { removeHackathon } from '../../service/hackathon-service'
import { wrapHandler } from '../handler-wrapper'
import Uuid from '../../util/Uuid'

// eslint-disable-next-line require-jsdoc
export async function remove(event, context, callback) {
  await wrapHandler(async () => {
    const id: Uuid = event.pathParameters.id
    const responseBody = await removeHackathon(id)
    callback(null, buildResponse(200, responseBody))
  }, callback)
}
