import {uuid, Uuid} from '../../util/uuids';

/**
 * Each Hackathon has a number of Categories and each Category has a number of
 * Ideas
 */
export default class {
  id: Uuid;
  title: string;
  description: string;
  hackathonId: Uuid;

  constructor(
      title: string,
      description: string,
      hackathonId: Uuid,
  );
  constructor(
      title: string,
      description: string,
      hackathonId: Uuid,
      id: Uuid,
  );

  // eslint-disable-next-line require-jsdoc
  constructor(
      title: string,
      description: string,
      hackathonId: Uuid,
      id: Uuid = uuid(),
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.hackathonId = hackathonId;
  }
}
