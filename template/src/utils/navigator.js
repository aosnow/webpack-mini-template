// ------------------------------------------------------------------------------
// name: navigator
// author: mudas( mschool.tech )
// created: 2020/12/15 10:56
// ------------------------------------------------------------------------------

import Query from 'query-string';

/**
 * 保留当前页面，跳转到应用内的某个页面
 * @param {NavigateToOptions} options
 */
export function navigateTo(options) {
  const { url, query, ...navigateToOptions } = options;
  const queryOptions = query ? `?${Query.stringify(query)}` : '';
  uni.navigateTo({ url: `${url}${queryOptions}`, ...navigateToOptions });
}

/**
 * 关闭当前页面，跳转到应用内的某个页面
 * 文档: [http://uniapp.dcloud.io/api/router?id=redirectto](http://uniapp.dcloud.io/api/router?id=redirectto)
 * @param {RedirectToOptions} options
 */
export function redirectTo(options) {
  const { url, query, ...navigateToOptions } = options;
  const queryOptions = query ? `?${Query.stringify(query)}` : '';
  uni.redirectTo({ url: `${url}${queryOptions}`, ...navigateToOptions });
}

/**
 * 关闭所有页面，打开到应用内的某个页面
 * 文档: [http://uniapp.dcloud.io/api/router?id=relaunch](http://uniapp.dcloud.io/api/router?id=relaunch)
 * @param {ReLaunchOptions} options
 */
export function reLaunch(options) {
  const { url, query, ...navigateToOptions } = options;
  const queryOptions = query ? `?${Query.stringify(query)}` : '';
  uni.reLaunch({ url: `${url}${queryOptions}`, ...navigateToOptions });
}
