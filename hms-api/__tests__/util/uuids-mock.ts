/* eslint-disable require-jsdoc */

import * as uuids from '../../src/util/Uuid';
import Uuid from '../../src/util/Uuid';

export function mockUuid(id: Uuid) {
  const mockUuidFun = jest.fn();
  jest.spyOn(uuids, 'uuid').mockImplementation(mockUuidFun);
  mockUuidFun.mockReturnValue(id);
}
