/* eslint-disable require-jsdoc */

class UserExistsResponse {
  id: string
  emailAddress: string
  exists: boolean

  constructor(id: string, emailAddress: string, exists: boolean) {
    this.id = id
    this.emailAddress = emailAddress
    this.exists = exists
  }

  static from = (
    id: string,
    emailAddress: string,
    exists: boolean
  ): UserExistsResponse => new UserExistsResponse(id, emailAddress, exists)
}

export default UserExistsResponse
