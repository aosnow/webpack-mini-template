<!--------------------------------------------------
  name: AuthDialog.vue
  author: mudas( mschool.tech )
  created: 2020/5/7
---------------------------------------------------->

<template>
  <view v-show="isShowAuth" class="auth-dialog">
    <view class="auth-dialog__mask"/>
    <view class="auth-dialog__body">
      <view class="auth-dialog__body--title">需要您的授权</view>

      <view class="auth-dialog__body--content">
        <!--#ifdef MP-WEIXIN-->
        <view class='desc'>为了提供更好的服务<br>请在稍后的提示框中点击“允许”</view>
        <image class="image" mode="aspectFit" src="~@/static/auth-wechat.png"/>
        <!--#endif-->

        <!--#ifdef MP-ALIPAY-->
        <view class='desc'>为了提供更好的服务<br>请在稍后的提示框中点击“同意”</view>
        <image class="image" mode="aspectFit" src="~@/static/auth-alipay.png"/>
        <!--#endif-->
      </view>

      <view class="auth-dialog__body--foot">
        <button class="btn-cancel" open-type="refuseUserInfo" @tap="refuseUserInfoHandler">暂不登录</button>

        <!--#ifdef MP-WEIXIN-->
        <!--参考：https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html-->
        <button class="btn-confirm" open-type="getUserInfo" type="primary" @getuserinfo="getUserInfoHandler">我知道了</button>
        <!--<button class="btn-confirm" type="primary" open-type="getPhoneNumber"-->
        <!--        @getphonenumber="getPhoneNumberHandler"-->
        <!--        @click="clickPhoneHandler"-->
        <!--        @error="errorHandler">微信手机号-->
        <!--</button>-->
        <!--#endif-->

        <!--#ifdef MP-ALIPAY-->
        <!--参考：https://opendocs.alipay.com/mini/api/ch8chh-->
        <button class="btn-confirm" open-type="getAuthorize" scope='userInfo' type="primary" @getAuthorize="getUserInfoHandler">
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
import AuthMixin from './index';
import { ScopeType } from './types';

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
    // 需要授权操作的目标 appid
    targetAppid: String
  },

  created() {
    if (this.targetAppid) this.requestData();
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
    z-index: $uni-index-popper;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: $uni-bg-color-mask;
  }

  .auth-dialog__body {
    position: absolute;
    z-index: $uni-index-popper + 1;
    top: 50%;
    left: 50%;
    /*height: 80vh;*/
    width: 85vw;
    transform: translate(-50%, -50%);
    border-radius: 10rem;
    background: rgba(255, 255, 255, 1);

    .auth-dialog__body--title {
      color: $uni-text-color;
      font-size: 36rem;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 120rem;
      border-bottom: 1px solid #dddddd;
    }

    .auth-dialog__body--content {
      display: flex;
      align-items: center;
      flex-direction: column;
      padding: 20rem 20rem 0 20rem;

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
      display: flex;
      justify-content: space-around;
      padding: 30rem 30rem 60rem 30rem;

      %button {
        flex: 0 0 45%;

        &::after {
          border: none !important;
        }
      }

      .btn-cancel, .btn-confirm {
        @extend %button;
        color: #000000;
        text-align: center;
        background: none;
      }
    }
  }
}
</style>
