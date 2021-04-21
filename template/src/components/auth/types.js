// ------------------------------------------------------------------------------
// name: event
// author: mudas( mschool.tech )
// created: 2020/5/8 15:58
// ------------------------------------------------------------------------------

// #ifdef MP-ALIPAY
export const ScopeType = {
  USER_INFO: 'userInfo',
  PHONE_NUMBER: 'phoneNumber'
};
// #endif

// #ifdef MP-WEIXIN
export const ScopeType = {
  USER_INFO: 'scope.userInfo',
  PHONE_NUMBER: 'scope.phoneNumber'
};
// #endif

export const EventType = {
  [ScopeType.USER_INFO]: 'user-info',
  [ScopeType.PHONE_NUMBER]: 'phone'
};
