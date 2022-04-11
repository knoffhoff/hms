/* eslint-disable require-jsdoc */

import {Uuid} from '../util/uuids';
import ParticipantPreviewResponse from './ParticipantPreviewResponse';
import CategoryPreviewResponse from './CategoryPreviewResponse';
import IdeaPreviewResponse from './IdeaPreviewResponse';

export default class {
  id: Uuid;
  title: string;
  startDate: Date;
  endDate: Date;
  creationDate: Date;
  // Just going to set all of these as Uuids for right now
  participants: ParticipantPreviewResponse[];
  categories: CategoryPreviewResponse[];
  ideas: IdeaPreviewResponse[];

  constructor(
      id: Uuid,
      title: string,
      startDate: Date,
      endDate: Date,
      participants: ParticipantPreviewResponse[],
      categories: CategoryPreviewResponse[],
      ideas: IdeaPreviewResponse[],
  ) {
    this.id = id;
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.participants = participants;
    this.categories = categories;
    this.ideas = ideas;
  }
}
