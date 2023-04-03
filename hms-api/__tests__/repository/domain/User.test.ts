import { makeUser, randomUser, UserData } from './user-maker'

describe('User Validation', () => {
  it.each([
    ['Happy Path', randomUser(), false],
    ['Null ID', makeUser({ id: null } as UserData), true],
    ['Empty ID', makeUser({ id: '' } as UserData), true],
    ['Null Last Name', makeUser({ lastName: null } as UserData), false],
    ['Empty Last Name', makeUser({ lastName: '' } as UserData), false],
    ['Null First Name', makeUser({ firstName: null } as UserData), true],
    ['Empty First Name', makeUser({ firstName: '' } as UserData), true],
    ['Null Email', makeUser({ emailAddress: null } as UserData), true],
    ['Empty Email', makeUser({ emailAddress: '' } as UserData), true],
    ['Null Roles', makeUser({ roles: null } as UserData), true],
    ['Empty Roles', makeUser({ roles: [] } as UserData), true],
    ['Null Skills', makeUser({ skills: null } as UserData), true],
    ['Empty Skills', makeUser({ skills: [] } as UserData), false],
    ['Null Image URL', makeUser({ imageUrl: null } as UserData), false],
    ['Empty Image URL', makeUser({ imageUrl: '' } as UserData), false],
  ])('%s', (testName, participant, failed) => {
    expect(participant.validate().hasFailed()).toBe(failed)
  })
})
