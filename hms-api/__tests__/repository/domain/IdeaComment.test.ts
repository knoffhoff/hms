import {
  makeIdeaComment,
  IdeaCommentData,
  randomIdeaComment,
} from './ideaComment-maker';

describe('IdeaComment Validation', () => {
  it.each([
    ['Happy Path', randomIdeaComment(), false],
    ['Null ID', makeIdeaComment({id: null} as IdeaCommentData), true],
    ['Empty ID', makeIdeaComment({id: ''} as IdeaCommentData), true],
    ['Null User ID', makeIdeaComment({userId: null} as IdeaCommentData), true],
    ['Empty User ID', makeIdeaComment({userId: ''} as IdeaCommentData), true],
  ])('%s', (testName, ideaComment, failed) => {
    expect(ideaComment.validate().hasFailed()).toBe(failed);
  });
});
