// ------------------------------------------------------------------------------
// name: env
// author: mudas( mschool.tech )
// created: 2020/3/30 16:50
// ------------------------------------------------------------------------------

import EasyStore, { namespace } from '@mudas/store';
import * as Types from '@/store/types';
import AppConfig from '@/config';

const ENV_CONFIG = namespace(Types.ENV_CONFIG);
const ENV_PARAMS = namespace(Types.ENV_PARAMS);
const ENV_SYSTEM = namespace(Types.ENV_SYSTEM);

const ENV_RESET = namespace(Types.ENV_RESET);

const Config = [
  {
    type: ENV_CONFIG,
    increment: true,
    state: {
      // 应用名称（目前仅作显示用途）
      appName: 'sweep',

      // 根据不同的业务导向自定义（银盒子小程序根据菜单手动指定）
      // 其它业务级小程序固定（如会员小程序则固定为'member'），目前暂不开发业务级小程序，全部通过 sliverbox.mini 进行导向
      miniType: 'sweep',
      imgPath: '', // 全局图片绝对地址

      shopId: 1000000,
      storeId: '', //1000001
      tableInfoId: '',
      guid: '', // 通用码 guid 值
      scene: '', // 小程序打开时的来源渠道类型

      // 自动加载不同平台的相关配置
      ...AppConfig
    }
  },

  {
    type: ENV_RESET,
    state: false,
    action(context) {
      // 环境参数
      context.commit(ENV_CONFIG, { guid: '', shopId: '', storeId: '', tableInfoId: '', scene: '' });

      // 用户信息
      // 同一终端用户信息无需重置
    }
  },

  {
    type: ENV_PARAMS,
    increment: true,
    state: {
      // 小程序打开时的 query 参数集合
    }
  },

  {
    type: ENV_SYSTEM,
    increment: true,

    // 用户本机系统信息
    // uni.getSystemInfo(OBJECT) 获取
    state: {
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
    }
  }
];

export default new EasyStore(Config).output();
