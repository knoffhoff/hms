/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';
import SkillPreviewResponse from './SkillPreviewResponse';
import HackathonPreviewResponse from './HackathonPreviewResponse';
import CategoryPreviewResponse from './CategoryPreviewResponse';
import ParticipantPreviewResponse from './ParticipantPreviewResponse';

export default class {
  id: Uuid;
  owner: ParticipantPreviewResponse;
  hackathon: HackathonPreviewResponse;
  participants: ParticipantPreviewResponse[];
  title: string;
  description: string;
  problem: string;
  goal: string;
  requiredSkills: SkillPreviewResponse[];
  category: CategoryPreviewResponse;
  creationDate: Date;

  constructor(
      id: Uuid,
      owner: ParticipantPreviewResponse,
      hackathon: HackathonPreviewResponse,
      participants: ParticipantPreviewResponse[],
      title: string,
      description: string,
      problem: string,
      goal: string,
      requiredSkills: SkillPreviewResponse[],
      category: CategoryPreviewResponse,
      creationDate: Date,
  ) {
    this.id = id;
    this.owner = owner;
    this.hackathon = hackathon;
    this.participants = participants;
    this.title = title;
    this.description = description;
    this.problem = problem;
    this.goal = goal;
    this.requiredSkills = requiredSkills;
    this.category = category;
    this.creationDate = creationDate;
  }
}
