// ------------------------------------------------------------------------------
// name: env
// author: mudas( mschool.tech )
// created: 2021/4/19 23:49
// ------------------------------------------------------------------------------

import { mapGetters } from 'vuex';
import * as Types from '@/store/types';
import { get, set, isString, isPlainObject, merge } from '@/utils';
import AppConfig from '@/config';
import URLConfig from '@/http/url.conf';

function formatData(path, value) {
  if (isString(path)) {
    const data = {};
    set(data, path, value);
    return data;
  }

  return isPlainObject(path) ? path : {};
}

// 对项目配置、环境参数快速读写的辅助方法
export default {

  computed: {
    ...mapGetters({
      configInfo: Types.ENV_CONFIG,
      paramsInfo: Types.ENV_PARAMS,
      systemInfo: Types.ENV_SYSTEM,
      userInfo: Types.USER_INFO
    }),

    // 当前运行环境
    environment() {
      const { env = 'test' } = AppConfig;
      return env;
    },

    // 应用是否启动完毕（启动事务完成初始化）
    ready: {
      get() {
        return this.getApp().globalData.readyState;
      },
      /**
       * 设置应用准备状态
       * @param {Boolean} value
       */
      set(value) {
        this.getApp().globalData.readyState = value;
      }
    },

    // 全局可使用的 appId
    appId() {
      return this.getConfig('appId');
    }
  },

  methods: {

    /**
     * 当前小程序实例（即 App.vue 的实例）
     * @returns {tinyapp.IGetAppResult}
     */
    getApp() {
      // 微信环境在 App.vue 中通过 getApp() 取值为 undefined，需要通过 this.$scope 获取 globalData
      return getApp() || this.$scope;
    },

    /**
     * 设置小程序全局数据
     * @param {string|object} key 需要设置单个数据的 path，或者批量数据的 object 数据集合（如 `a.b` 或者 `{a:{b:value}}`）
     * @param {any} [value=null] 需要设置的数据（若 `path` 为 `object` 批量设置数据的场景，此 `value` 可省略）
     */
    setGlobalData(key, value) {
      const data = formatData(key, value);
      merge(this.getApp().globalData, data);
    },

    /**
     * 读取小程序全局数据
     * @param {string} [path=''] 属性名（可以是多级属性名 `a.b.c`，若某级属性不存在，则返回 null）
     * @return {any}
     */
    getGlobalData(path = '') {
      return !!path ? get(this.getApp().globalData, path) : this.getApp().globalData;
    },

    /**
     * 获取当前环境对应的应用根地址
     * @param {string} [path=''] 属性名（如：`sweep` 取扫码点餐根地址）
     * @return {String} 返回指定 path 对应的根地址。否则返回当前环境所有应用根地址的集合。
     */
    getURL(path = '') {
      const root = URLConfig[this.environment];
      return !!path ? get(root, path) : root;
    },

    /**
     * 获取项目配置的某项数据
     * @param {string} [path=''] 属性名（可以是多级属性名 `a.b.c`，若某级属性不存在，则返回 null）
     * @return {any}
     */
    getConfig(path = '') {
      return !!path ? get(this.configInfo, path) : this.configInfo;
    },

    /**
     * 设置配置数据
     * @param {string|object} path 需要设置单个数据的 path，或者批量数据的 object 数据集合（如 `a.b` 或者 `{a:{b:value}}`）
     * @param {any} [value=null] 需要设置的数据（若 `path` 为 `object` 批量设置数据的场景，此 `value` 可省略）
     */
    setConfig(path, value = null) {
      this.$store.commit(Types.ENV_CONFIG, formatData(path, value));
    },

    /**
     * 获取项目启动时 query 数据中的某项数据
     * @param {string} [path=''] 属性名（可以是多级属性名 `a.b.c`，若某级属性不存在，则返回 null）
     * @return {any}
     */
    getParam(path = '') {
      return !!path ? get(this.paramsInfo, path) : this.paramsInfo;
    },

    /**
     * 设置 query 数据
     * @param {string|object} path 需要设置单个数据的 path，或者批量数据的 object 数据集合（如 `a.b` 或者 `{a:{b:value}}`）
     * @param {any} [value=null] 需要设置的数据（若 `path` 为 `object` 批量设置数据的场景，此 `value` 可省略）
     */
    setParam(path, value = null) {
      this.$store.commit(Types.ENV_PARAMS, formatData(path, value));
    },

    /**
     * 获取用户终端硬件、软件环境相关的某项数据
     * @param {string} [path=''] 属性名（可以是多级属性名 `a.b.c`，若某级属性不存在，则返回 null）
     * @return {any}
     */
    getSystem(path = '') {
      return !!path ? get(this.systemInfo, path) : this.systemInfo;
    },

    /**
     * 设置用户终端硬件、软件环境相关数据
     * @param {string|object} path 需要设置单个数据的 path，或者批量数据的 object 数据集合（如 `a.b` 或者 `{a:{b:value}}`）
     * @param {any} [value=null] 需要设置的数据（若 `path` 为 `object` 批量设置数据的场景，此 `value` 可省略）
     */
    setSystem(path, value = null) {
      this.$store.commit(Types.ENV_SYSTEM, formatData(path, value));
    },

    /**
     * 获取用户信息某项数据
     * @param {string} [path=''] 属性名（可以是多级属性名 `a.b.c`，若某级属性不存在，则返回 null）
     * @return {any}
     */
    getUserinfo(path = '') {
      return !!path ? get(this.userInfo, path) : this.systemInfo;
    },

    /**
     * 设置用户信息相关数据
     * @param {string|object} path 需要设置单个数据的 path，或者批量数据的 object 数据集合（如 `a.b` 或者 `{a:{b:value}}`）
     * @param {any} [value=null] 需要设置的数据（若 `path` 为 `object` 批量设置数据的场景，此 `value` 可省略）
     */
    setUserinfo(path, value = null) {
      this.$store.commit(Types.USER_INFO, formatData(path, value));
    }

  }

};
