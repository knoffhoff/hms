import {wrapHandler} from '../../src/handler/handler-wrapper';
import NotFoundError from '../../src/error/NotFoundError';
import ReferenceNotFoundError from '../../src/error/ReferenceNotFoundError';
import InvalidStateError from '../../src/error/InvalidStateError';
import ValidationError from '../../src/error/ValidationError';
import ValidationResult from '../../src/error/ValidationResult';

describe('Wrap Handler', () => {
  test('Calls provided function', async () => {
    const fun = jest.fn();
    const callback = jest.fn();

    await wrapHandler(fun, callback);

    expect(fun).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
  });

  test('Catches NotFoundError', async () => {
    const message = "We couldn't find that thing you wanted";
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
    const message = "We couldn't find that thing your thing wanted";
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

  test('Catches InvalidStateError', async () => {
    const message = "We couldn't find that thing your thing wanted";
    const callback = jest.fn();

    await wrapHandler(() => {
      throw new InvalidStateError(message);
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

  test('Catches Validation Error', async () => {
    const result = new ValidationResult();
    result.addFailure('Failure #1');
    result.addFailure('Failure #2');
    const message = 'That object was a bit too ugly';
    const validationError = new ValidationError(message, result);
    const callback = jest.fn();

    await wrapHandler(() => {
      throw validationError;
    }, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 422,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({errorMessage: validationError.message}),
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
