import { md5 } from './md5';

export const encryptionRules = val => md5(md5(val).substr(3,8) + md5(val));

export default encryptionRules;
