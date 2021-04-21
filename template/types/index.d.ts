// ------------------------------------------------------------------------------
// name: index.d
// author: 喵大斯( mschool.tech )
// created: 2019/8/22
// ------------------------------------------------------------------------------

import { EasyHttpInstance, EasyHttpComplex } from './EasyHttp';

declare module 'vue/types/vue' {
  // Vue.xxx 静态成员
  interface VueConstructor {
    http: EasyHttpInstance & EasyHttpComplex;
  }

  // this.$xxx 实例成员
  interface Vue {
    $http: EasyHttpInstance & EasyHttpComplex;
  }
}
