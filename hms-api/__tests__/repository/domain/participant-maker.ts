import {uuid, Uuid} from '../../../src/util/uuids';
import Participant from '../../../src/repository/domain/Participant';

export interface ParticipantData {
  id: Uuid;
  userId: Uuid;
  hackathonId: Uuid;
  creationDate: Date;
}

export const makeParticipant = (
    {
      id = uuid(),
      userId = uuid(),
      hackathonId = uuid(),
      creationDate = new Date(),
    }: ParticipantData) => new Participant(
    userId,
    hackathonId,
    id,
    creationDate,
);

export const randomParticipant = () => makeParticipant({} as ParticipantData);
