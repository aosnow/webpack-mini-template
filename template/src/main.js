import Vue from 'vue';

// ----------------------------------------
// 基本环境配置
// ----------------------------------------
import './init';

// ----------------------------------------
// 入口组件
// ----------------------------------------
import App from '@/App';

// ----------------------------------------
// 全局组件
// ----------------------------------------
import AuthDialog from '@/components/auth/AuthDialog';
import WebViewClient from '@/components/webview/WebViewClient';

Vue.component('auth-dialog', AuthDialog);
Vue.component('web-view-client', WebViewClient);

// ----------------------------------------
// Vue 全局参数设置
// ----------------------------------------
Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue({
  ...App
}).$mount();
