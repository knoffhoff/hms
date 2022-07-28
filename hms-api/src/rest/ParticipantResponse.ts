/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';
import UserPreviewResponse from './UserPreviewResponse';
import HackathonPreviewResponse from './HackathonPreviewResponse';
import Participant from '../repository/domain/Participant';
import User from '../repository/domain/User';
import Hackathon from '../repository/domain/Hackathon';

class ParticipantResponse {
  id: Uuid;
  user: UserPreviewResponse;
  hackathon: HackathonPreviewResponse;
  creationDate: Date;

  constructor(
    id: Uuid,
    user: UserPreviewResponse,
    hackathon: HackathonPreviewResponse,
    creationDate: Date,
  ) {
    this.id = id;
    this.user = user;
    this.hackathon = hackathon;
    this.creationDate = creationDate;
  }

  static from = (
    participant: Participant,
    user: User,
    hackathon: Hackathon,
  ): ParticipantResponse =>
    new ParticipantResponse(
      participant.id,
      UserPreviewResponse.from(user),
      HackathonPreviewResponse.from(hackathon),
      participant.creationDate,
    );
}

export default ParticipantResponse;
