'use strict';

export default (): boolean => process.env.STAGE === 'local';
