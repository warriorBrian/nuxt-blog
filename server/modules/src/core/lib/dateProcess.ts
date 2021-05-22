/**
 * @desc 时间格式化
 * @param date {Date} 时间，时间戳：秒，毫秒，秒可以为小数但必须是时间戳 / 1000 结果小数
 * @param fmt {string} 时间格式 YYYY-MM-DD hh:mm:ss
 * @todo 特别注意：如果传递值错误则无法正常返回，则会返回 1970年月份
 * @example
 * dateProcess(new Date(), 'YYYY-MM-DD')
 * // => 2020-01-01
 * */
export const dateProcess = (date, fmt) => {
  if (date) {
    /**
     * @param handlerDecimals 判断是否为小数，如果为小数则视为（秒）级时间戳，转成正整数，否则使用传递值
     * @param numberLength 如果长度大于10，则视为（毫秒级）时间戳
     * */
    const index = date.toString().indexOf(".");
    const handlerDecimals = !!~index ? parseInt(date) : date;
    const numberLength = handlerDecimals.toString().length;
    date = numberLength > 10 ? new Date(handlerDecimals) : new Date(handlerDecimals * 1000);
  }
  const o = {
    "Y+": date.getFullYear().toString(),        // 年
    "M+": (date.getMonth() + 1).toString(),     // 月
    "D+": date.getDate().toString(),            // 日
    "h+": date.getHours().toString(),           // 时
    "m+": date.getMinutes().toString(),         // 分
    "s+": date.getSeconds().toString()          // 秒
  };
  Object.keys(o).forEach(key => {
    const ret = new RegExp(`(${key})`).exec(fmt);
    ret && ( fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (o[key]) : (o[key].padStart(ret[1].length, "0"))) );
  });
  return fmt;
};

export default dateProcess
