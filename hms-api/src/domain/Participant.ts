import {Uuid} from '../uuids';
import {User} from './User';
import {Hackathon} from './Hackathon';

/**
 * A single User participating in a Hackathon
 */
export class Participant {
  id: Uuid;
  user: User;
  hackathon: Hackathon;
}
