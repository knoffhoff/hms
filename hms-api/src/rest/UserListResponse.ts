/* eslint-disable require-jsdoc */

import UserPreviewResponse from './UserPreviewResponse';

export default class {
  users: UserPreviewResponse[];

  constructor(users: UserPreviewResponse[]) {
    this.users = users;
  }
}
