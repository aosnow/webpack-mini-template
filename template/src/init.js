// ------------------------------------------------------------------------------
// name: init
// author: mudas( mschool.tech )
// created: 2020/5/6 20:02
// ------------------------------------------------------------------------------

import Vue from 'vue';

import { EasyHttp, getEnv, getConfig, navigateTo, redirectTo, reLaunch } from '@/utils';
import Filter from '@/filter';
import Config from './config'; // 根据不同的 platform 加载不同的配置

// 环境变量获取
Vue.prototype.$var = (key) => {
  return getConfig(key);
};

// 环境变量获取（按发布环境不同获取）
Vue.prototype.$env = (key) => {
  return getEnv(key, Config);
};

// 支持 query 参数的跳转方法
Vue.prototype.$navigateTo = navigateTo;
Vue.prototype.$redirectTo = redirectTo;
Vue.prototype.$reLaunch = reLaunch;

// ----------------------------------------
// Vue 全局过滤器（依赖 Vue.conf）
// ----------------------------------------
Vue.use(Filter);

// ----------------------------------------
// 初始化 http
// ----------------------------------------
Vue.http = Vue.prototype.$http = EasyHttp(Config);
