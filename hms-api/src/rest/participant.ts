'use strict';

import {Uuid} from '../util/uuids';

// eslint-disable-next-line require-jsdoc
export class ParticipantCreateRequest {
  userId: Uuid;
  hackathonId: Uuid;

  // eslint-disable-next-line require-jsdoc
  constructor(
      userId: Uuid,
      hackathonId: Uuid,
  ) {
    this.userId = userId;
    this.hackathonId = hackathonId;
  }
}

// eslint-disable-next-line require-jsdoc
export class ParticipantCreateResponse {
  id: Uuid;
  userId: Uuid;
  hackathonId: Uuid;
  creationDate: Date;

  // eslint-disable-next-line require-jsdoc
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

// eslint-disable-next-line require-jsdoc
export class ParticipantListResponse {
  ids: Uuid[];

  // eslint-disable-next-line require-jsdoc
  constructor(ids: Uuid[]) {
    this.ids = ids;
  }
}

// eslint-disable-next-line require-jsdoc
export class ParticipantResponse {
  id: Uuid;
  userId: Uuid;
  hackathonId: Uuid;
  creationDate: Date;

  // eslint-disable-next-line require-jsdoc
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

// eslint-disable-next-line require-jsdoc
export class ParticipantDeleteResponse {
  id: Uuid;

  // eslint-disable-next-line require-jsdoc
  constructor(id: Uuid) {
    this.id = id;
  }
}
