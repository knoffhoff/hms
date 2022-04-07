import {Uuid} from '../util/uuids';
import {
  ParticipantListResponse,
  ParticipantResponse,
} from '../rest/participant';
import {currHackathonId, nextHackathonId, prevHackathonId} from './hackathon';
import {userId1, userId2, userId3, userId4, userId5, userId6} from './user';

export const prevParticipantId1: Uuid = '16a43590-c7ba-4bb1-81d0-b726dea47b6e';
export const prevParticipant1 = new ParticipantResponse(
    prevParticipantId1,
    userId1,
    prevHackathonId,
    new Date('2021-03-02'),
);
export const prevParticipantId2: Uuid = '4e80138c-ed15-4947-ad18-15afa6af4adf';
export const prevParticipant2 = new ParticipantResponse(
    prevParticipantId2,
    userId2,
    prevHackathonId,
    new Date('2021-03-03'),
);
export const prevParticipantId3: Uuid = 'bc7edc4c-d840-4521-8666-505946ff6ecf';
export const prevParticipant3 = new ParticipantResponse(
    prevParticipantId3,
    userId3,
    prevHackathonId,
    new Date('2021-03-03'),
);
export const prevParticipantIds = [
  prevParticipantId1,
  prevParticipantId2,
  prevParticipantId3,
];

export const currParticipantId1: Uuid = 'e27fb873-fd63-4c43-a00b-4593a3662953';
export const currParticipant1 = new ParticipantResponse(
    currParticipantId1,
    userId1,
    currHackathonId,
    new Date('2022-02-01'),
);
export const currParticipantId2: Uuid = 'd73e9d79-7ebb-400c-ac3a-5de35c509eb9';
export const currParticipant2 = new ParticipantResponse(
    currParticipantId2,
    userId2,
    currHackathonId,
    new Date('2022-02-01'),
);
export const currParticipantId3: Uuid = 'fdc15363-ef3c-4ffa-a764-34ca3b4f5bd8';
export const currParticipant3 = new ParticipantResponse(
    currParticipantId3,
    userId4,
    currHackathonId,
    new Date('2022-02-21'),
);
export const currParticipantId4: Uuid = 'dd4596c0-911a-49a9-826f-0b6ec8a2d0b6';
export const currParticipant4 = new ParticipantResponse(
    currParticipantId4,
    userId5,
    currHackathonId,
    new Date('2022-02-24'),
);
export const currParticipantId5: Uuid = '403d2770-f7d2-4aa0-8c58-b711ad09f169';
export const currParticipant5 = new ParticipantResponse(
    currParticipantId5,
    userId6,
    currHackathonId,
    new Date('2022-03-07'),
);
export const currParticipantIds = [
  currParticipantId1,
  currParticipantId2,
  currParticipantId3,
  currParticipantId4,
  currParticipantId5,
];

export const nextParticipantIds = [];

// eslint-disable-next-line require-jsdoc
export function getParticipant(id: Uuid): ParticipantResponse | null {
  switch (id) {
    case prevParticipantId1:
      return prevParticipant1;
    case prevParticipantId2:
      return prevParticipant2;
    case prevParticipantId3:
      return prevParticipant3;
    case currParticipantId1:
      return currParticipant1;
    case currParticipantId2:
      return currParticipant2;
    case currParticipantId3:
      return currParticipant3;
    case currParticipantId4:
      return currParticipant4;
    case currParticipantId5:
      return currParticipant5;
    default:
      return null;
  }
}

// eslint-disable-next-line require-jsdoc
export function getParticipantIds(hackathonId: Uuid)
    : ParticipantListResponse | null {
  switch (hackathonId) {
    case prevHackathonId:
      return new ParticipantListResponse(prevParticipantIds);
    case currHackathonId:
      return new ParticipantListResponse(currParticipantIds);
    case nextHackathonId:
      return new ParticipantListResponse(nextParticipantIds);
    default:
      return null;
  }
}
