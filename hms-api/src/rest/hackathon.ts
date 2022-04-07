'use strict';

/* eslint-disable require-jsdoc */

import {Uuid} from '../util/uuids';

export class HackathonCreateRequest {
  title: string;
  startDate: Date;
  endDate: Date;

  constructor(
      title: string,
      startDate: Date,
      endDate: Date,
  ) {
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

export class HackathonCreateResponse {
  id: Uuid;

  constructor(
      id: Uuid,
  ) {
    this.id = id;
  }
}

export class HackathonListResponse {
  ids: Uuid[];

  constructor(ids: Uuid[]) {
    this.ids = ids;
  }
}

export class HackathonResponse {
  id: Uuid;
  title: string;
  startDate: Date;
  endDate: Date;
  creationDate: Date;
  // Just going to set all of these as Uuids for right now
  participantIds: Uuid[];
  categoryIds: Uuid[];
  ideaIds: Uuid[];

  constructor(
      id: Uuid,
      title: string,
      startDate: Date,
      endDate: Date,
      participantIds: Uuid[],
      categoryIds: Uuid[],
      ideaIds: Uuid[],
  ) {
    this.id = id;
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.participantIds = participantIds;
    this.categoryIds = categoryIds;
    this.ideaIds = ideaIds;
  }
}

export class HackathonDeleteResponse {
  id: Uuid;

  constructor(id: Uuid) {
    this.id = id;
  }
}
