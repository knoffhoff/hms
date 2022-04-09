import {uuid, Uuid} from '../../util/uuids';
import {Role} from './Role';

/**
 * A User is a representation of a person in the HMS API.
 */
export default class {
  id: Uuid;
  lastName: string;
  firstName: string;
  emailAddress: string;
  roles: Role[];
  skills: string[];
  imageUrl: string;
  creationDate: Date;

  constructor(
      lastName: string,
      firstName: string,
      emailAddress: string,
      roles: Role[],
      skills: string[],
      imageUrl: string,
  );
  constructor(
      lastName: string,
      firstName: string,
      emailAddress: string,
      roles: Role[],
      skills: string[],
      imageUrl: string,
      id: Uuid,
      creationDate: Date,
  );

  // eslint-disable-next-line require-jsdoc
  constructor(
      lastName: string,
      firstName: string,
      emailAddress: string,
      roles: Role[],
      skills: string[],
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
