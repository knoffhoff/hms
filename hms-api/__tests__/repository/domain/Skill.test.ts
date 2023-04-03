import { makeSkill, randomSkill, SkillData } from './skill-maker'

describe('Skill Validation', () => {
  it.each([
    ['Happy Path', randomSkill(), false],
    ['Null ID', makeSkill({ id: null } as SkillData), true],
    ['Empty ID', makeSkill({ id: '' } as SkillData), true],
    ['Null Name', makeSkill({ name: null } as SkillData), true],
    ['Empty Name', makeSkill({ name: '' } as SkillData), true],
    ['Null Description', makeSkill({ description: null } as SkillData), true],
    ['Empty Description', makeSkill({ description: '' } as SkillData), false],
  ])('%s', (testName, participant, failed) => {
    expect(participant.validate().hasFailed()).toBe(failed)
  })
})
