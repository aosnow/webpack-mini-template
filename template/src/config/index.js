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

export default {
  env: 'test',  // test | pre | release 目前主要影响所使用的 http 配置
  appName: 'sweep',

  // 根据不同的业务导向自定义（银盒子小程序根据菜单手动指定）
  // 其它业务级小程序固定（如会员小程序则固定为'member'），目前暂不开发业务级小程序，全部通过 sliverbox.mini 进行导向
  mini_type: 'sweep',
  imgPath: '', // 全局图片绝对地址

  shop_id: 1000000,
  store_id: '', //1000001
  table_info_id: '',
  guid: '', // 通用码 guid 值
  scene: '', // 小程序打开时的来源渠道类型

  // 小程序打开时的 query 参数集合
  query: {},

  // 小程序授权用户信息
  userInfo: {
    avatar: '',
    gender: 1,
    mobile: '',
    nickName: '',
    thirdUserId: '',
    unionId: '',
    userId: '',

    // 地图相关信息
    longitude: 0, // 经度
    latitude: 0 // 纬度
  },

  // 用户本机系统信息
  // uni.getSystemInfo(OBJECT) 获取
  systemInfo: {
    /*
    brand: "devtools" "iPhone"
    model: "iPhone 6/7/8" "iPhone 8 Plus (GSM+CDMA)<iPhone10,2>"
    pixelRatio: 2
    screenHeight: 667
    screenWidth: 375
    windowHeight: 619
    windowWidth: 375
    statusBarHeight: 20       // 顶部状态栏的高度
    language: "zh_CN"
    version: "7.0.4"
    system: "iOS 10.0.1" "iOS 13.6"
    platform: "devtools" "ios"
    SDKVersion: "2.14.0"
    fontSizeSetting: 16       // 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px

    // 微信小程序
    safeArea: {right: 375, bottom: 667, left: 0, top: 20, width: 375, …}
    safeAreaInsets: {top: 20, left: 0, right: 0, bottom: -48}
     */
  },

  // http 请求默认配置
  http: {
    timeout: 30000,
    dataType: 'json'
  },

  // 环境链接
  test: {
    h5url: 'http://tst.blibao.com:10080/groupbuy/',
    auth: 'http://test.blibao.com/Auth/',
    pay: 'https://dev.blibao.com/SweepPay/',
    openapi: 'http://test.api.blibao.com/ApiService/',
    syncapi: 'http://test.api.blibao.com/sync/',
    marketing: 'http://test.api.blibao.com:8080/marketing/',
    sweep: 'http://test.blibao.com:5001/',
    member: 'http://test.blibao.com:10080/api/member-user/',
    sweepapi: 'http://test.api.blibao.com/sweep-api/',
    app: 'http://172.16.8.28:18080/business-data-site-offer/',

    // 业务根级地址
    url: {
      activity: 'http://test.blibao.com:10080/act/',
      sweep: 'http://test.blibao.com:10080/smo/',
      // sweep: 'http://172.16.5.2:8081/',
      member: 'http://test.blibao.com:10080/member-h5-vue/',
      groupbuy: 'http://test.blibao.com:10080/groupbuy/',
      reserve: 'http://test.blibao.com:10080/reserve/',
      queue: 'http://test.blibao.com:10080/queue/'
    }
  },
  pre: {
    h5url: '',
    auth: '',   // https://pre-test-api.blibao.com/Auth
    pay: '',
    openapi: '',
    sweep: '',
    member: '',
    sweepapi: '',

    // 业务根级地址
    url: {
      member: ''
    }
  },
  release: {
    h5url: '',
    auth: '',
    pay: '',
    openapi: '',
		sweep: '',
    member: '',
    sweepapi: '',

    // 业务根级地址
    url: {
      member: ''
    }
  },

  // 自动加载不同平台的相关配置
  ...PlatformConfig
};
