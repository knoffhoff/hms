/* eslint-disable require-jsdoc */

import Uuid, {uuid} from '../../util/Uuid';
import Role from './Role';
import ValidationResult from '../../error/ValidationResult';

/**
 * A User is a representation of a person within the HMS
 *
 * A User maps to 0 or more Participants
 *
 * A User has 0 or more Skills
 */
export default class {
  /**
   * The ID of the User
   *
   * Generated upon creation
   */
  id: Uuid;

  /**
   * The last name of the User
   *
   * May be null
   */
  lastName?: string;

  /**
   * The first name of the User
   *
   * Must have text (cannot be empty)
   */
  firstName: string;

  /**
   * The email address of the User
   *
   * Must be a valid email address
   */
  emailAddress: string;

  /**
   * The roles which the User has
   *
   * Should have at least 1 value
   */
  roles: Role[];

  /**
   * The skills which the User has
   *
   * May be empty
   */
  skills: Uuid[];

  /**
   * An image depicting the user, or anything else of their choosing
   *
   * May be null
   *
   * TODO this could be a URL
   */
  imageUrl?: string;

  /**
   * The date on which the User was created
   *
   * Generated upon creation
   */
  creationDate: Date;

  validate(): ValidationResult {
    const result = new ValidationResult();
    if (this.firstName.length === 0) {
      result.addFailure('firstName has length 0');
    }

    if (this.roles.length === 0) {
      result.addFailure('roles has length 0');
    }
    return result;
  }

  constructor(
      lastName: string,
      firstName: string,
      emailAddress: string,
      roles: Role[],
      skills: Uuid[],
      imageUrl: string,
  );
  constructor(
      lastName: string,
      firstName: string,
      emailAddress: string,
      roles: Role[],
      skills: Uuid[],
      imageUrl: string,
      id: Uuid,
      creationDate: Date,
  );

  constructor(
      lastName: string,
      firstName: string,
      emailAddress: string,
      roles: Role[],
      skills: Uuid[],
      imageUrl: string,
      id: Uuid = uuid(),
      creationDate: Date = new Date(),
  ) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.emailAddress = emailAddress;
    this.roles = roles;
    this.skills = skills;
    this.imageUrl = imageUrl;
    this.id = id;
    this.creationDate = creationDate;
  }
}
