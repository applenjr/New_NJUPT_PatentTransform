import isString from "lodash/isString";
import isObject from "lodash/isObject";

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export function joinTimestamp<T extends boolean>(join: boolean, restful: T): T extends true ? string : object;

export function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join) {
    return restful ? "" : {};
  }
  const now = new Date().getTime();
  if (restful) {
    return `?_t=${now}`;
  }
  return { _t: now };
}

// 格式化提交参数时间
export function formatRequestDate(params: Recordable) {
  if (Object.prototype.toString.call(params) !== "[object Object]") {
    return;
  }

  for (const key in params) {
    // eslint-disable-next-line no-underscore-dangle
    if (params[key] && params[key]._isAMomentObject) {
      params[key] = params[key].format(DATE_TIME_FORMAT);
    }
    if (isString(key)) {
      const value = params[key];
      if (value) {
        try {
          params[key] = isString(value) ? value.trim() : value;
        } catch (error: any) {
          throw new Error(error);
        }
      }
    }
    if (isObject(params[key])) {
      formatRequestDate(params[key]);
    }
  }
}

// 将对象转为Url参数
export function setObjToUrlParams(baseUrl: string, obj: object): string {
  let parameters = "";
  for (const key in obj) {
    parameters += `${key}=${encodeURIComponent(obj[key])}&`;
  }
  parameters = parameters.replace(/&$/, "");
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, "?") + parameters;
}


// 获取时间差
export function TimeDiffer(time: string) {
  let new_date = new Date(); //新建一个日期对象，默认现在的时间
  let old_date = new Date(time); //设置过去的一个时间点，"yyyy-MM-dd HH:mm:ss"格式化日期

  // @ts-ignore
  let difftime = (new_date - old_date) / 1000; //计算时间差,并把毫秒转化成秒

  // @ts-ignore
  let days = parseInt(difftime / 86400); // 天  24*60*60*1000
  // @ts-ignore
  let hours = parseInt(difftime / 3600) - 24 * days; // 小时 60*60 总小时数-过去的小时数=现在的小时数
  // @ts-ignore
  let minutes = parseInt((difftime % 3600) / 60); // 分钟 -(day*24) 以60秒为一整份 取余 剩下秒数 秒数/60 就是分钟数
  // @ts-ignore
  let seconds = parseInt(difftime % 60); // 以60秒为一整份 取余 剩下秒数

  // if (days > 15) {
  //   return true;
  // }
  // return false;

  return days;
}
