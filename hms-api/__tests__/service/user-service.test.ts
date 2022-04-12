import {extractUser} from '../../src/service/user-service';
import Participant from '../../src/repository/domain/Participant';
import {uuid} from '../../src/util/uuids';
import {
  makeParticipant,
  makeUser,
  ParticipantData,
  randomUser,
  UserData,
} from '../makers';

describe('Extract User For Participant', () => {
  test('When user not in list', () => {
    const participant = new Participant(uuid(), uuid());

    expect(extractUser([], participant)).toBeUndefined();
  });

  test('When user in singleton list', () => {
    const user = makeUser({} as UserData);
    const participant = makeParticipant({userId: user.id} as ParticipantData);

    expect(extractUser([user], participant)).toBe(user);
  });

  test('When user in list', () => {
    const user = makeUser({} as UserData);
    const participant = makeParticipant({userId: user.id} as ParticipantData);

    expect(extractUser(
        [randomUser(), user, randomUser()],
        participant)).toBe(user);
  });
});
