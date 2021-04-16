// ------------------------------------------------------------------------------
// name: http
// author: mudas( mschool.tech )
// created: 2020/5/6 17:44
// ------------------------------------------------------------------------------

import { ServiceError } from '@/error';
import { mergeURL } from '@/utils';

/**
 * http 请求
 * @param {RequestOptions} option
 */
function httpRequest(option) {
  const { host, url } = option;
  option.url = mergeURL(host, url);

  return new Promise((resolve, reject) => {
    uni.request({
      ...option,

      /**
       * 请求成功
       * @param {RequestSuccessCallbackResult} result
       */
      success: (result) => {
        const { data = {}, statusCode } = result;
        data.code = data.code && parseInt(data.code, 10);

        // 网络或者服务器异常
        if (!statusCode) {
          reject(new ServiceError('Server connection abnormal or refused'), 0);
        }

        // 连接正常
        else if (statusCode === 200 && (data.success || data.code === 10000)) {
          resolve(result);
        }
        else {
          let errorData = data;
          let extraMessage = '';

          const { msg, sub_msg, subMsg } = data;
          if (data.code) errorData = data.data;

          if (errorData) {
            const { error, exception, timestamp, message, path } = errorData;
            extraMessage = `\n【type】${error || 'unknow error'}\n【path】${path}\n【exception】${exception}\n【timestamp】${timestamp}\n【message】${message.substr(0, 100)}...`;
          }

          if (process.env.NODE_ENV === 'development') console.error(`${sub_msg || subMsg || msg || 'unknow error'}${extraMessage}`);
          reject(new ServiceError(`${sub_msg || subMsg || msg || 'unknow error'}`, data.code));
        }

      },

      /**
       * 请求失败
       * @param {GeneralCallbackResult} reason
       */
      fail: (reason) => {
        reject(reason);
      }

      // /**
      //  * 请求完成（不论成功、失败都会执行）
      //  * @param {GeneralCallbackResult} reason
      //  */
      // complete: (reason) => {
      //   return reason;
      // }

    });
  });
}

// HTTP 接口请求包装
export default (config) => {

  const { env, http } = config;

  const Http = Object.create(null);
  const HttpOption = config[env] || config['test'];

  Object.keys(HttpOption).forEach(api => {
    if (api === 'url') return true;

    Http[api] = {
      get(url, data = null, params = {}) {
        // 跳过 token 验证
        params.header = params.header || {};
        if (!params.header.token) params.header.invoke_source = 9999;

        return httpRequest({ host: HttpOption[api], method: 'GET', url, data, ...http, ...params });
      },

      post(url, data = null, params = {}) {
        // 跳过 token 验证
        params.header = params.header || {};
        if (!params.header.token) params.header.invoke_source = 9999;

        return httpRequest({ host: HttpOption[api], method: 'POST', url, data, ...http, ...params });
      }
    };
  });

  return Http;
};
