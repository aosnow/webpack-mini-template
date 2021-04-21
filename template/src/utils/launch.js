// ------------------------------------------------------------------------------
// name: launch 小程序启动相关辅助工具方法
// author: mudas( mschool.tech )
// created: 2020/5/11 14:51
// ------------------------------------------------------------------------------

import Query from 'query-string';

/**
 * 统一格式化多种场景下的 query 参数信息
 * @param option
 * @return {Object}
 */
export function formatOption(option = {}) {
  let result;
  const { query = {}, ...other } = option;

  // 正式环境
  // option.query.q 字符串类型  ?a=1&b=2
  if (query.q) {
    const url = decodeURIComponent(option.query.q);
    result = url.indexOf('?') !== -1 ? Query.parse(url.substr(url.indexOf('?') + 1)) : {};
  }

  // 测试环境
  // object 类型 {a:1,b:2}
  else {
    result = { ...query, ...other };
  }

  // 解码参数值
  Object.keys(result).forEach(key => {
    result[key] = result[key] ? decodeURIComponent(result[key]) : undefined;
  });

  return result;
}
