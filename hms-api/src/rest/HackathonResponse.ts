/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';
import ParticipantPreviewResponse from './ParticipantPreviewResponse';
import CategoryPreviewResponse from './CategoryPreviewResponse';
import IdeaPreviewResponse from './IdeaPreviewResponse';
import Hackathon from '../repository/domain/Hackathon';
import Category from '../repository/domain/Category';
import Participant from '../repository/domain/Participant';
import Idea from '../repository/domain/Idea';
import User from '../repository/domain/User';

class HackathonResponse {
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

  static from = (
      hackathon: Hackathon,
      participants: Participant[],
      users: User[],
      categories: Category[],
      ideas: Idea[],
  ): HackathonResponse => new HackathonResponse(
      hackathon.id,
      hackathon.title,
      hackathon.startDate,
      hackathon.endDate,
      ParticipantPreviewResponse.fromArray(participants, users),
      CategoryPreviewResponse.fromArray(categories),
      IdeaPreviewResponse.fromArray(ideas),
  );
}

export default HackathonResponse;
