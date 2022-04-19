import Role from '../../../src/repository/domain/Role';

describe('Role conversion', () => {
  test('Admin converts to correct string', () => {
    expect(Role.Admin.toString()).toStrictEqual('Admin');
  });

  test('Admin is mapped from correct string', () => {
    expect(Role['Admin']).toStrictEqual(Role.Admin);
  });

  test('Participant converts to correct string', () => {
    expect(Role.Participant.toString()).toStrictEqual('Participant');
  });

  test('Participant is mapped from correct string', () => {
    expect(Role['Participant']).toStrictEqual(Role.Participant);
  });
});
