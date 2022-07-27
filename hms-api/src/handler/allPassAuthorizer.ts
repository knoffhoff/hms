import {generatePolicy} from './lambdaPolicyGenerator';

export const alwaysPass = (event, context, callback) => {
  callback(null, generatePolicy('user', 'Allow', event.methodArn));
};
