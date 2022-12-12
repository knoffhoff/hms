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
  description: string;
  startDate: Date;
  endDate: Date;
  creationDate: Date;
  // Just going to set all of these as Uuids for right now
  participants: ParticipantPreviewResponse[];
  categories: CategoryPreviewResponse[];
  ideas: IdeaPreviewResponse[];
  votingOpened: boolean;

  constructor(
    id: Uuid,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    participants: ParticipantPreviewResponse[],
    categories: CategoryPreviewResponse[],
    ideas: IdeaPreviewResponse[],
    votingOpened: boolean,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.participants = participants;
    this.categories = categories;
    this.ideas = ideas;
    this.votingOpened = votingOpened;
  }

  static from = (
    hackathon: Hackathon,
    participants: Participant[],
    users: User[],
    categories: Category[],
    ideas: Idea[],
  ): HackathonResponse =>
    new HackathonResponse(
      hackathon.id,
      hackathon.title,
      hackathon.description,
      hackathon.startDate,
      hackathon.endDate,
      ParticipantPreviewResponse.fromArray(participants, users),
      CategoryPreviewResponse.fromArray(categories),
      IdeaPreviewResponse.fromArray(ideas),
      hackathon.votingOpened,
    );
}

export default HackathonResponse;
