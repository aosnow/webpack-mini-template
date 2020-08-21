// ------------------------------------------------------------------------------
// name: wechat
// author: mudas( mschool.tech )
// created: 2020/5/7 14:44
// ------------------------------------------------------------------------------

import * as Types from './event';

export default {

  data() {
    return {
      needAuthDialog: false
    };
  },

  created() {
    console.warn('微信授权');
    this.needAuthDialog = this.needAuth;
    this.login();
  },

  methods: {
    // 授权登录（尝试使用银盒子用户数据跳过微信官方授权）
    login() {
      // let this_ = this;
      uni.showLoading({ title: '登录中...', mask: true });

      uni.login({
        success: (res) => {
          if (res.code) {
            this._loginBySliverBox({ appId: this.appId, code: res.code })
                .then(data => {

                  const { unionId } = data.data;

                  uni.hideLoading();

                  // 从未授权过，启动弹框授权（用户主动）
                  if (!unionId) {
                    this.openAuthDialog();
                  }

                  // 已存在授权记录，直接使用，跳过官方授权
                  else {
                    this.applyFinalUserInfo(data.data);
                  }
                })
                .catch(reason => {
                  uni.showToast({ title: reason.message, icon: 'none', mask: true });
                });
          }
          else {
            this._loginFailed(res);
          }
        }
      });
    },

    authLogin() {
      this.checkAuthSetting().then(authed => {
        // A.未授权，直接统一使用 button 授权拿 userinfo
        if (!authed) {
          this.openAuthDialog();
        }

        // B.已授权，直接通过 api.getUserInfo 获取用户信息
        else {
          this.getUserInfo();
        }
      });
    },

    /**
     * 银盒子微信登录服务
     * @param params
     * @private
     */
    _loginBySliverBox(params) {
      return new Promise((resolve, reject) => {
        this.$http.get({
          scope: 'auth',
          url: 'thirdAuth/wxLogin.htm',
          data: { ...params },
          success: ({ data }) => {
            console.log(data, 'datadatadata');
            if (data.code === 10000) {
              resolve(data);
            }
            else {
              reject(new Error(data.msg));
            }
          },
          fail: (err) => {
            console.warn('_loginBySliverBox.fail:', err);
            reject(new Error(err.errMsg));
          }
        });
      });
    },

    // 检测用户是否已经授权
    checkAuthSetting() {
      return new Promise(resolve => {
        uni.getSetting({
          success(res) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            resolve(res.authSetting['scope.userInfo']);
          },
          fail() {
            resolve(false);
          }
        });
      });
    },

    /**
     * 打开或关闭授权对话框
     * @param flag
     */
    openAuthDialog(flag = true) {
      this.needAuthDialog = flag;
    },

    /**
     * 通过 api 获取用户信息
     */
    getUserInfo() {
      uni.getUserInfo({
        success: (authUserInfo) => {
          this.applyUserInfo(authUserInfo);
        }
      });
    },

    /**
     * 开始使用用户信息进行业务步骤前置处理（需要存储到后端服务器）
     * @param authUserInfo
     */
    applyUserInfo(authUserInfo) {
      const { encryptedData, iv } = authUserInfo;
      console.warn('applyUserInfo:', authUserInfo);

      uni.login({
        success: (res) => {
          if (res.code) {
            this._loginBySliverBox({
              appId: this.appId,
              code: res.code,
              encryptedUserData: { encryptedData, iv }
            }).then(data => {
              const { unionId } = data.data;

              // 若无 unionId，代表未绑定“微信开放平台”，无法查询到 unionId
              if (!unionId) {
                uni.showToast({ title: '未绑定微信开放平台，请联系管理员处理', icon: 'none', mask: true });
              }

              // 授权登录成功
              else {
                this.applyFinalUserInfo(data.data);
              }
            }).catch(reason => {
              uni.showToast({ title: reason.message, icon: 'none', mask: true });
            });
          }
          else {
            this._loginFailed(res);
          }
        }
      });
    },

    /**
     * 使用与银盒子服务器数据同步的用户数据正式开始进行业务开展
     * @param userInfo
     */
    applyFinalUserInfo(userInfo) {
      console.log(userInfo, 'userInfo===================');
      uni.showToast({ title: '登录成功', icon: 'success', mask: true, duration: 1000 });
      this.emitDataEvent(Types.USER_INFO, userInfo);
    },

    // --------------------------------------------------------------------------
    //
    // Event handlers
    //
    // --------------------------------------------------------------------------

    refuseUserInfoHandler() {
      this.openAuthDialog(false);
      this._loginFailed();
    },

    getUserInfoHandler(event) {
      const { detail: { errMsg } } = event;

      this.openAuthDialog(false);

      if (/ok/i.test(errMsg)) {
        // 授权成功
        this.applyUserInfo(event.detail);
      }
      else {
        // 拒绝授权
        this._loginFailed(event.detail);
      }
    },

    // 暂不登录或者授权失败
    _loginFailed(detail) {
      // 用户主动拒绝授权不再提示
      if (typeof this.showAuthFailed === 'function' && detail && !/auth deny/i.test(detail.errMsg)) {
        this.showAuthFailed(detail.errMsg);
      }
    }
  }
};
