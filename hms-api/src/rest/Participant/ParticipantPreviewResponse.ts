/* eslint-disable require-jsdoc */

import Uuid from '../../util/Uuid';
import UserPreviewResponse from '../User/UserPreviewResponse';
import Participant from '../../repository/domain/Participant';
import User from '../../repository/domain/User';
import {extractUser} from '../../service/user-service';

class ParticipantPreviewResponse {
  id: Uuid;
  user: UserPreviewResponse;

  constructor(id: Uuid, user: UserPreviewResponse) {
    this.id = id;
    this.user = user;
  }

  static from = (
    participant: Participant,
    user: User,
  ): ParticipantPreviewResponse =>
    new ParticipantPreviewResponse(
      participant.id,
      UserPreviewResponse.from(user),
    );

  static fromArray(
    participants: Participant[],
    users: User[],
  ): ParticipantPreviewResponse[] {
    const previews: ParticipantPreviewResponse[] = [];
    for (const participant of participants) {
      previews.push(
        ParticipantPreviewResponse.from(
          participant,
          extractUser(users, participant),
        ),
      );
    }
    return previews.sort(this.compare);
  }

  static compare(
    a: ParticipantPreviewResponse,
    b: ParticipantPreviewResponse,
  ): number {
    const diff = UserPreviewResponse.compare(a.user, b.user);
    if (diff) {
      return diff;
    }

    return a.id.localeCompare(b.id);
  }
}

export default ParticipantPreviewResponse;
