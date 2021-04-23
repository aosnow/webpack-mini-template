import Vue from 'vue';

// ----------------------------------------
// 基本环境配置
// ----------------------------------------
import './init';

// ----------------------------------------
// 本地数据
// ----------------------------------------
import store from '@/store';

// ----------------------------------------
// 入口组件
// ----------------------------------------
import App from '@/App';

// ----------------------------------------
// 全局组件
// ----------------------------------------
import AuthDialog from '@/components/auth/AuthDialog';
import WebViewClient from '@/components/webview/WebViewClient';
import SIcon from '@/components/icon/icon';
import SBadge from '@/components/badge/badge';

Vue.component('auth-dialog', AuthDialog);
Vue.component('web-view-client', WebViewClient);

Vue.component('s-icon', SIcon);
Vue.component('s-badge', SBadge);

// ----------------------------------------
// Vue 全局参数设置
// ----------------------------------------
Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue({
  store,
  ...App
}).$mount();
