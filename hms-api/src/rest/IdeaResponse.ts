/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';
import SkillPreviewResponse from './SkillPreviewResponse';
import HackathonPreviewResponse from './HackathonPreviewResponse';
import CategoryPreviewResponse from './CategoryPreviewResponse';
import ParticipantPreviewResponse from './ParticipantPreviewResponse';
import Participant from '../repository/domain/Participant';
import Idea from '../repository/domain/Idea';
import User from '../repository/domain/User';
import Hackathon from '../repository/domain/Hackathon';
import Skill from '../repository/domain/Skill';
import Category from '../repository/domain/Category';

class IdeaResponse {
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
  hypothesis: string;
  successMeasure: string;
  followUp: string;
  outcome: string;

  constructor(
    id: Uuid,
    owner: ParticipantPreviewResponse,
    hackathon: HackathonPreviewResponse,
    participants: ParticipantPreviewResponse[],
    title: string,
    description: string,
    problem: string,
    requiredSkills: SkillPreviewResponse[],
    category: CategoryPreviewResponse,
    creationDate: Date,
    hypothesis: string,
    successMeasure: string,
    followUp: string,
    outcome: string,
  ) {
    this.id = id;
    this.owner = owner;
    this.hackathon = hackathon;
    this.participants = participants;
    this.title = title;
    this.description = description;
    this.problem = problem;
    this.requiredSkills = requiredSkills;
    this.category = category;
    this.creationDate = creationDate;
    this.hypothesis = hypothesis;
    this.successMeasure = successMeasure;
    this.followUp = followUp;
    this.outcome = outcome;
  }

  static from = (
    idea: Idea,
    ownerParticipant: Participant,
    ownerUser: User,
    hackathon: Hackathon,
    participants: Participant[],
    users: User[],
    skills: Skill[],
    category: Category,
  ): IdeaResponse =>
    new IdeaResponse(
      idea.id,
      ParticipantPreviewResponse.from(ownerParticipant, ownerUser),
      HackathonPreviewResponse.from(hackathon),
      ParticipantPreviewResponse.fromArray(participants, users),
      idea.title,
      idea.description,
      idea.problem,
      SkillPreviewResponse.fromArray(skills),
      CategoryPreviewResponse.from(category),
      idea.creationDate,
      idea.hypothesis,
      idea.successMeasure,
      idea.followUp,
      idea.outcome,
    );
}

export default IdeaResponse;
