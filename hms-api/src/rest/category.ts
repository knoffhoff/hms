'use strict';

/* eslint-disable require-jsdoc */

import {Uuid} from '../util/uuids';

export class CategoryCreateRequest {
  title: string;
  description: string;
  hackathonId: Uuid;

  constructor(
      title: string,
      description: string,
      hackathonId: Uuid,
  ) {
    this.title = title;
    this.description = description;
    this.hackathonId = hackathonId;
  }
}

export class CategoryCreateResponse {
  id: Uuid;
  title: string;
  description: string;
  hackathonId: Uuid;

  constructor(
      id: Uuid,
      title: string,
      description: string,
      hackathonId: Uuid,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.hackathonId = hackathonId;
  }
}

export class CategoryListResponse {
  ids: Uuid[];
  hackathonId: Uuid;

  constructor(
      ids: Uuid[],
      hackathonId: Uuid,
  ) {
    this.ids = ids;
    this.hackathonId = hackathonId;
  }
}

export class CategoryResponse {
  id: Uuid;
  title: string;
  description: string;
  hackathonId: Uuid;

  constructor(
      id: Uuid,
      title: string,
      description: string,
      hackathonId: Uuid,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.hackathonId = hackathonId;
  }
}

export class CategoryDeleteResponse {
  id: Uuid;

  constructor(id: Uuid) {
    this.id = id;
  }
}
