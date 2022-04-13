/* eslint-disable require-jsdoc */

import * as uuids from '../../src/util/uuids';
import {Uuid} from '../../src/util/uuids';

export function mockUuid(id: Uuid) {
  const mockUuidFun = jest.fn();
  jest.spyOn(uuids, 'uuid').mockImplementation(mockUuidFun);
  mockUuidFun.mockReturnValue(id);
}
