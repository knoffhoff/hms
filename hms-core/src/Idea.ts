import {Uuid} from './uuid_help';
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
  participants: Set<Participant>;
  title: string;
  description: string;
  problem: string;
  goal: string;
  requiredSkills: Set<Skill>;
  category: Category;
}
