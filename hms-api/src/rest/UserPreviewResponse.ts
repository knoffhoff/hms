/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';
import User from '../repository/domain/User';

class UserPreviewResponse {
  id: Uuid;
  lastName?: string;
  firstName: string;
  emailAddress: string;
  imageUrl?: string;

  constructor(
    id: Uuid,
    lastName: string,
    firstName: string,
    emailAddress: string,
    imageUrl: string,
  ) {
    this.id = id;
    this.lastName = lastName;
    this.firstName = firstName;
    this.emailAddress = emailAddress;
    this.imageUrl = imageUrl;
  }

  static from = (user: User): UserPreviewResponse =>
    new UserPreviewResponse(
      user.id,
      user.lastName,
      user.firstName,
      user.emailAddress,
      user.imageUrl,
    );

  static fromArray(users: User[]): UserPreviewResponse[] {
    const previews: UserPreviewResponse[] = [];
    for (const user of users) {
      previews.push(UserPreviewResponse.from(user));
    }
    return previews.sort(this.compare);
  }

  static compare(a: UserPreviewResponse, b: UserPreviewResponse): number {
    let diff = a.firstName.localeCompare(b.firstName);
    if (diff) {
      return diff;
    }

    diff = a.lastName.localeCompare(b.lastName);
    if (diff) {
      return diff;
    }

    return a.id.localeCompare(b.id);
  }
}

export default UserPreviewResponse;
