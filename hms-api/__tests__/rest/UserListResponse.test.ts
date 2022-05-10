import UserListResponse from '../../src/rest/UserListResponse';
import {makeUser, UserData} from '../repository/domain/user-maker';
import UserPreviewResponse from '../../src/rest/UserPreviewResponse';

describe('Convert From', () => {
  test('Categories are sorted', () => {
    const user1 = makeUser({firstName: 'a'} as UserData);
    const user2 = makeUser({firstName: 'b'} as UserData);
    const user3 = makeUser({firstName: 'c'} as UserData);

    const response = UserListResponse.from([user3, user1, user2]);

    expect(response).toEqual(new UserListResponse(
        [
          UserPreviewResponse.from(user1),
          UserPreviewResponse.from(user2),
          UserPreviewResponse.from(user3),
        ],
    ));
  });
});
