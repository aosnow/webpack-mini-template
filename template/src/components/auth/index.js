// ------------------------------------------------------------------------------
// name: index
// author: mudas( mschool.tech )
// created: 2020/5/7 14:43
// ------------------------------------------------------------------------------

// #ifdef MP-ALIPAY
import AuthMixin from './alipay';
// #endif
// #ifdef MP-WEIXIN
import AuthMixin from './wechat';
// #endif

export default AuthMixin;
