/* eslint-disable require-jsdoc */

export default class {
  lastName: string;
  firstName: string;
  emailAddress: string;
  roles: string[];
  skills: string[];
  imageUrl: string;

  constructor(
      lastName: string,
      firstName: string,
      emailAddress: string,
      roles: string[],
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
