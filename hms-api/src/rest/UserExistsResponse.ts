/* eslint-disable require-jsdoc */

class UserExistsResponse {
  emailAddress: string;
  exists: boolean;

  constructor(
      emailAddress: string,
      exists: boolean,
  ) {
    this.emailAddress = emailAddress;
    this.exists = exists;
  }

  static from = (
      emailAddress: string,
      exists: boolean,
  ): UserExistsResponse => new UserExistsResponse(
      emailAddress,
      exists,
  );
}

export default UserExistsResponse;
