import {HackathonData, makeHackathon, randomHackathon} from './hackathon-maker';

describe('Hackathon Validation', () => {
  const earlyDate = new Date();
  const lateDate = new Date(new Date().getTime() + 1000);

  it.each([
    ['Happy Path', randomHackathon(), false],
    ['Null ID', makeHackathon({id: null} as HackathonData), true],
    ['Empty ID', makeHackathon({id: ''} as HackathonData), true],
    ['Null Title', makeHackathon({title: null} as HackathonData), true],
    ['Empty Title', makeHackathon({title: ''} as HackathonData), true],
    ['Null Start Date',
      makeHackathon({startDate: null} as HackathonData),
      true],
    ['Null End Date',
      makeHackathon({endDate: null} as HackathonData),
      true],
    ['Start Date === End Date',
      makeHackathon({
        startDate: earlyDate,
        endDate: earlyDate,
      } as HackathonData),
      true],
    ['Start Date > End Date',
      makeHackathon({
        startDate: lateDate,
        endDate: earlyDate,
      } as HackathonData),
      true],
    ['Null Description',
      makeHackathon({description: null} as HackathonData),
      true],
    ['Empty Description',
      makeHackathon({description: ''} as HackathonData),
      false],
  ])('%s', (testName, hackathon, failed) => {
    expect(hackathon.validate().hasFailed()).toBe(failed);
  });
});
