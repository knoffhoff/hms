import {Participant} from './Participant';
import {Category} from './Category';
import {Idea} from './Idea';
import {Hackathon} from './Hackathon';

export class Vote {
  participant: Participant;
  category: Category;
  idea: Idea;
  hackathon: Hackathon;
  rank: Number;
}
