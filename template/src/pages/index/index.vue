<!--------------------------------------------------
  name: index2.vue
  author: mudas( mschool.tech )
  created: 2021/4/19
---------------------------------------------------->

<template>
  <view class="home-index">
    <auth-dialog :target-appid="appId" @user-info="userInfoHandler"/>

    <view class="home-index__body">
      <text>银盒子支付宝、微信双端小程序模板</text>

      <image :src="userInfo.avatar" class="home-index__body-head"/>
      <view class="home-index__body-nickname">
        <!--#ifdef MP-ALIPAY-->
        <s-icon color="rgba(50,150,250)" size="60" name="alipay" dot/>
        <s-icon color="rgba(50,150,250)" size="60" name="alipay"/>
        <!--#endif-->
        <!--#ifdef MP-WEIXIN-->
        <s-icon color="rgba(0,178,106)" size="60" name="wechat" dot/>
        <s-icon color="rgba(0,178,106)" size="60" name="wechat"/>
        <!--#endif-->

        <s-badge dot color="red" content="5">
          <text v-text="userInfo.nickName"/>
        </s-badge>
      </view>

      <image class="home-index__body-copy" src="~@/static/copyright.png"/>
    </view>
  </view>
</template>

<script>

// 参考：https://uniapp.dcloud.io/collocation/frame/lifecycle?id=%E9%A1%B5%E9%9D%A2%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F
export default {
  data() {
    return {};
  },

  onLoad(option) {
    // 首页面需要监听完成初始化业务
    if (this.ready) {
      console.warn('小程序已经启动完成，可开始进行初始业务');
    }
    else {
      uni.$on('ready', data => {
        console.warn('小程序启动完成（异步），可开始进行初始业务');
      });
    }
  },

  methods: {
    // 跳转 webview:h5 页面
    nivigatorWebview() {
      uni.navigateTo({ url: `/pages/client/index` });
    },

    // 用户授权数据获取成功
    userInfoHandler(userInfo) {
      this.setUserinfo(userInfo);
    }

  }
};
</script>

<style lang="scss">
@import "~@/css/var.scss";

.home-index {
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;

  &__body {
    font-size: 32rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    padding-top: 200rem;

    &-head {
      width: 180rem;
      height: 180rem;
      margin: 100rem 100rem 20rem;
      border: 10rem solid $--color-white;
      border-radius: 180rem;
    }

    &-nickname {
      display: flex;
      align-items: center;
    }

    &-copy {
      position: absolute;
      bottom: 50rem;
      width: 300rem;
      height: 40rem;
      background-size: contain;
    }
  }
}
</style>
