import {Uuid} from '../../util/uuids';
import {Role} from './Role';
import {Skill} from './Skill';

/**
 * A User is a representation of a person in the HMS API.
 */
export class User {
  id: Uuid;
  lastName: string;
  firstName: string;
  emailAddress: string;
  roles: Role[];
  skills: Skill[];
  imageUrl: string;
  creationDate: Date;
}

