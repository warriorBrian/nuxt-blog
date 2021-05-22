import * as crypto from 'crypto'

export const md5 = (val) => {
  const md5 = crypto.createHash('md5');
  return md5.update(val).digest('hex');
};
