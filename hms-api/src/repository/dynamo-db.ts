/* eslint-disable require-jsdoc */

import {AttributeValue as AV, DynamoDBClient} from '@aws-sdk/client-dynamodb';

export function getClient(): DynamoDBClient {
  if (process.env.IS_OFFLINE === 'true') {
    const endpoint = 'http://localhost:8000';
    return new DynamoDBClient({endpoint: endpoint});
  } else {
    return new DynamoDBClient({});
  }
}

export const safeTransformArray = (a: string[]): AV.SSMember | AV.NULLMember =>
  !!a && a.length > 0 ? {SS: a} : {NULL: true};

export const safeTransformSSMember = (ss: AV | undefined): string[] =>
  !!ss && !!ss.SS ? ss.SS : [];
