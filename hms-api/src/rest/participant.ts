/* eslint-disable require-jsdoc */

import {Uuid} from '../util/uuids';


export class ParticipantCreateRequest {
  userId: Uuid;
  hackathonId: Uuid;

  constructor(
      userId: Uuid,
      hackathonId: Uuid,
  ) {
    this.userId = userId;
    this.hackathonId = hackathonId;
  }
}

export class ParticipantCreateResponse {
  id: Uuid;
  userId: Uuid;
  hackathonId: Uuid;
  creationDate: Date;

  constructor(
      id: Uuid,
      userId: Uuid,
      hackathonId: Uuid,
      creationDate: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.hackathonId = hackathonId;
    this.creationDate = creationDate;
  }
}

export class ParticipantListResponse {
  ids: Uuid[];

  constructor(ids: Uuid[]) {
    this.ids = ids;
  }
}

export class ParticipantResponse {
  id: Uuid;
  userId: Uuid;
  hackathonId: Uuid;
  creationDate: Date;

  constructor(
      id: Uuid,
      userId: Uuid,
      hackathonId: Uuid,
      creationDate: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.hackathonId = hackathonId;
    this.creationDate = creationDate;
  }
}

export class ParticipantDeleteResponse {
  id: Uuid;

  constructor(id: Uuid) {
    this.id = id;
  }
}
