import {getClient, safeTransformArray} from '../../src/repository/dynamo-db';
import * as RunningLocalStack from '../../src/util/running-localstack';

describe('getClient()', () => {
  const hostname = 'localstack';

  beforeAll(() => {
    process.env.AWS_REGION = 'eu-central-1';
    process.env.LOCALSTACK_HOSTNAME = hostname;
  });

  test('Endpoint is properly set when LocalStack on', async () => {
    jest.spyOn(RunningLocalStack, 'default').mockImplementation(() => true);

    const endpoint = await getClient().config.endpoint();
    expect(endpoint.protocol).toBe('http:');
    expect(endpoint.hostname).toBe(hostname);
    expect(endpoint.port).toBe(4566);
    expect(endpoint.path).toBe('/');
    expect(endpoint.query).toBe(undefined);
  });

  test('Endpoint is properly set when LocalStack off', async () => {
    jest.spyOn(RunningLocalStack, 'default').mockImplementation(() => false);

    const endpoint = await getClient().config.endpoint();
    expect(endpoint.protocol).toBe('https:');
    expect(endpoint.hostname).toBe('dynamodb.eu-central-1.amazonaws.com');
    expect(endpoint.port).toBe(undefined);
    expect(endpoint.path).toBe('/');
    expect(endpoint.query).toBe(undefined);
  });
});

describe('safeTransformArray', () => {
  test('Array with values transformed to SS AttributeValue', () => {
    const array = ['thing1', 'thing2', 'thing3'];
    expect(safeTransformArray(array)).toStrictEqual({SS: array});
  });

  test('Empty array is transformed to NULL AttributeValue', () => {
    expect(safeTransformArray([])).toStrictEqual({NULL: true});
  });

  test('null is transformed to NULL AttributeValue', () => {
    expect(safeTransformArray(null)).toStrictEqual({NULL: true});
  });

  test('undefined is transformed to NULL AttributeValue', () => {
    expect(safeTransformArray(undefined)).toStrictEqual({NULL: true});
  });
});
