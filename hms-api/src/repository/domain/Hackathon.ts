/* eslint-disable require-jsdoc */

import Uuid, {uuid} from '../../util/Uuid';

/**
 * Representation of a hackathon within the Database
 */
class Hackathon {
  id: Uuid;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  creationDate: Date;

  constructor(
      title: string,
      description: string,
      startDate: Date,
      endDate: Date,
  );
  constructor(
      title: string,
      description: string,
      startDate: Date,
      endDate: Date,
      id: Uuid,
      creationDate: Date,
  );

  constructor(
      title: string,
      description: string,
      startDate: Date,
      endDate: Date,
      id: Uuid = uuid(),
      creationDate: Date = new Date(),
  ) {
    this.title = title;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.id = id;
    this.creationDate = creationDate;
  }
}

export default Hackathon;
