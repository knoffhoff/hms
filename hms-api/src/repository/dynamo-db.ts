/* eslint-disable require-jsdoc */
// TODO the way the endpoint is set is... hacky

import {AttributeValue, DynamoDBClient} from '@aws-sdk/client-dynamodb';
import isLocal from '../util/isLocal';

export const dynamoDBClient = new DynamoDBClient(isLocal() ?
    {endpoint: 'http://' + process.env.LOCALSTACK_HOSTNAME + ':4566'} :
    {});

export function nullOrEmpty(a: string[]):
    AttributeValue.SSMember |
    AttributeValue.NULLMember {
  return a.length > 0 ? {SS: a} : {NULL: true};
}
