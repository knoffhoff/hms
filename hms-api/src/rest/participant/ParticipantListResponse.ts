/* eslint-disable require-jsdoc */

import ParticipantPreviewResponse from './ParticipantPreviewResponse';
import Uuid from '../../util/Uuid';
import Participant from '../../repository/domain/Participant';
import User from '../../repository/domain/User';

class ParticipantListResponse {
  participants: ParticipantPreviewResponse[];
  hackathonId: Uuid;

  constructor(participants: ParticipantPreviewResponse[], hackathonId: Uuid) {
    this.participants = participants;
    this.hackathonId = hackathonId;
  }

  static from = (
    participants: Participant[],
    users: User[],
    hackathonId: Uuid,
  ): ParticipantListResponse =>
    new ParticipantListResponse(
      ParticipantPreviewResponse.fromArray(participants, users),
      hackathonId,
    );
}

export default ParticipantListResponse;
