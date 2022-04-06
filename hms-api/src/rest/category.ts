import {Uuid} from '../uuids';

// eslint-disable-next-line require-jsdoc
export class CategoryCreateRequest {
  title: string;
  description: string;
  hackathonId: Uuid;

  // eslint-disable-next-line require-jsdoc
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

// eslint-disable-next-line require-jsdoc
export class CategoryCreateResponse {
  id: Uuid;
  title: string;
  description: string;
  hackathonId: Uuid;

  // eslint-disable-next-line require-jsdoc
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

// eslint-disable-next-line require-jsdoc
export class CategoryListResponse {
  ids: Uuid[];
  hackathonId: Uuid;

  // eslint-disable-next-line require-jsdoc
  constructor(
      ids: Uuid[],
      hackathonId: Uuid,
  ) {
    this.ids = ids;
    this.hackathonId = hackathonId;
  }
}

// eslint-disable-next-line require-jsdoc
export class CategoryResponse {
  id: Uuid;
  title: string;
  description: string;
  hackathonId: Uuid;

  // eslint-disable-next-line require-jsdoc
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

// eslint-disable-next-line require-jsdoc
export class CategoryDeleteResponse {
  id: Uuid;

  // eslint-disable-next-line require-jsdoc
  constructor(id: Uuid) {
    this.id = id;
  }
}
