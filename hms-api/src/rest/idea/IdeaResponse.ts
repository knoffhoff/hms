/* eslint-disable require-jsdoc */

import Uuid from '../../util/Uuid';
import SkillPreviewResponse from '../skill/SkillPreviewResponse';
import HackathonPreviewResponse from '../hackathon/HackathonPreviewResponse';
import CategoryPreviewResponse from '../category/CategoryPreviewResponse';
import ParticipantPreviewResponse from '../participant/ParticipantPreviewResponse';
import Participant from '../../repository/domain/Participant';
import Idea from '../../repository/domain/Idea';
import User from '../../repository/domain/User';
import Hackathon from '../../repository/domain/Hackathon';
import Skill from '../../repository/domain/Skill';
import Category from '../../repository/domain/Category';
import UserPreviewResponse from '../user/UserPreviewResponse';

class IdeaResponse {
  id: Uuid;
  owner: UserPreviewResponse;
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
    owner: UserPreviewResponse,
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
    ownerUser: User,
    hackathon: Hackathon,
    participants: Participant[],
    voters: Participant[],
    participantUsers: User[],
    voterUsers: User[],
    skills: Skill[],
    category: Category,
  ): IdeaResponse =>
    new IdeaResponse(
      idea.id,
      UserPreviewResponse.from(ownerUser),
      HackathonPreviewResponse.from(hackathon),
      ParticipantPreviewResponse.fromArray(participants, participantUsers),
      ParticipantPreviewResponse.fromArray(voters, voterUsers),
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
