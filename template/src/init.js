// ------------------------------------------------------------------------------
// name: init
// author: mudas( mschool.tech )
// created: 2020/5/6 20:02
// ------------------------------------------------------------------------------

import Vue from 'vue';

import EasyHttp from '@/http';
import Filter from '@/filter';
import mixEnv from '@/mixins/env';
import { navigateTo, redirectTo, reLaunch } from '@/utils';

import Config from './config'; // 根据不同的 platform 加载不同的配置

// ----------------------------------------
// 支持 query 参数的跳转方法
// ----------------------------------------
Vue.prototype.$navigateTo = navigateTo;
Vue.prototype.$redirectTo = redirectTo;
Vue.prototype.$reLaunch = reLaunch;

// ----------------------------------------
// Vue 全局过滤器
// ----------------------------------------
Vue.use(Filter);

// ----------------------------------------
// Vue 全局混合
// ----------------------------------------
Vue.mixin(mixEnv);

// ----------------------------------------
// 初始化 http
// ----------------------------------------
Vue.http = Vue.prototype.$http = EasyHttp(Config);
