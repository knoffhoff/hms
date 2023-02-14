import ParticipantListResponse from '../../src/rest/participant/ParticipantListResponse';
import {
  makeParticipant,
  ParticipantData,
} from '../repository/domain/participant-maker';
import {makeUser, UserData} from '../repository/domain/user-maker';
import ParticipantPreviewResponse from '../../src/rest/participant/ParticipantPreviewResponse';
import {uuid} from '../../src/util/Uuid';

describe('Convert From', () => {
  test('Categories are sorted', () => {
    const user1 = makeUser({firstName: 'a'} as UserData);
    const participant1 = makeParticipant({userId: user1.id} as ParticipantData);
    const user2 = makeUser({firstName: 'b'} as UserData);
    const participant2 = makeParticipant({userId: user2.id} as ParticipantData);
    const user3 = makeUser({firstName: 'c'} as UserData);
    const participant3 = makeParticipant({userId: user3.id} as ParticipantData);
    const hackathonId = uuid();

    const response = ParticipantListResponse.from(
      [participant3, participant1, participant2],
      [user3, user1, user2],
      hackathonId,
    );

    expect(response).toEqual(
      new ParticipantListResponse(
        [
          ParticipantPreviewResponse.from(participant1, user1),
          ParticipantPreviewResponse.from(participant2, user2),
          ParticipantPreviewResponse.from(participant3, user3),
        ],
        hackathonId,
      ),
    );
  });
});
