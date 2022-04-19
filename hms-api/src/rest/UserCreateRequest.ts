/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';
import Role, {mapStringToRoles} from '../repository/domain/Role';

class UserCreateRequest {
  lastName: string;
  firstName: string;
  emailAddress: string;
  roles: Role[];
  skills: Uuid[];
  imageUrl: string;

  constructor(
      lastName: string,
      firstName: string,
      emailAddress: string,
      roles: Role[],
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

  static parse(body: string): UserCreateRequest {
    const json = JSON.parse(body);
    return new UserCreateRequest(
        json.lastName,
        json.firstName,
        json.emailAddress,
        mapStringToRoles(json.roles),
        json.skills,
        json.imageUrl,
    );
  }
}

export default UserCreateRequest;
