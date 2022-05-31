/* eslint-disable require-jsdoc */

import {AttributeValue as AV, DynamoDBClient} from '@aws-sdk/client-dynamodb';
import runningLocalStack from '../util/running-localstack';

export function getClient(): DynamoDBClient {
  if (runningLocalStack()) {
    const endpoint = 'http://' + process.env.LOCALSTACK_HOSTNAME + ':4566';
    return new DynamoDBClient({endpoint: endpoint});
  } else {
    const endpoint = 'http://localhost:8000';
    return new DynamoDBClient({endpoint: endpoint});
  }
}

export const safeTransformArray = (
    a: string[],
): AV.SSMember | AV.NULLMember => !!a && a.length > 0 ? {SS: a} : {NULL: true};

export const safeTransformSSMember = (
    ss: AV | undefined,
): string[] => !!ss && !!ss.SS ? ss.SS : [];
