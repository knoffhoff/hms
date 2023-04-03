import { makeParticipant, ParticipantData, } from '../repository/domain/participant-maker'
import ParticipantPreviewResponse from '../../src/rest/participant/ParticipantPreviewResponse'
import { makeUser, randomUser, UserData } from '../repository/domain/user-maker'

describe('Compare', () => {
  test('All values different', () => {
    const userA = makeUser({ id: 'a' } as UserData)
    const a = ParticipantPreviewResponse.from(
      makeParticipant({ userId: userA.id } as ParticipantData),
      userA,
    )
    const userB = makeUser({ id: 'b' } as UserData)
    const b = ParticipantPreviewResponse.from(
      makeParticipant({ userId: userB.id } as ParticipantData),
      userB,
    )

    expect(ParticipantPreviewResponse.compare(a, b)).toBeLessThan(0)
    expect(ParticipantPreviewResponse.compare(b, a)).toBeGreaterThan(0)
  })

  test('Same users', () => {
    const user = randomUser()
    const a = ParticipantPreviewResponse.from(
      makeParticipant({
        id: 'a',
        userId: user.id,
      } as ParticipantData),
      user,
    )
    const b = ParticipantPreviewResponse.from(
      makeParticipant({
        id: 'b',
        userId: user.id,
      } as ParticipantData),
      user,
    )

    expect(ParticipantPreviewResponse.compare(a, b)).toBeLessThan(0)
    expect(ParticipantPreviewResponse.compare(b, a)).toBeGreaterThan(0)
  })

  test('All values same', () => {
    const user = randomUser()
    const a = ParticipantPreviewResponse.from(
      makeParticipant({
        id: 'a',
        userId: user.id,
      } as ParticipantData),
      user,
    )
    const b = ParticipantPreviewResponse.from(
      makeParticipant({
        id: 'a',
        userId: user.id,
      } as ParticipantData),
      user,
    )

    expect(ParticipantPreviewResponse.compare(a, b)).toBe(0)
    expect(ParticipantPreviewResponse.compare(b, a)).toBe(0)
  })
})
