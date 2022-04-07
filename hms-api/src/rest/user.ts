'use strict';

import {Role} from '../domain/Role';
import {Uuid} from '../util/uuids';

// eslint-disable-next-line require-jsdoc
export class UserCreateRequest {
  lastName: string;
  firstName: string;
  emailAddress: string;
  roles: Role[];
  skills: string[];
  imageUrl: string;

  // eslint-disable-next-line require-jsdoc
  constructor(
      lastName: string,
      firstName: string,
      emailAddress: string,
      roles: Role[],
      skills: string[],
      imageUrl: string,
  ) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.emailAddress = emailAddress;
    this.roles = roles;
    this.skills = skills;
    this.imageUrl = imageUrl;
  }
}

// eslint-disable-next-line require-jsdoc
export class UserCreateResponse {
  id: Uuid;
  lastName: string;
  firstName: string;
  emailAddress: string;
  roles: Role[];
  skills: string[];
  imageUrl: string;
  creationDate: Date;

  // eslint-disable-next-line require-jsdoc
  constructor(
      id: Uuid,
      lastName: string,
      firstName: string,
      emailAddress: string,
      roles: Role[],
      skills: string[],
      imageUrl: string,
      creationDate: Date,
  ) {
    this.id = id;
    this.lastName = lastName;
    this.firstName = firstName;
    this.emailAddress = emailAddress;
    this.roles = roles;
    this.skills = skills;
    this.imageUrl = imageUrl;
    this.creationDate = creationDate;
  }
}

// eslint-disable-next-line require-jsdoc
export class UserListResponse {
  ids: Uuid[];

  // eslint-disable-next-line require-jsdoc
  constructor(ids: Uuid[]) {
    this.ids = ids;
  }
}

// eslint-disable-next-line require-jsdoc
export class UserResponse {
  id: Uuid;
  lastName: string;
  firstName: string;
  emailAddress: string;
  roles: Role[];
  skills: string[];
  imageUrl: string;
  creationDate: Date;

  // eslint-disable-next-line require-jsdoc
  constructor(
      id: Uuid,
      lastName: string,
      firstName: string,
      emailAddress: string,
      roles: Role[],
      skills: string[],
      imageUrl: string,
      creationDate: Date,
  ) {
    this.id = id;
    this.lastName = lastName;
    this.firstName = firstName;
    this.emailAddress = emailAddress;
    this.roles = roles;
    this.skills = skills;
    this.imageUrl = imageUrl;
    this.creationDate = creationDate;
  }
}

// eslint-disable-next-line require-jsdoc
export class UserDeleteResponse {
  id: Uuid;

  // eslint-disable-next-line require-jsdoc
  constructor(id: Uuid) {
    this.id = id;
  }
}
