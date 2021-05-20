/**
 * @desc 计算数组的平均值，保留小数两位
 * @param data {Array<number>} 数据集合
 * */

export const calcAvg = (data) => {
  const result = data.reduce((acc, val) => (Number(acc) + Number(val)), 0);
  return (result / data.length).toFixed(2);
};

export default calcAvg
