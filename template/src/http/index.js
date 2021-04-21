// ------------------------------------------------------------------------------
// name: index
// author: mudas( mschool.tech )
// created: 2021/4/19 22:22
// ------------------------------------------------------------------------------

import { ServiceError } from '@/error';
import { mergeURL } from '@/utils';
import AppConfig from '@/config';
import HttpOption from './http.conf';
import ApiConfig from './api.conf';
import transformResponse from './transformResponse';

/**
 * http 请求
 * @param {RequestOptions} option
 */
function httpRequest(option) {
  const { host, url } = option;

  option.url = mergeURL(host, url);
  option.method = (option.method || 'get').toUpperCase();

  return new Promise((resolve, reject) => {
    uni.request({
      ...option,

      /**
       * 请求成功
       * @param {RequestSuccessCallbackResult} result
       */
      success: (result) => {
        const { statusCode } = result;
        const data = transformResponse(result.data);

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
export default () => {

  const { env = 'test' } = AppConfig;
  const Http = Object.create(null);
  const config = ApiConfig[env] || ApiConfig['test'];

  Object.keys(config).forEach(api => {
    /**
     * 发送 http 请求
     * @param {RequestOptions} options 单个请求配置如“{ method:'', url:'', params:{}, data:{} }”
     * @returns {Promise}
     */
    const request = (options) => {
      const RequestOptions = { method: 'get', ...HttpOption, ...options };
      RequestOptions.host = config[api];

      return httpRequest(RequestOptions);
    };

    /**
     * 通过 get 方式请求数据
     * @param {string} url 请求地址
     * @param {*} [data=null] 需要提交的参数数据（做为 url params 提交）
     * @param {RequestOptions} [conf] 附加配置参数（可覆盖默认配置，如覆盖 responseType）
     * @returns {Promise}
     */
    const get = (url, data = null, conf = {}) => {
      return request({ url, data, method: 'get', ...conf });
    };

    /**
     * 通过 post 方式提交参数并请求数据
     * @param {string} url 请求地址
     * @param {*} [data=null] 需要提交的参数数据
     * @param {RequestOptions} [conf] 附加配置参数（可覆盖默认配置，如覆盖 responseType）
     * @returns {Promise}
     */
    const post = (url, data = null, conf = {}) => {
      return request({ url, data, method: 'post', ...conf });
    };

    Http[api] = { request, get, post };
  });

  return Http;
};
