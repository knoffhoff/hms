import Uuid, { uuid } from '../../../src/util/Uuid'
import Participant from '../../../src/repository/domain/Participant'

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
  }: ParticipantData): Participant => new Participant(
  userId,
  hackathonId,
  id,
  creationDate,
)

export const randomParticipant = ()
  : Participant => makeParticipant({} as ParticipantData)
