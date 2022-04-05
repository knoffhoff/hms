import {Uuid} from '../uuids';
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
  roles: Set<Role>;
  skills: Set<Skill>;
  imageUrl: string;
}

