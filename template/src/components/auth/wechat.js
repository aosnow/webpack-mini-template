// ------------------------------------------------------------------------------
// name: wechat
// author: mudas( mschool.tech )
// created: 2020/5/7 14:44
// ------------------------------------------------------------------------------

import mixAuthCommon from './auth';
import { ScopeType } from './types';

/*
  说明：
    不论是通过按钮授权还是从银盒子后端拉取用户数据，都会派发相应的 sope 数据事件
    当从按钮授权时，还同时会验证当前混合环境是否具备 authCompleted 回调函数，是则将数据应用到该回调方法
    当授权或请求发生相关的问题或者失败时，会验证当前环境 authFailed 回调函数，并输出错误信息

    uni.getUserInfo 拒绝授权：
    微信从uni.getUserInfo的fail回调返回
    支付宝从 button 的 @error 事件返回
 */

export default {

  mixins: [mixAuthCommon],

  data() {
    return {
      // 银盒子授权接口
      authApi: 'thirdAuth/wxLogin.htm',

      // 当前授权对应的 appId
      authAppId: null,

      // 当前进行的授权类型
      curScope: null,

      // 仅做本地授权界面显示状态（与小程序授权结果无关）
      // 未授权时需要设置为 true 提供用户操作入口，通过 api 方式授权已经全被废弃不必考虑，全部采用 button 由用户主动操作授权
      // open-type 有效值 https://uniapp.dcloud.io/component/button?id=button
      scope: {
        [ScopeType.USER_INFO]: false, // 是否打开自定义界面（包含 getUserInfo button），获取用户授权
        [ScopeType.PHONE_NUMBER]: false // 是否打开自定义界面（包含 getPhoneNumber button），获取用户授权
      }
    };
  },

  methods: {

    // 统一与支付宝相同的流程
    initAuth() {
      return Promise.resolve({ success: true });
    },

    // 微信通过按钮获取手机号

    // --------------------------------------------------------------------------
    //
    // Event handlers
    // 请提前预置好 this.authAppId
    //
    // --------------------------------------------------------------------------

    // 同意授权获取用户信息
    getUserInfoHandler(event) {
      /*
      event.detail 示例：
      {
        encryptedData: "USLpV5d4p8epOZTCQw245dmgIdOX7d7AyiJUP37z6btuaz/kiv7RALJYiUtEr/Dd8ImfjZ+rpxr7N3wk0tkPt9+jOq+UubEUKm4N0GtEzCb5Hx8OkxSz7qNAQZYoaUNNH2kFKnec5OVXwagghS6Dvn7ME/u7EJOLhADBG2m4U8/sSBvjxoSut8ssw4a14Iw/ARtij4Rtt4h9gP1Fvqr+DU0JLihCedYrfBZXyf2mbnNdfL2g7DKwqfvYzkYt/ckI0YIYMw/ARG1EMOfIuyjBLTpqrZs57XkLyYXnGoApf7HB2jFWyegjXvOb/2i6K/pBr97KuUEiYyCy4F44jYypb3JPM8HUYHYhl15VIHRTBJadY5Ak9dHESie1APNRlrWbm6KPrWxKAzRgwf7ioTHoNS1tNQuRVFHf9+0s8MyJbYFlyUYOVES7T3q9fdNS7N6Cs2jgdiDrAuBj2g98axj76JAUhlHXK9IvGbXswOgpFPMkdBYDRs6S1ahMhuHfvQtRrjUXD8v4JQJXIgKTSSHUY+Iq3Fl0ME5RRuTMSFzBom0="
        errMsg: "getUserInfo:ok"
        iv: "d1w80W0wuoqYOOjzUlx0tA=="
        rawData: "{"nickName":"喵大斯","gender":1,"language":"zh_CN","city":"Hangzhou","province":"Zhejiang","country":"China","avatarUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKs0IBdr1XpDccYTcd57KDD49vpdclTnI0Dcy2oibjHiaTpgP3icNjBS7UlibtfFala7icCiaN3UaoLCVPA/132"}"
        signature: "3f46b690266f06c5fc9e0208bd8eca64abf1524d"
        userInfo: {
          avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKs0IBdr1XpDccYTcd57KDD49vpdclTnI0Dcy2oibjHiaTpgP3icNjBS7UlibtfFala7icCiaN3UaoLCVPA/132"
          city: "Hangzhou"
          country: "China"
          gender: 1
          language: "zh_CN"
          nickName: "喵大斯"
          province: "Zhejiang"
        }
       }
       */

      this.curScope = ScopeType.USER_INFO;
      this.dataHandler({ scope: this.curScope, appId: this.authAppId, detail: event.detail });
    },

    getPhoneNumberHandler(event) {
      this.curScope = ScopeType.PHONE_NUMBER;
      this.dataHandler({ scope: this.curScope, appId: this.authAppId, detail: event.detail });
    },

    dataHandler({ scope, appId, detail }) {
      const success = /ok/i.test(detail.errMsg);

      this.setScopeState(scope, false);

      if (success) {
        this._authCompleted({ scope, appId, detail });
      }
      else {
        this._loginFailed(detail);
      }
    }

  }
};
