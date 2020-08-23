<template>
  <view class="home-index">
    <auth-dialog :need-auth="needAuth" :app-id="app_id" @user-info="userInfoHandler"/>

    <view class="home-index__copyright">
      <text>银盒子支付宝、微信双端小程序模板</text>
      <image src="~@/static/copyright.png"/>
    </view>
  </view>
</template>

<script>
import { mapGlobalData, setGlobalData } from '@/utils';
import AuthDialog from '@/components/auth/AuthDialog';

export default {
  components: { AuthDialog },

  data() {
    return {
      showMobile: false,
      needAuth: false
    };
  },

  computed: {
    // 提取 globalData 全局数据
    ...mapGlobalData([
      'app_id',
      'table_info_id',
      'userInfo'
    ])
  },

  onLoad(option) {
    if (this.$var('ready')) {
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

      setGlobalData({ userInfo });
    }

  }
};
</script>

<style lang="scss">
.home-index {
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;

  &__copyright {
    font-size: 32rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 200rem;

    image {
      //width: 486rem;
      //height: 64rem;
      width: 300rem;
      height: 40rem;
      background-size: contain;
      position: absolute;
      bottom: 50rem;
    }

  }

}
</style>
