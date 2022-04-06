import {uuid, Uuid} from '../util/uuids';
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
  creationDate: Date;
  participants: Participant[];
  categories: Category[];
  ideas: Idea[];

  // eslint-disable-next-line require-jsdoc
  constructor(
      title: string,
      startDate: Date,
      endDate: Date,
  ) {
    this.id = uuid();
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.creationDate = new Date();
  }
}
