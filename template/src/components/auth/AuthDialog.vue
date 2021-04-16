<!--------------------------------------------------
  name: AuthDialog.vue
  author: mudas( mschool.tech )
  created: 2020/5/7
---------------------------------------------------->

<template>
  <view class="auth-dialog" v-show="isShowAuth">
    <view class="auth-dialog__mask"/>
    <view class="auth-dialog__body">
      <view class="auth-dialog__body--title">需要您的授权</view>

      <view class="auth-dialog__body--content">
        <!--#ifdef MP-WEIXIN-->
        <view class='desc'>为了提供更好的服务<br>请在稍后的提示框中点击“允许”</view>
        <image class="image" src="~@/static/auth-wechat.png" mode="aspectFit"/>
        <!--#endif-->

        <!--#ifdef MP-ALIPAY-->
        <view class='desc'>为了提供更好的服务<br>请在稍后的提示框中点击“同意”</view>
        <image class="image" src="~@/static/auth-alipay.png" mode="aspectFit"/>
        <!--#endif-->
      </view>

      <view class="auth-dialog__body--foot">
        <button class="btn-cancel" open-type="refuseUserInfo" @tap="refuseUserInfoHandler">暂不登录</button>

        <!--#ifdef MP-WEIXIN-->
        <!--参考：https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html-->
        <button class="btn-confirm" type="primary" open-type="getUserInfo" @getuserinfo="getUserInfoHandler">我知道了</button>
        <!--<button class="btn-confirm" type="primary" open-type="getPhoneNumber"-->
        <!--        @getphonenumber="getPhoneNumberHandler"-->
        <!--        @click="clickPhoneHandler"-->
        <!--        @error="errorHandler">微信手机号-->
        <!--</button>-->
        <!--#endif-->

        <!--#ifdef MP-ALIPAY-->
        <!--参考：https://opendocs.alipay.com/mini/api/ch8chh-->
        <button class="btn-confirm" type="primary" open-type="getAuthorize" scope='userInfo' @getAuthorize="getUserInfoHandler">
          我知道了
        </button>
        <!--<button class="btn-confirm" type="primary"-->
        <!--        open-type="getAuthorize"-->
        <!--        scope='phoneNumber'-->
        <!--        @getAuthorize="getPhoneNumberHandler"-->
        <!--        @click="clickUserHandler"-->
        <!--        @error="errorHandler">支付宝手机号-->
        <!--</button>-->
        <!--#endif-->
      </view>
    </view>
  </view>
</template>

<script>
import { ScopeType } from './types';
import AuthMixin from './index';

// 微信支持 login+getUserInfo，且同样支持 button 授权触发
// https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html

// 支付宝不支持直接 API 授权（需要button触发）后 getOpenUserInfo
// https://opendocs.alipay.com/mini/api/ch8chh

// 因此统一使用按钮方式进行授权
// 任何页面，相应的 `授权按钮+AuthMixin` 即可以实现自定义授权

export default {
  name: 'auth-dialog',
  mixins: [AuthMixin],

  props: {
    // 小程序 appid
    appId: String,

    // 是否将数据同步至银盒子服务器
    sync: {
      type: Boolean,
      default: true
    }
  },

  created() {
    this.authAppId = this.appId;
    this.requestData();
  },

  computed: {
    // 是否显示授权界面
    isShowAuth() {
      return this.scope[ScopeType.USER_INFO];
    }
  },

  methods: {

    requestData() {
      this.getUserData({ scope: ScopeType.USER_INFO });
    },

    authFailed({ scope, detail }) {
      // 授权失败或者被拒绝关闭 loading
      uni.hideLoading();

      uni.showModal({
        title: '授权失败',
        content: '获取用户信息失败，是否重试',
        success: ({ confirm }) => {
          if (confirm) this.requestData();
        }
      });
    },

    authCompleted({ scope, detail }) {
      uni.hideLoading();
      console.warn('authCompleted:', scope, detail);
    },

    clickUserHandler() {
      uni.showLoading({ title: '获取用户信息', mask: true });
    }
  }
};
</script>

<style lang="scss">

.auth-dialog {

  .auth-dialog__mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: $uni-bg-color-mask;
    z-index: $uni-index-popper;
  }

  .auth-dialog__body {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 85vw;
    /*height: 80vh;*/
    background: rgba(255, 255, 255, 1);
    transform: translate(-50%, -50%);
    border-radius: 10rem;
    z-index: $uni-index-popper + 1;

    .auth-dialog__body--title {
      color: $uni-text-color;
      height: 120rem;
      font-size: 36rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #dddddd;
    }

    .auth-dialog__body--content {
      padding: 20rem 20rem 0 20rem;
      display: flex;
      align-items: center;
      flex-direction: column;

      .desc {
        color: $uni-text-color-grey;
        font-size: 28rem;
        line-height: 40rem;
        padding: 30rem;
      }

      .image {
        width: 418rem;
        height: 363rem;
      }
    }

    .auth-dialog__body--foot {
      padding: 30rem 30rem 60rem 30rem;
      display: flex;
      justify-content: space-around;

      %button {
        flex: 0 0 45%;

        &::after {
          border: none !important;
        }
      }

      .btn-cancel, .btn-confirm {
        @extend %button;
        background: none;
        color: #000000;
        text-align: center;
      }
    }
  }
}
</style>
