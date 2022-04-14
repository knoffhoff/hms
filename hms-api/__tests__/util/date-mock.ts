/* eslint-disable require-jsdoc */
export function mockDate(): void;
export function mockDate(date: Date): void;

export function mockDate(date: Date = new Date(Date.now())): void {
  jest.spyOn(global, 'Date')
      .mockImplementation(() => (date as unknown) as string);
}
