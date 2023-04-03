/* eslint-disable require-jsdoc */

import UserPreviewResponse from './UserPreviewResponse'
import User from '../../repository/domain/User'

class UserListResponse {
  users: UserPreviewResponse[]

  constructor(users: UserPreviewResponse[]) {
    this.users = users
  }

  static from = (users: User[]): UserListResponse =>
    new UserListResponse(UserPreviewResponse.fromArray(users))
}

export default UserListResponse
