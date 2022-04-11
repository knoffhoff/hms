/* eslint-disable require-jsdoc */

import {Uuid} from '../util/uuids';
import UserPreviewResponse from './UserPreviewResponse';
import Participant from '../repository/domain/Participant';
import User from '../repository/domain/User';

class ParticipantPreviewResponse {
  id: Uuid;
  user: UserPreviewResponse;

  constructor(
      id: Uuid,
      user: UserPreviewResponse,
  ) {
    this.id = id;
    this.user = user;
  }

  static from = (participant: Participant, user: User)
      : ParticipantPreviewResponse =>
    new ParticipantPreviewResponse(
        participant.id,
        UserPreviewResponse.from(user),
    );

  static fromArray(participants: Participant[], users: User[])
      : ParticipantPreviewResponse[] {
    const previews: ParticipantPreviewResponse[] = [];
    for (const participant of participants) {
      previews.push(ParticipantPreviewResponse.from(
          participant,
          users.find((user) => user.id === participant.userId)));
    }
    return previews;
  }
}

export default ParticipantPreviewResponse;
