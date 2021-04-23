// ------------------------------------------------------------------------------
// name: unit
// author: mudas( mschool.tech )
// created: 2021/4/22 17:48
// ------------------------------------------------------------------------------

import { isNumeric, isNil } from '@mudas/util';

/**
 * 主要配合同时支持 number 和 string 类型的 props 数据，快捷添加后缀单位
 * @param {string|number} value
 * @param {string} suffix
 * @return {string|number}
 */
export function addUnit(value, suffix = 'px') {
  if (!value) {
    return undefined;
  }

  value = String(value);
  return isNumeric(value) ? `${value}${suffix}` : value;
}

/**
 * 检测指定的值是否有效，一般应用于自定义组件中检测 prop 值
 * @param {*} value
 * @return {boolean}
 */
export function isDefine(value) {
  return !isNil(value);
}
