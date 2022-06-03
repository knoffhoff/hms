/* eslint-disable require-jsdoc */
import Uuid from '../util/Uuid';

export default class {
  ideaId: Uuid;
  participantId: Uuid;

  constructor(
      ideaId: Uuid,
      participantId: Uuid,
  ) {
    this.ideaId = ideaId;
    this.participantId = participantId;
  }
}
