import {Uuid} from './uuid_help';
import {Participant} from './Participant';
import {Category} from './Category';
import {Idea} from './Idea';

/**
 * Representation of a hackathon
 */
export class Hackathon {
  id: Uuid;
  title: string;
  startDate: Date;
  endDate: Date;
  participants: Set<Participant>;
  categories: Set<Category>;
  ideas: Set<Idea>;
}
