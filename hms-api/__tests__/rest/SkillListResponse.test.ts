import SkillListResponse from '../../src/rest/skill/SkillListResponse'
import { makeSkill, SkillData } from '../repository/domain/skill-maker'
import SkillPreviewResponse from '../../src/rest/skill/SkillPreviewResponse'

describe('Convert From', () => {
  test('Categories are sorted', () => {
    const user1 = makeSkill({ name: 'a' } as SkillData)
    const user2 = makeSkill({ name: 'b' } as SkillData)
    const user3 = makeSkill({ name: 'c' } as SkillData)

    const response = SkillListResponse.from([user3, user1, user2])

    expect(response).toEqual(
      new SkillListResponse([
        SkillPreviewResponse.from(user1),
        SkillPreviewResponse.from(user2),
        SkillPreviewResponse.from(user3),
      ]),
    )
  })
})
