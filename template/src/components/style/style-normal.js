// ------------------------------------------------------------------------------
// name: style-normal
// author: mudas( mschool.tech )
// created: 2021/4/22 22:16
// ------------------------------------------------------------------------------

import { isString, isPlainObject, kebabCase } from '@/utils';

/*
由于 uni-app 在支付宝和微信环境下，对在 template 上设置的 `:class=Array :class={}` 样式操作，
会表现为差异性的结果，如支付宝小程序中会将数组结果解析为以“,”为分隔的字符串：
如：:class=['a','b','c'] 会被解析为 :class='a,b,c'
而 :style 也存在相同的问题，因此在设计组件时，需要将对应的设置数据“推平”为最终字符串，以“空格”相隔
 */

/**
 * 将数组或者对象类型的 style 数据展平为 string 结果
 * @param {string|object} key 内联样式的属性名
 * @param {string|object} [styles] 样式列表
 * @returns {string}
 */
export function normalStyle(key, styles) {
  if (!isString(key)) {
    styles = key;
    key = '';
  }

  if (isString(key) && isString(styles)) {
    // 单个样式属性
    return `${kebabCase(key)}:${styles};`;
  }
  else if (isPlainObject(styles)) {
    return Object.keys(styles).map((key) => {
      return normalStyle(key, styles[key]);
    }).join(' ');
  }

  return '';
}

/**
 * 将数组或者对象类型的 class 数据展平为 string 结果
 * @param {string|string[]|object} classes 样式列表
 * @returns {string}
 */
export function normalClasses(classes) {
  if (isString(classes)) {
    return classes;
  }
  else if (Array.isArray(classes)) {
    return classes.map(item => {
      return normalClasses(item);
    }).join(' ');
  }
  else {
    return Object.keys(classes).reduce((s, key) => {
      const value = classes[key];
      if (!!value) s.push(key);
      return s;
    }, []).join(' ');
  }
}
