import {wrapHandler} from '../../src/handler/handler-wrapper';
import NotFoundError from '../../src/error/NotFoundError';
import ReferenceNotFoundError from '../../src/error/ReferenceNotFoundError';

describe('Wrap Handler', () => {
  test('Calls provided function', async () => {
    const fun = jest.fn();
    const callback = jest.fn();

    await wrapHandler(fun, callback);

    expect(fun).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
  });

  test('Catches NotFoundError', async () => {
    const message = 'We couldn\'t find that thing you wanted';
    const callback = jest.fn();

    await wrapHandler(() => {
      throw new NotFoundError(message);
    }, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({errorMessage: message}),
    });
  });

  test('Catches ReferenceNotFoundError', async () => {
    const message = 'We couldn\'t find that thing your thing wanted';
    const callback = jest.fn();

    await wrapHandler(() => {
      throw new ReferenceNotFoundError(message);
    }, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({errorMessage: message}),
    });
  });

  test('Catches General Error', async () => {
    const message = 'Something really wrong happened';
    const callback = jest.fn();

    await wrapHandler(() => {
      throw new Error(message);
    }, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({errorMessage: message}),
    });
  });
});
