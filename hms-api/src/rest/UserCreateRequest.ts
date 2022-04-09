/* eslint-disable require-jsdoc */

import {Uuid} from '../util/uuids';

export default class {
  lastName: string;
  firstName: string;
  emailAddress: string;
  roles: string[];
  skills: Uuid[];
  imageUrl: string;

  constructor(
      lastName: string,
      firstName: string,
      emailAddress: string,
      roles: string[],
      skills: Uuid[],
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
