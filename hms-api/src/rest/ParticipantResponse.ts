/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';
import UserPreviewResponse from './UserPreviewResponse';
import HackathonPreviewResponse from './HackathonPreviewResponse';

export default class {
  id: Uuid;
  user: UserPreviewResponse;
  hackathon: HackathonPreviewResponse;
  creationDate: Date;

  constructor(
      id: Uuid,
      user: UserPreviewResponse,
      hackathon: HackathonPreviewResponse,
      creationDate: Date,
  ) {
    this.id = id;
    this.user = user;
    this.hackathon = hackathon;
    this.creationDate = creationDate;
  }
}
