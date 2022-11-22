import {IdeaData, makeIdea, randomIdea} from './idea-maker';

describe('Idea Validation', () => {
  it.each([
    ['Happy Path', randomIdea(), false],
    ['Null ID', makeIdea({id: null} as IdeaData), true],
    ['Empty ID', makeIdea({id: ''} as IdeaData), true],
    ['Null Owner ID', makeIdea({ownerId: null} as IdeaData), true],
    ['Empty Owner ID', makeIdea({ownerId: ''} as IdeaData), true],
    ['Null Hackathon ID', makeIdea({hackathonId: null} as IdeaData), true],
    ['Empty Hackathon ID', makeIdea({hackathonId: ''} as IdeaData), true],
    [
      'Null Participant IDs',
      makeIdea({participantIds: null} as IdeaData),
      true,
    ],
    [
      'Empty Participant IDs',
      makeIdea({participantIds: []} as IdeaData),
      false,
    ],
    ['Null Voter IDs', makeIdea({voterIds: null} as IdeaData), true],
    ['Empty Voter IDs', makeIdea({voterIds: []} as IdeaData), false],
    ['Null Title', makeIdea({title: null} as IdeaData), true],
    ['Empty Title', makeIdea({title: ''} as IdeaData), true],
    ['Null Description', makeIdea({description: null} as IdeaData), true],
    ['Empty Description', makeIdea({description: ''} as IdeaData), false],
    ['Null Problem', makeIdea({problem: null} as IdeaData), true],
    ['Empty Problem', makeIdea({problem: ''} as IdeaData), false],
    ['Null Goal', makeIdea({goal: null} as IdeaData), true],
    ['Empty Goal', makeIdea({goal: ''} as IdeaData), false],
    [
      'Null Required Skills',
      makeIdea({requiredSkills: null} as IdeaData),
      true,
    ],
    [
      'Empty Required Skills',
      makeIdea({requiredSkills: []} as IdeaData),
      false,
    ],
    ['Null Category ID', makeIdea({categoryId: null} as IdeaData), true],
    ['Empty Category ID', makeIdea({categoryId: ''} as IdeaData), true],
  ])('%s', (testName, idea, failed) => {
    expect(idea.validate().hasFailed()).toBe(failed);
  });
});
