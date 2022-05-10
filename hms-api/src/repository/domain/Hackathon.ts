/* eslint-disable require-jsdoc */

import Uuid, {uuid} from '../../util/Uuid';

/**
 * Representation of a hackathon within the Database
 */
class Hackathon {
  id: Uuid;
  title: string;
  startDate: Date;
  endDate: Date;
  creationDate: Date;

  constructor(
      title: string,
      startDate: Date,
      endDate: Date,
  );
  constructor(
      title: string,
      startDate: Date,
      endDate: Date,
      id: Uuid,
      creationDate: Date,
  );

  constructor(
      title: string,
      startDate: Date,
      endDate: Date,
      id: Uuid = uuid(),
      creationDate: Date = new Date(),
  ) {
    this.id = id;
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.creationDate = creationDate;
  }
}

export default Hackathon;
