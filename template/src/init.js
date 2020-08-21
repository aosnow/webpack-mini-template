// ------------------------------------------------------------------------------
// name: init
// author: mudas( mschool.tech )
// created: 2020/5/6 20:02
// ------------------------------------------------------------------------------

import Vue from 'vue';
import { EasyHttp, getEnv, getConfig } from '@/utils';
import Config from './config'; // 根据不同的 platform 加载不同的配置

// 通信方法
Vue.prototype.$http = EasyHttp(Config);

// 环境变量获取
Vue.prototype.$var = (key) => {
  return getConfig(key);
};

// 环境变量获取（按发布环境不同获取）
Vue.prototype.$env = (key) => {
  return getEnv(key, Config);
};
