import {v4 as uuidv4} from 'uuid';

type Uuid = string;

const uuid = (): Uuid => uuidv4();

export {Uuid};
export {uuid};
