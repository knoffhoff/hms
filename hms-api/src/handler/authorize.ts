/* eslint-disable require-jsdoc */
import { alwaysPass } from './all-pass-authorizer'
import { authorizeWithActiveDirectory } from './active-directory-authorizer'

const AUTHORIZER_TYPE = process.env.AUTHORIZER_TYPE || 'ALWAYS_PASS'

export function authorize(event, context, callback) {
  if (AUTHORIZER_TYPE === 'ALWAYS_PASS') {
    alwaysPass(event, context, callback)
  } else if (AUTHORIZER_TYPE === 'ACTIVE_DIRECTORY') {
    authorizeWithActiveDirectory(event, context, callback)
  } else {
    return callback('Unauthorized')
  }
}
