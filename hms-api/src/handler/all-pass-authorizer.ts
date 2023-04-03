import { generatePolicy } from './lambda-policy-generator'

export const alwaysPass = (event, context, callback) => {
  callback(null, generatePolicy('user', 'Allow', event.methodArn))
}
