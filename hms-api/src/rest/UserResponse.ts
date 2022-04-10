/* eslint-disable require-jsdoc */

import {Uuid} from '../util/uuids';
import SkillPreviewResponse from './SkillPreviewResponse';

export default class {
  id: Uuid;
  lastName: string;
  firstName: string;
  emailAddress: string;
  roles: string[];
  skills: SkillPreviewResponse[];
  imageUrl: string;
  creationDate: Date;

  constructor(
      id: Uuid,
      lastName: string,
      firstName: string,
      emailAddress: string,
      roles: string[],
      skills: SkillPreviewResponse[],
      imageUrl: string,
      creationDate: Date,
  ) {
    this.id = id;
    this.lastName = lastName;
    this.firstName = firstName;
    this.emailAddress = emailAddress;
    this.roles = roles;
    this.skills = skills;
    this.imageUrl = imageUrl;
    this.creationDate = creationDate;
  }
}
