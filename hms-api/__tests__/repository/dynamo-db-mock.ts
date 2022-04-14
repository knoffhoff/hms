/* eslint-disable require-jsdoc */

import * as dynamoDb from '../../src/repository/dynamo-db';
import {
  AttributeValue,
  DynamoDBClient,
  GetItemCommandOutput,
  PutItemCommandOutput,
  QueryCommandOutput,
} from '@aws-sdk/client-dynamodb';

export const mockSend = jest.fn();
beforeEach(mockSend.mockReset);

jest.spyOn(dynamoDb, 'getClient').mockImplementation(() => {
  return {
    send: mockSend,
  } as unknown as DynamoDBClient;
});

export function mockGetItem(item: { [key: string]: AttributeValue }): void {
  mockSend.mockResolvedValue({Item: item} as GetItemCommandOutput);
}

export function mockGetItemOnce(item: { [key: string]: AttributeValue }): void {
  mockSend.mockResolvedValueOnce({Item: item} as GetItemCommandOutput);
}

export function mockQuery(items: { [key: string]: AttributeValue }[]): void {
  mockSend.mockResolvedValue({Items: items} as QueryCommandOutput);
}

export function mockPut(): void {
  mockSend.mockResolvedValue({} as PutItemCommandOutput);
}
