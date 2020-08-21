// ------------------------------------------------------------------------------
// name: index
// author: mudas( mschool.tech )
// created: 2020.05.04 上午 2:28
// ------------------------------------------------------------------------------

// #ifdef MP-ALIPAY
import PlatformConfig from './alipay.conf';

let source = 'ALIPAY';
// #endif
// #ifdef MP-WEIXIN
import PlatformConfig from './wechat.conf';

let source = 'WX';
// #endif

export default {
  env: 'test',  // test | pre | release 目前主要影响所使用的 http 配置
  appName: 'sweep',

  // 根据不同的业务导向自定义（银盒子小程序根据菜单手动指定）
  // 其它业务级小程序固定（如会员小程序则固定为'member'），目前暂不开发业务级小程序，全部通过 sliverbox.mini 进行导向
  mini_type: 'sweep',
  imgPath: 'https://img.blibao.com/',

  shop_id: 1000000,
  store_id: '', //1000001
  table_info_id: '',
  guid: '', // 通用码 guid 值
  scene: '', // 小程序打开时的来源渠道类型

	source: source,

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
    userId: ''
  },

  // http 请求默认配置
  http: {
    timeout: 30000,
    dataType: 'json'
  },

  // 环境链接
  test: {
    h5url: 'http://test.blibao.com:10080/groupbuy/',
    auth: 'http://test.blibao.com/Auth/',
    pay: 'https://dev.blibao.com/SweepPay/',
    openapi: 'http://test.api.blibao.com/ApiService/',
    sweep: 'http://test.blibao.com:5001/',
    member: 'http://test.blibao.com:10080/api/member-user/',
    'sweep-api': 'http://test.api.blibao.com/sweep-api/',

    // 业务根级地址
    url: {
      sweep: 'http://test.blibao.com:10080/smo/',
      // sweep: 'http://172.16.5.2:8081/',
      member: 'http://test.blibao.com:10080/member-h5-vue/',
      groupbuy: 'http://test.blibao.com:10080/groupbuy/',
      reserve: 'http://test.blibao.com:10080/reserve/',
      queue: 'http://test.blibao.com:10080/queue/'
    }
  },
  pre: {
    h5url: 'https://pre-test-api.blibao.com/groupbuy/',
    auth: 'https://pre-test-web.blibao.com/Auth/',   // https://pre-test-api.blibao.com/Auth
    pay: 'https://dev.blibao.com/SweepPay/',
    openapi: 'https://pre-test-api.blibao.com/ApiService/',
    sweep: 'https://pre-test-web.blibao.com/smo-api/',
    member: 'https://pre-test-web.blibao.com/api/member-user/',
    'sweep-api': 'https://pre-test-api.blibao.com/sweep-api/',

    // 业务根级地址
    url: {
      sweep: 'https://pre-test-web.blibao.com/smo/',
      member: 'https://pre-test-web.blibao.com/member-h5-vue/',
      groupbuy: 'https://pre-test-web.blibao.com/groupbuy/',
      reserve: 'https://pre-test-web.blibao.com/reserve/',
      queue: 'https://pre-test-web.blibao.com/queue/'
    }
  },
  release: {
    h5url: 'https://d2.blibao.com/groupbuy/',
    auth: 'https://b2b.blibao.com/Auth/',
    pay: 'https://epay.blibao.com/ApiService/',
    openapi: 'https://openapi.blibao.com/ApiService/',
    // sweep: 'https://d2.blibao.com/smo-api/',
		sweep: 'https://d2.blibao.com/smo/',
    member: 'https://d2.blibao.com/api/member-user/',
    'sweep-api': 'https://smoapi.blibao.com/ApiService/',

    // 业务根级地址
    url: {
      sweep: 'https://d2.blibao.com/',
      member: 'https://h5.blibao.com/member-h5-vue/',
      groupbuy: 'https://d2.blibao.com/groupbuy/',
      reserve: 'https://d2.blibao.com/reserve/',
      queue: 'https://d2.blibao.com/queue/'
    }
  },

  // 自动加载不同平台的相关配置
  ...PlatformConfig
};
