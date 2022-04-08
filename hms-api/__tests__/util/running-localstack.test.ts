import runningLocalstack from '../../src/util/running-localstack';

describe('Detecting Running LocalStack', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {...OLD_ENV};
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('LOCALSTACK_HOSTNAME with no value counts as not running', () => {
    expect(runningLocalstack()).toBe(false);
  });

  test('LOCALSTACK_HOSTNAME with empty value counts as not running', () => {
    process.env.LOCALSTACK_HOSTNAME = '';

    expect(runningLocalstack()).toBe(false);
  });

  test('LOCALSTACK_HOSTNAME with value counts as running', () => {
    process.env.LOCALSTACK_HOSTNAME = 'localhost';

    expect(runningLocalstack()).toBe(true);
  });
});
