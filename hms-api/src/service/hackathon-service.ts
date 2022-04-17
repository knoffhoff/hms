/* eslint-disable require-jsdoc */

import {
  deleteHackathon,
  putHackathon,
} from '../repository/hackathon-repository';
import Uuid from '../util/Uuid';
import Hackathon from '../repository/domain/Hackathon';

export async function createHackathon(
    title: string,
    startDate: Date,
    endDate: Date,
): Promise<Hackathon> {
  const hackathon = new Hackathon(title, startDate, endDate);

  await putHackathon(hackathon);

  return hackathon;
}

export async function removeHackathon(id: Uuid) {
  await deleteHackathon(id);
}
