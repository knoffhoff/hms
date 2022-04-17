/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';

class ParticipantCreateRequest {
  userId: Uuid;
  hackathonId: Uuid;

  constructor(
      userId: Uuid,
      hackathonId: Uuid,
  ) {
    this.userId = userId;
    this.hackathonId = hackathonId;
  }

  static parse(body: string): ParticipantCreateRequest {
    const json = JSON.parse(body);
    return new ParticipantCreateRequest(json.userId, json.hackathonId);
  }
}

export default ParticipantCreateRequest;
