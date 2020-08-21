// ------------------------------------------------------------------------------
// name: alipay
// author: mudas( mschool.tech )
// created: 2020/5/7 14:44
// ------------------------------------------------------------------------------
import * as Types from './event';

export default {

  data() {
    return {
      needAuthDialog: false,
			userId: ''

    };
  },

  created() {
    console.warn('支付宝授权');
    this.needAuthDialog = this.needAuth;
    this.login();
  },

  methods: {
    // 授权登录
    login() {
      // 统一使用 button 授权拿 userinfo
      uni.showLoading({ title: '登录中...', mask: true });

      uni.login({
        provider: 'alipay',
        success: (res) => {
          if (res.code) {

            this._loginBySliverBox({ appId: this.appId, code: res.code })
                .then(data => {

                  const { avatar } = data.data;
                  this.userId = data.data.userId;

                  uni.hideLoading();

                  // 从未授权过，启动弹框授权（用户主动）
                  if (!avatar) {
                    this.openAuthDialog();
                  }

                  // 已存在授权记录，直接使用，跳过官方授权
                  else {
                    this.applyFinalUserInfo(data.data);
                  }
                })
                .catch(reason => {
                  uni.hideLoading();
                  uni.showToast({ title: reason.message, icon: 'none' });
                });
          }
          else {
            this._loginFailed(res);
          }
        }
      });
    },

    /**
     * 银盒子支付宝登录服务
     * @param params
     * @private
     */
    _loginBySliverBox(params) {
      return new Promise((resolve, reject) => {
        this.$http.get({
          scope: 'auth',
          url: 'thirdAuth/alipayLogin.htm',
          data: { ...params },
          success: ({ data }) => {
						console.log(data, "静默授权============");
            if (data.code === 10000) {
              resolve(data);
            }
            else {
              reject(new Error(data.msg));
            }
          },
          fail: (err) => {

            reject(new Error(err.errMsg));
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
     * 开始使用用户信息进行业务步骤前置处理（需要存储到后端服务器）
     * @param authUserInfo
     */
    applyUserInfo(authUserInfo) {
    	let this_ = this;

      uni.login({
        provider: 'alipay',
        success: (res) => {
          let dataparams = '';
          if (res.code) {
            if (authUserInfo.avatar) {
              dataparams = {
                userId: this_.userId, //2088422280901499
                userInfo: JSON.stringify(authUserInfo)
              };
            }
            else {
              dataparams = {
                appId: this.appId,
                code: res.code
              };
            }

            this._loginBySliverBox({
              ...dataparams
            }).then(data => {

              this.applyFinalUserInfo(data.data);

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
      uni.showToast({ title: '登录成功', icon: 'success' });
      this.emitDataEvent(Types.USER_INFO, userInfo);
    },

    refuseUserInfoHandler() {
      this.openAuthDialog(false);
      this._loginFailed();
    },

    // 主动授权
    getAuthorizeHandler(event) {

      this.openAuthDialog(false);

      my.getOpenUserInfo({
        success: (res) => {
          let detail = JSON.parse(res.response).response;
          if (/Success/i.test(detail.msg)) {
            // 授权成功
            this.applyUserInfo(detail);
          }
          else {
            // 拒绝授权
            this._loginFailed(detail);
          }
        }
      });
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
