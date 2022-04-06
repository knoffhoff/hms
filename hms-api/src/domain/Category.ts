import {uuid, Uuid} from '../uuids';
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

  // eslint-disable-next-line require-jsdoc
  constructor(
      title: string,
      description: string,
      hackathon: Hackathon,
  ) {
    this.id = uuid();
    this.title = title;
    this.description = description;
    this.hackathon = hackathon;
  }
}
