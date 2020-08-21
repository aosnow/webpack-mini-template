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
  imgPath: '', // 全局图片绝对地址

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
    h5url: '',
    auth: '',
    pay: '',
    openapi: '',
    sweep: '',
    member: '',
    'sweep-api': '',

    // 业务根级地址
    url: {
      member: ''
    }
  },
  pre: {
    h5url: '',
    auth: '',   // https://pre-test-api.blibao.com/Auth
    pay: '',
    openapi: '',
    sweep: '',
    member: '',
    'sweep-api': '',

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
    'sweep-api': '',

    // 业务根级地址
    url: {
      member: ''
    }
  },

  // 自动加载不同平台的相关配置
  ...PlatformConfig
};
