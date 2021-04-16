// ------------------------------------------------------------------------------
// name: launch 小程序启动相关辅助工具方法
// author: mudas( mschool.tech )
// created: 2020/5/11 14:51
// ------------------------------------------------------------------------------

import QS from 'query-string';

export function analyzeOption(option = {}) {
  let query;

  // 正式环境
  // option.query.q 字符串类型  ?a=1&b=2
  if (option.query && option.query.q) {
    const url = decodeURIComponent(option.query.q);

    if (url.indexOf('?') !== -1) {
      query = QS.parse(url.substr(url.indexOf('?') + 1));
    }
  }

  // 测试环境
  // object 类型 {a:1,b:2}
  else {
    query = option.query || option || Object.create(null);
  }

  // 解码参数值
  Object.keys(query).forEach(key => {
    query[key] = unescape(query[key]);
  });

  return query;
}
