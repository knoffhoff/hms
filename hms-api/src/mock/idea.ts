import {Uuid} from '../util/uuids';
import {IdeaListResponse, IdeaResponse} from '../rest/idea';
import {
  currHackathonId,
  nextHackathonId,
  prevHackathonId
} from './hackathon-data';
import {
  currParticipantId1,
  currParticipantId2,
  currParticipantId3,
  currParticipantId4,
  currParticipantId5,
  prevParticipantId1,
  prevParticipantId2,
  prevParticipantId3,
} from './participant';
import {
  backendName,
  bearHandlingName,
  beeHandlingName,
  designName,
  frontendName,
} from './skill';
import {currCategoryId1, prevCategoryId1, prevCategoryId2} from './category';

export const prevIdeaId1: Uuid = 'e1e24282-b98a-4b8a-95e8-d08ea8400061';
export const prevIdea1 = new IdeaResponse(
    prevIdeaId1,
    prevParticipantId1,
    prevHackathonId,
    [prevParticipantId1],
    'A really cool idea about bears!',
    'Ulysses, Ulysses — Soaring through all the galaxies. ' +
    'In search of Earth, flying in to the night. Ulysses, Ulysses — ' +
    'Fighting evil and tyranny, with all his power, and with all of his ' +
    'might. Ulysses — no-one else can do the things you do. Ulysses — ' +
    'like a bolt of thunder from the blue. Ulysses — always fighting all ' +
    'the evil forces bringing peace and justice to all.',
    'Not enough bears',
    'Have more bears',
    [bearHandlingName],
    prevCategoryId1,
    new Date('2021-12-01'),
);

export const prevIdeaId2: Uuid = 'ea34c250-1edf-4059-9a5a-3d73898044be';
export const prevIdea2 = new IdeaResponse(
    prevIdeaId2,
    prevParticipantId1,
    prevHackathonId,
    [prevParticipantId1, prevParticipantId2],
    'A really cool idea about bees!',
    'One for all and all for one, Muskehounds are always ready. ' +
    'One for all and all for one, helping everybody. One for all and all ' +
    'for one, it’s a pretty story. Sharing everything with fun, that’s ' +
    'the way to be. One for all and all for one, Muskehounds are always ' +
    'ready. One for all and all for one, helping everybody. One for all ' +
    'and all for one, can sound pretty corny. If you’ve got a problem ' +
    'chum, think how it could be.',
    'Too many bees',
    'Have less bees',
    [beeHandlingName],
    prevCategoryId1,
    new Date('2021-12-04'),
);

export const prevIdeaId3: Uuid = 'f67d7491-e919-4575-80ed-48af66d6b687';
export const prevIdea3 = new IdeaResponse(
    prevIdeaId3,
    prevParticipantId2,
    prevHackathonId,
    [prevParticipantId2],
    'A really cool bleeding edge tech idea!',
    'Hey there where ya goin’, not exactly knowin’, who says you ' +
    'have to call just one place home. He’s goin’ everywhere, B.J. McKay ' +
    'and his best friend Bear. He just keeps on movin’, ladies keep ' +
    'improvin’, every day is better than the last. New dreams and better ' +
    'scenes, and best of all I don’t pay property tax. Rollin’ down to ' +
    'Dallas, who’s providin’ my palace, off to New Orleans or who knows ' +
    'where. Places new and ladies, too, I’m B.J. McKay and this is my ' +
    'best friend Bear.',
    'Wanna do something with ML',
    'Obviously have another pointless ML project',
    [frontendName, backendName],
    prevCategoryId2,
    new Date('2021-12-05'),
);

