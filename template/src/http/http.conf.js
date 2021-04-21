// ------------------------------------------------------------------------------
// name: http.conf.js
// author: mudas( mschool.tech )
// created: 2021/4/19 22:19
// ------------------------------------------------------------------------------

/**
 * Http运行时配置和相关应用链接地址的读取支持
 * @type {RequestOptions}
 */
export default {
  /**
   * 超时时间
   */
  timeout: 30000,

  /**
   * 如果设为json，会尝试对返回的数据做一次 JSON.parse
   */
  dataType: 'json',

  /**
   * 验证 ssl 证书
   */
  sslVerify: false,

  /**
   * 设置请求的 header，header 中不能设置 Referer。
   */
  header: {
    // 全局设置跳过 token 验证（任何接口都跳过验证）
    invoke_source: 9999,
    invokeSource: 9999
  }
};
