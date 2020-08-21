<!--------------------------------------------------
  name: index.vue
  author: mudas( mschool.tech )
  created: 2020.05.05
---------------------------------------------------->

<template>
  <view class="group-client">
    <!--#ifdef MP-WEIXIN-->
    <web-view :src="webUrl" v-if="!!webUrl" @load="loadHandler"/>
    <!--#endif-->

    <!--#ifdef MP-ALIPAY-->
    <web-view :src="webUrl" v-if="!!webUrl" @message="messageHandler"/>
    <!--#endif-->

  </view>
</template>

<script>
import QS from 'query-string';
import { mapGlobalData } from '@/utils';

export default {
  components: {},

  data() {
    return {
      webUrl: ''
    };
  },

  computed: {
    // 提取 globalData 全局数据
    ...mapGlobalData([
      'app_id',
      'shop_id',
      'store_id',
      'userInfo',
      'channel',
      'table_info_id'
    ])
  },
  onLoad(option) {
    this.openWebView(option);
  },

  created() {
    // 进入直接显示 loading，后续交给 h5 关闭（小程序审核不能空白页过长时间）
    uni.showLoading();
  },

  methods: {

    // #ifdef MP-WEIXIN
    loadHandler() {
      // 微信小程序只能通过 load 事件关闭 loading
      uni.hideLoading();
    },
    // #endif

    messageHandler(e) {
      const { type, value, args } = e.detail.data;
      // console.log('接收到的 message：' + JSON.stringify(e.detail.data));
      if (type === 'ready') uni.hideLoading();
    },

    openWebView(option) {

      console.log(option);

      if (option.url) {
        this.webUrl = decodeURIComponent(option.url);
      }
      else {
        const { app_id, shop_id, store_id, table_info_id, channel, userInfo } = this;
        const {
          avatar,
          gender,
          mobile,
          nickName: nick,
          thirdUserInfoId: thirdUserId,
          unionId: union_id,
          userId: user_id
        } = userInfo;

        const query = {
          app_id,
          shop_id,
          store_id,
          channel,
          source: channel === 'wechat' ? 2 : 1, // 1是支付宝 2是微信
          mini_type: option.mini_type || null,
          avatar: encodeURIComponent(avatar),
          gender,
          nick,
          thirdUserId,
          union_id,
          user_id,
          mobile,
          table_info_id,
          is_auth: 1,
          type: 'industry'
        };

        const urlparam = { ...query, ...option };
        this.webUrl = `${this.$env('url.sweep')}sbrand.html#/?${QS.stringify(urlparam)}`;
        // console.log(this.$env('url.sweep'));
      }

    }
  }
};
</script>

<style lang="scss">
.group-client {
  height: 100vh;
}
</style>
