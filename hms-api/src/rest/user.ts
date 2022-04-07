'use strict';

/* eslint-disable require-jsdoc */

import {Role} from '../repository/domain/Role';
import {Uuid} from '../util/uuids';

export class UserCreateRequest {
  lastName: string;
  firstName: string;
  emailAddress: string;
  roles: Role[];
  skills: string[];
  imageUrl: string;

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

export class UserCreateResponse {
  id: Uuid;
  lastName: string;
  firstName: string;
  emailAddress: string;
  roles: Role[];
  skills: string[];
  imageUrl: string;
  creationDate: Date;

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

export class UserListResponse {
  ids: Uuid[];

  constructor(ids: Uuid[]) {
    this.ids = ids;
  }
}

export class UserResponse {
  id: Uuid;
  lastName: string;
  firstName: string;
  emailAddress: string;
  roles: Role[];
  skills: string[];
  imageUrl: string;
  creationDate: Date;

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

export class UserDeleteResponse {
  id: Uuid;

  constructor(id: Uuid) {
    this.id = id;
  }
}
