/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';

class UserEditRequest {
  lastName: string;
  firstName: string;
  skills: Uuid[];
  imageUrl: string;

  constructor(
      lastName: string,
      firstName: string,
      skills: Uuid[],
      imageUrl: string,
  ) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.skills = skills;
    this.imageUrl = imageUrl;
  }

  static parse(body: string): UserEditRequest {
    const json = JSON.parse(body);
    return new UserEditRequest(
        json.lastName,
        json.firstName,
        json.skills,
        json.imageUrl,
    );
  }
}

export default UserEditRequest;
