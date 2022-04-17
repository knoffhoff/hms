/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';
import SkillPreviewResponse from './SkillPreviewResponse';
import User from '../repository/domain/User';
import {mapRolesToStrings} from '../repository/domain/Role';
import Skill from '../repository/domain/Skill';

class UserResponse {
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

  static from = (
      user: User,
      skills: Skill[],
  ): UserResponse => new UserResponse(
      user.id,
      user.lastName,
      user.firstName,
      user.emailAddress,
      mapRolesToStrings(user.roles),
      SkillPreviewResponse.fromArray(skills),
      user.imageUrl,
      user.creationDate,
  );
}

export default UserResponse;
