<!--------------------------------------------------
  name: WebViewClient.vue
  author: mudas( mschool.tech )
  created: 2020/11/16
---------------------------------------------------->

<template>
  <view class="web-view-client">
    <view class="web-view-client__loading">{{loading}}</view>
    <!--#ifdef MP-WEIXIN-->
    <web-view :src="url" v-if="!!url" @load="loadHandler"/>
    <!--#endif-->

    <!--#ifdef MP-ALIPAY-->
    <web-view :src="url" v-if="!!url" @message="messageHandler"/>
    <!--#endif-->
  </view>
</template>

<script>
// beforeUpdate、updated 只有H5支持，小程序不支持
// 参考：https://uniapp.dcloud.io/collocation/frame/lifecycle?id=%E7%BB%84%E4%BB%B6%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F
export default {
  name: 'web-view-client',

  props: {
    // 要打开的 webview  地址
    url: {
      type: String,
      default: 'https://www.baidu.com'
    },

    // 打开地址之前的提示信息
    loading: {
      type: String,
      default: 'Loading...'
    }
  },

  // 在实例初始化之后被调用
  beforeCreate() {
    // 进入直接显示 loading，后续交给 h5 关闭（小程序审核不能空白页过长时间）
    // uni.showLoading();
  },

  methods: {
    // #ifdef MP-WEIXIN
    loadHandler() {
      // 微信小程序只能通过 load 事件关闭 loading
      uni.hideLoading();
    },
    // #endif

    // #ifdef MP-ALIPAY
    messageHandler(e) {
      const { type, value, args } = e.detail.data;
      console.log('接收到的 message：' + JSON.stringify(e.detail.data));
      if (type === 'ready') uni.hideLoading();

      // 派发全局消息事件，一般利用 $once 来一次性监听处理
      uni.$emit('message', e.detail);
    }
    // #endif
  }
};
</script>

<style lang="scss">
@import "~@/css/var.scss";

.web-view-client {
  position: relative;

  &__loading {
    color: $--color-primary;
    font-size: 28rem;
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
