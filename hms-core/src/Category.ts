import {Uuid} from './uuid_help';
import {Hackathon} from './Hackathon';

/**
 * Each Hackathon has a number of Categories and each Category has a number of
 * Ideas
 */
export class Category {
  id: Uuid;
  title: string;
  description: string;
  hackathon: Hackathon;
}