export const prevIdeaId4: Uuid = 'd67af6fc-9e08-4020-bff2-9dca7a0e2017';
export const prevIdea4 = new IdeaResponse(
    prevIdeaId4,
    prevParticipantId3,
    prevHackathonId,
    [prevParticipantId3, prevParticipantId1],
    'One of those ones that is really just a presentation',
    'There’s a voice that keeps on calling me. Down the road, ' +
    'that’s where I’ll always be. Every stop I make, I make a new friend. ' +
    'Can’t stay for long, just turn around and I’m gone again. Maybe ' +
    'tomorrow, I’ll want to settle down, Until tomorrow, I’ll just keep ' +
    'moving on.',
    'Not enough nice powerpoints',
    'Make a kickass powerpoint',
    [frontendName, designName],
    prevCategoryId2,
    new Date('2021-12-06'),
);

export const prevIdeaId5: Uuid = '5e427cab-19c7-41d0-b223-4e0927e014b9';
export const prevIdea5 = new IdeaResponse(
    prevIdeaId5,
    prevParticipantId2,
    prevHackathonId,
    [prevParticipantId3, prevParticipantId2],
    'Write software for a thing',
    'Mutley, you snickering, floppy eared hound. When courage is ' +
    'needed, you’re never around. Those medals you wear on your moth-eaten ' +
    'chest should be there for bungling at which you are best. So, stop ' +
    'that pigeon, stop that pigeon, stop that pigeon, stop that pigeon, ' +
    'stop that pigeon, stop that pigeon, stop that pigeon. Howwww! Nab him, ' +
    'jab him, tab him, grab him, stop that pigeon now.',
    'They don\'t make software like they did in my day',
    'Have nice software',
    [frontendName],
    prevCategoryId1,
    new Date('2021-12-09'),
);

export const prevIdeaIds = [
  prevIdeaId1,
  prevIdeaId2,
  prevIdeaId3,
  prevIdeaId4,
  prevIdeaId5,
];

export const currIdeaId1: Uuid = 'cd760a62-6c79-44f0-96f0-f2e87bd5f169';
export const currIdea1 = new IdeaResponse(
    currIdeaId1,
    currParticipantId1,
    currHackathonId,
    [currParticipantId1, currParticipantId2, currParticipantId5],
    'Making sweet party hats for bees',
    'Hong Kong Phooey, number one super guy. Hong Kong Phooey, ' +
    'quicker than the human eye. He’s got style, a groovy style, and a car ' +
    'that just won’t stop. When the going gets tough, he’s really rough, ' +
    'with a Hong Kong Phooey chop (Hi-Ya!). Hong Kong Phooey, number one ' +
    'super guy. Hong Kong Phooey, quicker than the human eye. Hong Kong ' +
    'Phooey, he’s fan-riffic!',
    'Bees like to party but have no hats',
    'Have tiny hats for bees',
    [designName, beeHandlingName],
    currCategoryId1,
    new Date('2022-03-28'),
);

export const currIdeaId2: Uuid = '58ee0b24-7087-49ab-b0c9-8b9f58110ae4';
export const currIdea2 = new IdeaResponse(
    currIdeaId2,
    currParticipantId2,
    currHackathonId,
    [
      currParticipantId1,
      currParticipantId2,
      currParticipantId4,
      currParticipantId5,
    ],
    'Bears that look like bees',
    'Children of the sun, see your time has just begun, searching ' +
    'for your ways, through adventures every day. Every day and night, with ' +
    'the condor in flight, with all your friends in tow, you search for the ' +
    'Cities of Gold. Ah-ah-ah-ah-ah… wishing for The Cities of Gold. ' +
    'Ah-ah-ah-ah-ah… some day we will find The Cities of Gold. Do-do-do-do ' +
    'ah-ah-ah, do-do-do-do, Cities of Gold. Do-do-do-do, Cities of Gold. ' +
    'Ah-ah-ah-ah-ah… some day we will find The Cities of Gold.',
    'Bears don\'t look like bees',
    'Make bears that look like bees',
    [beeHandlingName, bearHandlingName],
    currCategoryId1,
    new Date('2022-03-29'),
);

