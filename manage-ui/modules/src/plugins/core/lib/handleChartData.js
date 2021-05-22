/**
 * 处理图表数据
 * @desc 将websocket数据处理成为图表数据
 * @param data {array<object>} 待处理数据
 * @param source {Object} 源数据，通常为data中的变量
 * @param length {number} 最大接收长度，当超出长度时shift数组第一个，保持规定长度
 * @param fn {Function} 回调参数，映射数据
 * @return object
 * @example
 * 原始数据:
 * [{ time: 'xxx', values: 'xxx' }]
 * handleChartData(arr, this.sourceData, 60, v => ({ xData: v.time, data: v.values }))
 * //=> { xData: ['xxx'], data: ['xxx'] }
 * */

export const handleChartData = (data, source, length = 60, fn = k => k) => {
  Array.isArray(data) ? handleArrayChartData(data, source, length, fn) : handleObjectChartData(data, source, length, fn);
};

function handleObjectChartData (data, source, length = 60, fn = k => k) {
  Object.keys(data).map(k => fn(k)).forEach(item => {
    // 每次进行数据追加
    source[item] = (source[item] || []).concat(data[item]);
    // // 如果超出限制数组长度，则删除第一个
    if (source[item].length >= length) {
      source[item].splice(0, source[item].length - length);
    }
  })
}

function handleArrayChartData (data, source, length = 60, fn = k => k) {
  data.map(k => fn(k)).forEach(val => {
    Object.keys(val).map(v => {
      // 每次进行数据追加
      source[v] = (source[v] || []).concat(val[v]);
      // 如果超出限制数组长度，则删除第一个
      if (source[v].length >= length) {
        source[v].splice(0, source[v].length - length);
      }
    });
  });
}

export default handleChartData
