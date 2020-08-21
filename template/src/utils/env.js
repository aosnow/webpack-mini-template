// ------------------------------------------------------------------------------
// name: env
// author: mudas( mschool.tech )
// created: 2020/5/6 21:44
// ------------------------------------------------------------------------------

import { mapGlobalData } from '@/utils';

/**
 * 获取指定环境变量
 * @param config 配置信息
 * @param key 属性名
 */
export function getEnv(key, config) {
  const scope = config.env || 'test';
  const data = mapGlobalData({ value: `${scope}.${key}` }, false);
  return data.value;
}

/**
 * 查询配置数据
 * <p>
 *  支持 "a.b.c" 的方式引用多层级属性值，但需要传送 {} 参数类型，该方式不支持在 Array 参数类型中使用
 *  ...mapGlobalData({
 *    avatarDot: 'userInfo.avatar'
 *  })
 * </p>
 * @param key
 */
export function getConfig(key) {
  const data = mapGlobalData({ value: key }, false);
  return data.value;
}
