import {uuid, Uuid} from '../../util/uuids';

/**
 * A single User participating in a Hackathon
 */
export default class {
  id: Uuid;
  userId: Uuid;
  hackathonId: Uuid;
  creationDate: Date;

  constructor(
      userId: Uuid,
      hackathonId: Uuid,
  );
  constructor(
      userId: Uuid,
      hackathonId: Uuid,
      id: Uuid,
      creationDate: Date,
  );

  // eslint-disable-next-line require-jsdoc
  constructor(
      userId: Uuid,
      hackathonId: Uuid,
      id: Uuid = uuid(),
      creationDate: Date = new Date(),
  ) {
    this.id = id;
    this.userId = userId;
    this.hackathonId = hackathonId;
    this.creationDate = creationDate;
  }
}
