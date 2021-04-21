// ------------------------------------------------------------------------------
// name: alipay
// author: mudas( mschool.tech )
// created: 2020/5/7 14:44
// ------------------------------------------------------------------------------

import mixAuthCommon from './auth';
import { ScopeType } from './types';

export default {

  mixins: [mixAuthCommon],

  data() {
    return {
      // 支付宝无法通过 userInfo 获取 userId，需要在服务器端调用 alipay.system.oauth.token 获取
      // 故需要先调用一次 initUserId 来获取 userId，再进行与 wechat 同样的授权流程
      userId: null,

      // 银盒子授权接口
      authApi: 'thirdAuth/alipayLogin.htm',

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

    // --------------------------------------------------------------------------
    //
    // Event handlers
    //
    // --------------------------------------------------------------------------

    // 主动授权
    getUserInfoHandler(event) {
      this.curScope = ScopeType.USER_INFO;

      my.getOpenUserInfo({
        success: (res) => {
          const detail = JSON.parse(res.response).response;

          if (parseInt(detail.code, 10) === 10000) {
            // 授权成功
            this.dataHandler({ scope: this.curScope, appId: this.targetAppid, detail: res });
          }
          else {
            // 拒绝授权
            this._loginFailed(detail);
          }
        },
        fail: (reason) => {
          this._loginFailed(reason);
        }
      });
    },

    getPhoneNumberHandler(event) {
      this.curScope = ScopeType.PHONE_NUMBER;

      my.getPhoneNumber({
        success: (res) => {
          const encryptedData = res.response;
          this.dataHandler({ scope: this.curScope, appId: this.targetAppid, detail: { encryptedData } });
        },
        fail: (reason) => {
          this._loginFailed(reason);
        }
      });
    },

    dataHandler({ scope, appId, detail }) {
      this.setScopeState(scope, false);
      this._authCompleted({ scope, appId, detail });
    }
  }
};
