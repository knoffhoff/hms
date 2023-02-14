import * as userService from '../../../src/service/user-service';
import {remove} from '../../../src/handler/user/remove';
import UserDeleteResponse from '../../../src/rest/user/UserDeleteResponse';
import Uuid, {uuid} from '../../../src/util/Uuid';

const mockRemoveUser = jest.fn();
jest.spyOn(userService, 'removeUser').mockImplementation(mockRemoveUser);

describe('Delete User', () => {
  test('Happy Path', async () => {
    const id = uuid();
    mockRemoveUser.mockResolvedValue(new UserDeleteResponse(id));
    const event = toEvent(id);
    const callback = jest.fn();

    await remove(event, null, callback);

    expect(mockRemoveUser).toHaveBeenCalledWith(id);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new UserDeleteResponse(id)),
    });
  });

  test('Throws Error', async () => {
    const errorMessage = 'generic error message';
    mockRemoveUser.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const callback = jest.fn();

    await remove(toEvent(uuid()), null, callback);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({errorMessage: errorMessage}),
    });
  });
});

const toEvent = (id: Uuid): object => ({
  pathParameters: {
    id: id,
  },
});
