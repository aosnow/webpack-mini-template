// ------------------------------------------------------------------------------
// name: auth
// author: mudas( mschool.tech )
// created: 2020/12/28 10:18
// ------------------------------------------------------------------------------

import { EventType, ScopeType } from '@/components/auth/types';

export default {
  methods: {

    // --------------------------------------------------------------------------
    //
    // 获取用户信息相关方法
    //
    // --------------------------------------------------------------------------

    getUserData({ scope = ScopeType.USER_INFO }) {
      this.curScope = scope;

      return new Promise((resolve) => {
        switch (scope) {
          case ScopeType.USER_INFO: {
            this.getUserInfo({ appId: this.targetAppid })
                .then(userInfo => resolve(userInfo));
            break;
          }
          case ScopeType.PHONE_NUMBER: {
            this.getPhoneNumber({ appId: this.targetAppid })
                .then(phoneNumber => resolve(phoneNumber));
            break;
          }
        }
      });

    },

    getUserInfo({ appId }) {
      const scope = ScopeType.USER_INFO;

      return new Promise(resolve => {
        this.checkAuthSetting(scope)
            .then(value => {
              if (value) {
                // 若已经授权，则从微信拉取最新信息更新到银盒子服务端，并返回
                uni.getUserInfo({
                  success: (userData) => {
                    this.updateData({ scope, appId, userData })
                        .then(({ success, data }) => {
                          success && resolve(data);
                        });
                  },
                  fail: (reason) => {
                    this._loginFailed(reason);
                  }
                });
              }
              else {
                // 未授权，先尝试从银盒子服务端获取用户信息，若未注册才从界面主动获取用户信息
                this.updateData({ scope, appId })
                    .then(({ success, data }) => {
                      if (success) {
                        resolve(data);
                      }
                      else {
                        this.setScopeState(scope, true);
                      }
                    });
              }

            });
      });
    },

    getPhoneNumber({ appId }) {
      const scope = ScopeType.PHONE_NUMBER;

      return new Promise((resolve) => {
        // 手机号先尝试从银盒子服务端获取，无手机呈则需要每次从界面获取手机号
        this.updateData({ scope, appId })
            .then(({ success, data }) => {
              if (success) {
                const { mobile, phone } = data;

                if (mobile || phone) {
                  resolve(mobile || phone);
                }
                else {
                  resolve(null);
                  this.setScopeState(scope, true);
                }
              }
            });
      });
    },

    updateData({ scope = ScopeType.USER_INFO, appId, userData = null }) {
      const params = { appId };

      // 传入 userData 代表更新信息，否则获取用户历史信息
      if (userData) {
        const { encryptedData, response, iv } = userData;

        // #ifdef MP-ALIPAY
        if (response) {
          const detail = JSON.parse(response).response;
          params.userId = this.userId; //2088422280901499
          params.userInfo = JSON.stringify(detail);
        }
        else {
          params.encryptedData = encryptedData;
        }
        // #endif
        // #ifdef MP-WEIXIN
        params.encryptedUserData = { encryptedData, iv };
        // #endif
      }

      return new Promise((resolve) => {
        this.getAuthCode()
            .then(code => {
              if (!code) {
                resolve({ success: false, reason: 'Failed to get code' });
                return false;
              }

              params.code = code;

              this._loginBySliverBox(params)
                  .then(({ data, code, success }) => {
                    const { unionId, userId } = data;
                    this.userId = userId;

                    if (success || code === 10000) {
                      // #ifdef MP-WEIXIN
                      // 若无 unionId，代表未绑定“微信开放平台”，无法查询到 unionId
                      if (!unionId) {
                        //鲁迅街暂时没绑到第三方
                        // uni.showToast({ title: '未绑定微信开放平台，请联系管理员处理', icon: 'none', mask: true });
                      }
                      // #endif

                      // 授权登录成功
                      this.applyFinalUserInfo({ scope, data });

                      // 返回数据
                      resolve({ success: true, data });
                    }
                    else {
                      resolve({ success: false, reason: '未授权过银盒子平台' });
                      this.setScopeState(scope, true);
                    }

                  })
                  .catch(reason => {
                    uni.showToast({ title: reason.message, icon: 'none', mask: true });
                    resolve({ success: false, reason });
                  });
            })
            .catch(reason => this._loginFailed(reason));
      });
    },

    /**
     * 设置授权域类型的当前状态值（主要用于控制 button 相关界面的显示隐藏）
     * @param scope 授权类型
     * @param state 状态值
     */
    setScopeState(scope = ScopeType.USER_INFO, state = true) {
      this.scope[scope] = state;
    },

    // --------------------------------------------------------------------------
    //
    // 直连服务商（微信）相关方法
    //
    // --------------------------------------------------------------------------
    // 登录验证（获取 code）
    getAuthCode() {
      return new Promise((resolve, reject) => {
        uni.login({
          success: (res) => {
            if (res.code) {
              resolve(res.code);
            }
            else {
              resolve(null);
              reject(res);
            }
          },
          fail: (reason) => {
            resolve(null);
            reject(reason);
          }
        });
      });
    },

    /**
     * 检测用户是否已经授权指定权限
     * <p>参考：https://uniapp.dcloud.io/api/other/authorize scope 列表</p>
     * @param {String} scode 授权目标
     * @return {Promise<Boolean>}
     */
    checkAuthSetting(scode = ScopeType.USER_INFO) {
      return new Promise(resolve => {
        uni.getSetting({
          success(res) {
            resolve(res.authSetting[scode]);
          },
          fail() {
            resolve(false);
          }
        });
      });
    },

    // --------------------------------------------------------------------------
    //
    // 直连自有平台（银盒子）相关方法
    //
    // --------------------------------------------------------------------------

    /**
     * 银盒子登录服务
     * @param params
     * @private
     */
    _loginBySliverBox(params) {
      return this.$http.auth.get(this['authApi'], { ...params })
                 .then(({ data }) => {
                   if (data.code === 10000) {
                     return Promise.resolve(data);
                   }
                   else {
                     return Promise.reject(new Error(data.msg));
                   }
                 })
                 .catch((reason) => {
                   return Promise.reject(new Error(reason.errMsg));
                 });
    },

    /**
     * 使用与银盒子服务器数据同步的用户数据正式开始进行业务开展
     * @param userInfo
     */
    applyFinalUserInfo({ scope, data }) {
      // 页面类型(this.mpType='page')不支持 $emit 事件功能，只有将 auth 封装成组件此处才会生效
      // 组件的封装参考 AuthDialog.vue
      if (this.$scope.triggerEvent) {
        this.$emit(EventType[scope], data);
      }
    },

    _authCompleted({ scope, appId, detail }) {
      this.updateData({ scope, appId, userData: detail })
          .then(({ success, data }) => {
            if (typeof this.authCompleted === 'function' && success) {
              if (scope === ScopeType.USER_INFO) {
                this.authCompleted({ scope, detail: data });
              }
              else if (scope === ScopeType.PHONE_NUMBER) {
                const { mobile, phone } = data;
                this.authCompleted({ scope, detail: mobile || phone });
              }
            }
          });
    },

    // --------------------------------------------------------------------------
    //
    // Event handlers
    //
    // --------------------------------------------------------------------------

    // 用户点击按钮拒绝授权
    refuseUserInfoHandler() {
      this.setScopeState({ scope: this.curScope, state: false });
      this._loginFailed();
    },

    // 暂不登录或者授权失败
    _loginFailed(detail) {
      if (process.env.NODE_ENV === 'development') console.warn('failed:', detail);

      // 用户主动拒绝授权不再提示
      if (typeof this.authFailed === 'function' && detail && /auth deny/i.test(detail.errMsg)) {
        this.authFailed({ scope: this.curScope, detail });
      }
    }
  }
};