export const currIdeaId3: Uuid = '2ea43759-7580-4331-b31b-d5a206937662';
export const currIdea3 = new IdeaResponse(
    currIdeaId3,
    currParticipantId3,
    currHackathonId,
    [
      currParticipantId1,
      currParticipantId2,
      currParticipantId3,
    ],
    'Bees that look like bears',
    '80 days around the world, we’ll find a pot of gold just sitting ' +
    'where the rainbow’s ending. Time — we’ll fight against the time, and ' +
    'we’ll fly on the white wings of the wind. 80 days around the world, no ' +
    'we won’t say a word before the ship is really back. Round, round, all ' +
    'around the world. Round, all around the world. Round, all around the ' +
    'world. Round, all around the world.',
    'Bees aren\'t nearly scary enough',
    'Have horrifying bear like bees',
    [beeHandlingName, bearHandlingName],
    currCategoryId1,
    new Date('2022-04-01'),
);

export const currIdeaId4: Uuid = 'eb4551ef-17b1-4808-8d5c-e472b21df76f';
export const currIdea4 = new IdeaResponse(
    currIdeaId4,
    currParticipantId4,
    currHackathonId,
    [
      currParticipantId1,
      currParticipantId4,
    ],
    'Backend software for feet',
    'Thundercats are on the move, Thundercats are loose. Feel the ' +
    'magic, hear the roar, Thundercats are loose. Thunder, thunder, thunder, ' +
    'Thundercats! Thunder, thunder, thunder, Thundercats! Thunder, thunder, ' +
    'thunder, Thundercats! Thunder, thunder, thunder, Thundercats! ' +
    'Thundercats!',
    'Feet don\'t have enough purpose built software',
    'Make a cool app for feet',
    [backendName],
    currCategoryId1,
    new Date('2022-04-01'),
);

export const currIdeaId5: Uuid = 'a4d30e2d-1764-4bb5-ab99-866b7391a4e4';
export const currIdea5 = new IdeaResponse(
    currIdeaId5,
    currParticipantId4,
    currHackathonId,
    [
      currParticipantId2,
      currParticipantId4,
    ],
    'Frontend software for hands',
    'There’s a voice that keeps on calling me. Down the road, ' +
    'that’s where I’ll always be. Every stop I make, I make a new friend. ' +
    'Can’t stay for long, just turn around and I’m gone again. Maybe ' +
    'tomorrow, I’ll want to settle down, Until tomorrow, I’ll just keep ' +
    'moving on.',
    'Hands don\'t have enough purpose built software',
    'Make a cool app for hands',
    [frontendName],
    currCategoryId1,
    new Date('2022-04-01'),
);

export const currIdeaId6: Uuid = 'd4c7a584-a399-4c02-8f60-a20ff4d997c0';
export const currIdea6 = new IdeaResponse(
    currIdeaId6,
    currParticipantId5,
    currHackathonId,
    [
      currParticipantId5,
    ],
    'Just like mock data idk',
    'Mutley, you snickering, floppy eared hound. When courage ' +
    'is needed, you’re never around. Those medals you wear on your ' +
    'moth-eaten chest should be there for bungling at which you are best. ' +
    'So, stop that pigeon, stop that pigeon, stop that pigeon, stop that ' +
    'pigeon, stop that pigeon, stop that pigeon, stop that pigeon. Howwww! ' +
    'Nab him, jab him, tab him, grab him, stop that pigeon now.',
    'We need test data',
    'We will have test data',
    [designName, backendName, frontendName],
    currCategoryId1,
    new Date('2022-04-02'),
);

