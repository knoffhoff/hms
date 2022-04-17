import Uuid, {uuid} from '../../util/Uuid';

/**
 * Representation of a hackathon within the Database
 */
export default class {
  id: Uuid;
  title: string;
  startDate: Date;
  endDate: Date;
  creationDate: Date;
  participantIds: string[];
  categoryIds: string[];
  ideaIds: string[];

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
      participantIds: string[],
      categoryIds: string[],
      ideaIds: string[],
  );

  // eslint-disable-next-line require-jsdoc
  constructor(
      title: string,
      startDate: Date,
      endDate: Date,
      id: Uuid = uuid(),
      creationDate: Date = new Date(),
      participantIds: string[] = [],
      categoryIds: string[] = [],
      ideaIds: string[] = [],
  ) {
    this.id = id;
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.creationDate = creationDate;
    this.participantIds = participantIds;
    this.categoryIds = categoryIds;
    this.ideaIds = ideaIds;
  }
}
