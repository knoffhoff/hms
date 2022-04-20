/* eslint-disable require-jsdoc */

import * as uuids from '../../src/util/Uuid';
import Uuid from '../../src/util/Uuid';

const mockUuidFun = jest.fn();

export function mockUuid(id: Uuid) {
  jest.spyOn(uuids, 'uuid').mockImplementation(mockUuidFun);
  mockUuidFun.mockReturnValue(id);
}
