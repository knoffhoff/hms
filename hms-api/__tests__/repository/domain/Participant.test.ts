import { makeParticipant, ParticipantData, randomParticipant, } from './participant-maker'

describe('Participant Validation', () => {
  it.each([
    ['Happy Path', randomParticipant(), false],
    ['Null ID', makeParticipant({ id: null } as ParticipantData), true],
    ['Empty ID', makeParticipant({ id: '' } as ParticipantData), true],
    ['Null User ID', makeParticipant({ userId: null } as ParticipantData), true],
    ['Empty User ID', makeParticipant({ userId: '' } as ParticipantData), true],
    ['Null Hackathon ID',
      makeParticipant({ hackathonId: null } as ParticipantData),
      true],
    ['Empty Hackathon ID',
      makeParticipant({ hackathonId: '' } as ParticipantData),
      true],
  ])('%s', (testName, participant, failed) => {
    expect(participant.validate().hasFailed()).toBe(failed)
  })
})
