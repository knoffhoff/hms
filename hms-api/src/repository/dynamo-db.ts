/* eslint-disable require-jsdoc */

import {AttributeValue as AV, DynamoDBClient} from '@aws-sdk/client-dynamodb';
import runningLocalStack from '../util/running-localstack';

export function getClient(): DynamoDBClient {
  if (runningLocalStack()) {
    const endpoint = 'http://' + process.env.LOCALSTACK_HOSTNAME + ':4566';
    return new DynamoDBClient({endpoint: endpoint});
  } else {
    return new DynamoDBClient({});
  }
}

export const safeTransformArray = (a: string[]): AV.SSMember | AV.NULLMember =>
    !!a && a.length > 0 ? {SS: a} : {NULL: true};
