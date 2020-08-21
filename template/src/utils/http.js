// ------------------------------------------------------------------------------
// name: http
// author: mudas( mschool.tech )
// created: 2020/5/6 17:44
// ------------------------------------------------------------------------------

function mergeHttpUrls(host, ...urls) {
  host = `${host}/`.replace(/\/{2,}$/i, '');
  const prefixUrls = urls.map(url => `/${url}`.replace(/\/{2,}/i, '/'));
  return `${host}${prefixUrls.join('')}`;
}

// HTTP 接口请求包装
export default (config) => {

  const { env, http } = config;

  return {
    get({ scope = 'sweep-api', url, data, header, success, fail, complete }) {
      return this.request({ scope, url, data, header, method: 'GET', success, fail, complete });
    },

    post({ scope = 'sweep-api', url, data, header, success, fail, complete }) {
      return this.request({ scope, url, data, header, method: 'POST', success, fail, complete });
    },

    /**
     * http 请求
     * @param {RequestOptions} option
     */
    request(option) {
      const { scope, url, success, fail, complete } = option;
      const httpOption = config[env] || config['test'];
      option.url = mergeHttpUrls(httpOption[scope], url);

      if (typeof success !== 'function') {
        delete option.success;
      }
      else {
        const holder = option.success;
        option.success = (data) => {
          const { data: { code } } = data;
          if (code !== undefined) data.data.code = parseInt(code, 10);
          return holder(data);
        };
      }
      if (typeof fail !== 'function') delete option.fail;
      if (typeof complete !== 'function') delete option.complete;

      return uni.request({ ...http, ...option });
    }

  };
};
