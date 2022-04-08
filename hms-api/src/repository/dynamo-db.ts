/* eslint-disable require-jsdoc */

import {AttributeValue, DynamoDBClient} from '@aws-sdk/client-dynamodb';
import runningLocalStack from '../util/running-localstack';

export function getClient(): DynamoDBClient {
  if (runningLocalStack()) {
    const endpoint = 'http://' + process.env.LOCALSTACK_HOSTNAME + ':4566';
    return new DynamoDBClient({endpoint: endpoint});
  } else {
    return new DynamoDBClient({});
  }
}

export function nullOrEmpty(a: string[]):
    AttributeValue.SSMember |
    AttributeValue.NULLMember {
  return a.length > 0 ? {SS: a} : {NULL: true};
}
