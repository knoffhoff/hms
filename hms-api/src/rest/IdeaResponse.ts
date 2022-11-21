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
  voters: ParticipantPreviewResponse[];
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
    voters: ParticipantPreviewResponse[],
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
    this.voters = voters;
    this.title = title;
    this.description = description;
    this.problem = problem;
    this.goal = goal;
    this.requiredSkills = requiredSkills;
    this.category = category;
    this.creationDate = creationDate;
  }

  static from = (
    idea: Idea,
    ownerParticipant: Participant,
    ownerUser: User,
    hackathon: Hackathon,
    participants: Participant[],
    voters: Participant[],
    ParticipantUsers: User[],
    VoterUsers: User[],
    skills: Skill[],
    category: Category,
  ): IdeaResponse =>
    new IdeaResponse(
      idea.id,
      ParticipantPreviewResponse.from(ownerParticipant, ownerUser),
      HackathonPreviewResponse.from(hackathon),
      ParticipantPreviewResponse.fromArray(participants, ParticipantUsers),
      ParticipantPreviewResponse.fromArray(voters, VoterUsers),
      idea.title,
      idea.description,
      idea.problem,
      idea.goal,
      SkillPreviewResponse.fromArray(skills),
      CategoryPreviewResponse.from(category),
      idea.creationDate,
    );
}

export default IdeaResponse;
