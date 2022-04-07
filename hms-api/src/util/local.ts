'use strict';

// eslint-disable-next-line require-jsdoc
export function isLocal(): boolean {
  console.log(process.env.STAGE);
  return process.env.STAGE === 'local';
}
