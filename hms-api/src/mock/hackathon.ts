import {Uuid} from '../uuids';
import {HackathonListResponse, HackathonResponse} from '../rest/hackathon';
import {currParticipantIds, nextParticipantIds, prevParticipantIds,} from './participant';
import {currCategoryIds, nextCategoryIds, prevCategoryIds} from './category';
import {currIdeaIds, nextIdeaIds, prevIdeaIds} from './idea';

export const prevHackathonId: Uuid = 'e955fe4b-7ce7-4904-ae6f-22a8985f74a8';
export const prevHackathon = new HackathonResponse(
    prevHackathonId,
    'Previous Hackathon',
    new Date('2021-12-13'),
    new Date('2021-12-17'),
    prevParticipantIds,
    prevCategoryIds,
    prevIdeaIds,
);

export const currHackathonId: Uuid = '4eb2d486-c786-431e-a4fd-4c093ed30642';
export const currHackathon = new HackathonResponse(
    currHackathonId,
    'Current Hackathon',
    new Date('2022-04-04'),
    new Date('2022-04-08'),
    currParticipantIds,
    currCategoryIds,
    currIdeaIds,
);

export const nextHackathonId: Uuid = 'a1c60aba-f846-4208-b4b8-1caaec031aea';
export const nextHackathon = new HackathonResponse(
    nextHackathonId,
    'Current Hackathon',
    new Date('2022-08-15'),
    new Date('2022-08-19'),
    nextParticipantIds,
    nextCategoryIds,
    nextIdeaIds,
);

// eslint-disable-next-line require-jsdoc
export function getHackathon(id: Uuid): HackathonResponse {
  switch (id) {
    case prevHackathonId:
      return prevHackathon;
    case currHackathonId:
      return currHackathon;
    case nextHackathonId:
      return nextHackathon;
    default:
      return null;
  }
}

export const hackathonIds = new HackathonListResponse([
  prevHackathonId,
  currHackathonId,
  nextHackathonId,
]);