export const currIdeaId7: Uuid = '6d9be287-038d-4b8a-a005-bc4e64e6ac48';
export const currIdea7 = new IdeaResponse(
    currIdeaId7,
    currParticipantId2,
    currHackathonId,
    [
      currParticipantId2,
      currParticipantId3,
      currParticipantId4,
    ],
    'Always good do have more test data',
    'One for all and all for one, Muskehounds are always ready. One for ' +
    'all and all for one, helping everybody. One for all and all for one, ' +
    'it’s a pretty story. Sharing everything with fun, that’s the way to ' +
    'be. One for all and all for one, Muskehounds are always ready. One for ' +
    'all and all for one, helping everybody. One for all and all for one, ' +
    'can sound pretty corny. If you’ve got a problem chum, think how it ' +
    'could be.',
    'We REALLY need test data',
    'We will have test data',
    [bearHandlingName, designName, frontendName],
    currCategoryId1,
    new Date('2022-04-03'),
);

export const currIdeaId8: Uuid = '5c0b9191-ac63-44be-8c68-b5c9888643af';
export const currIdea8 = new IdeaResponse(
    currIdeaId8,
    currParticipantId1,
    currHackathonId,
    [
      currParticipantId1,
      currParticipantId2,
      currParticipantId3,
      currParticipantId4,
      currParticipantId5,
    ],
    'Really cool software headbands for animals',
    'Knight Rider, a shadowy flight into the dangerous world of a man who ' +
    'does not exist. Michael Knight, a young loner on a crusade to champion ' +
    'the cause of the innocent, the helpless in a world of criminals who ' +
    'operate above the law.',
    'Animals don\'t have cool enough headbands',
    'Really stylish animals', [
      bearHandlingName,
      beeHandlingName,
      designName,
      backendName,
      frontendName,
    ],
    currCategoryId1,
    new Date('2022-04-03'),
);

export const currIdeaId9: Uuid = 'e64163a6-d20e-40d7-a69a-aba4ee82410d';
export const currIdea9 = new IdeaResponse(
    currIdeaId9,
    currParticipantId1,
    currHackathonId,
    [
      currParticipantId1,
    ],
    'Just a task no one wants to do',
    'There’s a voice that keeps on calling me. Down the road, that’s where ' +
    'I’ll always be. Every stop I make, I make a new friend. Can’t stay for ' +
    'long, just turn around and I’m gone again. Maybe tomorrow, I’ll want ' +
    'to settle down, Until tomorrow, I’ll just keep moving on.',
    'Just like whatever',
    'Just stuff',
    [frontendName],
    currCategoryId1,
    new Date('2022-04-04'),
);

export const currIdeaIds = [
  currIdeaId1,
  currIdeaId2,
  currIdeaId3,
  currIdeaId4,
  currIdeaId5,
  currIdeaId6,
  currIdeaId7,
  currIdeaId8,
  currIdeaId9,
];

export const nextIdeaIds = [];

// eslint-disable-next-line require-jsdoc
export function getIdeas(hackathonId: Uuid): IdeaListResponse | null {
  switch (hackathonId) {
    case prevHackathonId:
      return new IdeaListResponse(prevIdeaIds, hackathonId);
    case currHackathonId:
      return new IdeaListResponse(currIdeaIds, hackathonId);
    case nextHackathonId:
      return new IdeaListResponse(nextIdeaIds, hackathonId);
    default:
      return null;
  }
}

// eslint-disable-next-line require-jsdoc
export function getIdea(id: Uuid): IdeaResponse | null {
  switch (id) {
    case prevIdeaId1:
      return prevIdea1;
    case prevIdeaId2:
      return prevIdea2;
    case prevIdeaId3:
      return prevIdea3;
    case prevIdeaId4:
      return prevIdea4;
    case prevIdeaId5:
      return prevIdea5;
    case currIdeaId1:
      return currIdea1;
    case currIdeaId2:
      return currIdea2;
    case currIdeaId3:
      return currIdea3;
    case currIdeaId4:
      return currIdea4;
    case currIdeaId5:
      return currIdea5;
    case currIdeaId6:
      return currIdea6;
    case currIdeaId7:
      return currIdea7;
    case currIdeaId8:
      return currIdea8;
    case currIdeaId9:
      return currIdea9;
    default:
      return null;
  }
}
