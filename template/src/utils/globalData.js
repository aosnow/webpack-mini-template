// ------------------------------------------------------------------------------
// name: globalData 响应式的 globalData
// author: mudas( mschool.tech )
// created: 2020.05.05 上午 6:17
// ------------------------------------------------------------------------------

import Vue from 'vue';

const toString = Object.prototype.toString;

function isObject(obj) {
  return toString.call(obj) === '[object Object]';
}

// 将数据对象转换成可响应对象
export function observableGlobalData(data) {
  return Vue.observable(data);
}

/**
 * 批量导出 getApp().globalData 的数据
 * <p>
 *  支持 "a.b.c" 的方式引用多层级属性值，但需要传送 {} 参数类型，该方式不支持在 Array 参数类型中使用
 *  ...mapGlobalData({
 *    avatarDot: 'userInfo.avatar'
 *  })
 * </p>
 * @param {Object|string[]} params
 * @param {boolean} [transComputedProperty] 是否转换为 computed 属性函数结构
 * @return {any}
 */
export function mapGlobalData(params, transComputedProperty = true) {
  let data = Object.create(null);

  if (Array.isArray(params)) {
    params.forEach(key => {
      if (typeof key === 'string') data[key] = key;
    });
  }
  else {
    Object.keys(params).forEach(key => {
      if (typeof params[key] === 'string') data[key] = params[key];
    });
  }

  Object.keys(data).forEach(key => {
    const truthKey = data[key];

    if (typeof truthKey === 'string') {
      const { parent, key: nodeKey } = _autoObservableGet(truthKey);

      // 然后再取值
      data[key] = !transComputedProperty
                  ? parent[nodeKey] // 只返回当前值，无法保留可响应性
                  : function() {
          return parent[nodeKey]; // 做为 computed 时必须返回 reactiveGetter
        };
    }
  });

  return data;
}

/**
 * 设置全局数据
 * @param {string|object} source 需要设置的 key，或者直接批量设置多个值
 * @param [globalData] 当在 App.vue 使用时，getApp().globalData 尚未创建，需要指定具体的目标全局数据容器
 */
export function setGlobalData(source, globalData = null) {
  if (!source) return;

  if (isObject(source)) {
    Object.keys(source).forEach(key => {
      _autoObservableSet(key, source[key], globalData);
    });
  }
}

/**
 * 自动检测是否为可响应式数据，并设置新的值
 * @param key
 * @param value
 * @param globalData
 * @private
 */
function _autoObservableSet(key, value, globalData = null) {
  globalData = globalData || getApp().globalData;

  // 未定义的新属性
  if (globalData[key] === undefined) {
    Vue.set(globalData, key, value);
  }

  // 给原本 Object 节点赋值，需要重新 set 保持新 value 中的响应性
  else if (isObject(globalData[key])) {
    Object.keys(value).forEach(valueKey => {
      _autoObservableSet(valueKey, value[valueKey], globalData[key]);
    });
  }
  else {
    globalData[key] = value;
  }
}

/**
 * 自动解析“a.b.c”的父子结构语法引用属性
 * @param key
 * @param globalData
 * @return {Object} 如“a.b.c”，返回 {parent:b, key:'c', value:'c的值'}
 * @private
 */
function _autoObservableGet(key, globalData = null) {
  globalData = globalData || getApp().globalData;
  const keys = key.split('.');

  // globalData.userInfo.avatar
  return keys.reduce((node, nodeKey, index) => {
    const { value } = node;
    const childNode = { parent: value, key: nodeKey, value: value[nodeKey] };

    // 中间节点提前设置可响应式的空 {}，末节点直接设置 null 值
    if (childNode.value === undefined || childNode.value === null) {
      Vue.set(value, nodeKey, index === keys.length - 1 ? null : Object.create(null));
    }

    return childNode;
  }, { parent: null, key: '', value: globalData });
}
