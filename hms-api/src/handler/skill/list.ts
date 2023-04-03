import { buildResponse } from '../../rest/responses'
import { wrapHandler } from '../handler-wrapper'
import { getSkillListResponse } from '../../service/skill-service'

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  await wrapHandler(async () => {
    const responseBody = await getSkillListResponse()
    callback(null, buildResponse(200, responseBody))
  }, callback)
}
