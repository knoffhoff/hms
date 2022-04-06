import {uuid, Uuid} from '../uuids';
import {Participant} from './Participant';
import {Hackathon} from './Hackathon';
import {Skill} from './Skill';
import {Category} from './Category';

/**
 * An Idea is... well an Idea idk it's a thing people work on
 */
export class Idea {
  id: Uuid;
  owner: Participant;
  hackathon: Hackathon;
  participants: Participant[];
  title: string;
  description: string;
  problem: string;
  goal: string;
  requiredSkills: Skill[];
  category: Category;
  creationDate: Date;

  // eslint-disable-next-line require-jsdoc
  constructor(
      owner: Participant,
      hackathon: Hackathon,
      participants: Participant[],
      title: string,
      description: string,
      problem: string,
      goal: string,
      requiredSkills: Skill[],
      category: Category,
  ) {
    this.id = uuid();
    this.owner = owner;
    this.hackathon = hackathon;
    this.participants = participants;
    this.title = title;
    this.description = description;
    this.problem = problem;
    this.goal = goal;
    this.requiredSkills = requiredSkills;
    this.category = category;
    this.creationDate = new Date();
  }
}
