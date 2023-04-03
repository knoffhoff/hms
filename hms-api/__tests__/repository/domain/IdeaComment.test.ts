import { IdeaCommentData, makeIdeaComment, randomIdeaComment, } from './ideaComment-maker'

describe('IdeaComment Validation', () => {
  it.each([
    ['Happy Path', randomIdeaComment(), false],
    ['Null ID', makeIdeaComment({ id: null } as IdeaCommentData), true],
    ['Empty ID', makeIdeaComment({ id: '' } as IdeaCommentData), true],
    ['Null User ID', makeIdeaComment({ userId: null } as IdeaCommentData), true],
    ['Empty User ID', makeIdeaComment({ userId: '' } as IdeaCommentData), true],
    ['Null Idea ID', makeIdeaComment({ ideaId: null } as IdeaCommentData), true],
    ['Empty Idea ID', makeIdeaComment({ ideaId: '' } as IdeaCommentData), true],
    [
      'Null ParentID',
      makeIdeaComment({ parentIdeaCommentId: null } as IdeaCommentData),
      true,
    ],
    [
      'Empty ParentID',
      makeIdeaComment({ parentIdeaCommentId: '' } as IdeaCommentData),
      true,
    ],
  ])('%s', (testName, ideaComment, failed) => {
    expect(ideaComment.validate().hasFailed()).toBe(failed)
  })
})
