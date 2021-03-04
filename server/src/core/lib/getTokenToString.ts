export const getTokenToString = str => {
  if (!str) {
    throw new Error('参数不能为空');
  }
  return str.replace(/^(Bearer)\s+/, '');
};

export default getTokenToString;
