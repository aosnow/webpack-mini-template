// ------------------------------------------------------------------------------
// name: index
// author: mudas( mschool.tech )
// created: 2020.05.04 上午 2:28
// ------------------------------------------------------------------------------

// #ifdef MP-ALIPAY
import PlatformConfig from './alipay.conf';
// #endif
// #ifdef MP-WEIXIN
import PlatformConfig from './wechat.conf';
// #endif

// 系统配置常量信息
export default {
  // test | pre | release 目前主要影响所使用的 http 配置
  env: 'test',

  // 自动加载不同平台的相关配置
  ...PlatformConfig
};
