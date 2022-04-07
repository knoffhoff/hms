import {Participant} from './Participant';
import {Category} from './Category';
import {Idea} from './Idea';
import {Hackathon} from './Hackathon';

// eslint-disable-next-line require-jsdoc
export class Vote {
  participant: Participant;
  category: Category;
  idea: Idea;
  hackathon: Hackathon;
  rank: Number;
}
