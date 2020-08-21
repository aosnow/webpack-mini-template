<template>
  <view class="group-index" >
    <!-- #ifdef MP-WEIXIN -->
    <official-account></official-account>
    <!-- #endif -->

    <view class="group-index__bg" style="background:url('http://img.blibao.com/upload/1000001/xcx/2020060517243876439-bannerbg.jpg');background-size: 100% 580rpx;background-repeat: no-repeat;">
      <auth-dialog :needAuthDialog="needAuth" :app-id="app_id" @user-info="userInfoHandler"/>

      <!--广告-->
      <view class="group-index__banner">
        <swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" duration="duration">
          <block v-for="(item,index) in bannerlist" :key="index">
            <swiper-item @click="toAdPage(item)">
              <image class="swiper-item" :src="item.imageUrl"></image>
            </swiper-item>
          </block>
        </swiper>
      </view>

      <!--菜单-->
      <view class="group-index__menu">
        <block v-for="(item,index) in menulist" :key="item.name">
          <view class="group-index__menu--item" @click="toOtherApp(item)">
            <view>
              <image class="menu-icon" :src="item.icon"></image>
              <p class="menu-text">{{item.name}}</p>
            </view>
          </view>
        </block>
      </view>

      <!--广告底图-->
      <view class="group-index__bannerbot">
        <image src="~@/static/bannerbot.jpg" @click="opensbrand"></image>
      </view>

    </view>
  </view>
</template>

<script>

import QS from 'query-string';
import { mapGlobalData, setGlobalData } from '@/utils';
import AuthDialog from '@/components/auth/AuthDialog';

import MenuIcon01 from '@/static/menu_01.png';
import MenuIcon02 from '@/static/menu_02.png';
import MenuIcon03 from '@/static/menu_03.png';
import MenuIcon04 from '@/static/menu_04.png';
import MenuIcon05 from '@/static/menu_05.png';
import MenuIcon06 from '@/static/menu_06.png';

export default {
  components: { AuthDialog },

  data() {
    return {
      indicatorDots: false,
      autoplay: true,
      interval: 5000,
      duration: 500,
      bannerlist: [],
      menulist: [
        { icon: MenuIcon01, name: '点餐', type: 'sweep', md: 1 },
        { icon: MenuIcon02, name: '会员', type: 'member' },
        { icon: MenuIcon03, name: '团购', type: 'groupbuy' },
        { icon: MenuIcon04, name: '外卖', type: 'sweep', md: 4 },
        { icon: MenuIcon05, name: '预定', type: 'reserve' },
        { icon: MenuIcon06, name: '排队', type: 'queue' }
      ],
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

    let this_ = this;

    if (this.$var('ready')) {
      this_.getshopIdId(this.app_id).then(function(data) {
        this_.getBannerList(data);
      });
    }
    else {
      uni.$on('ready', data => {
        this_.getshopIdId(this.app_id).then(function(data) {
          this_.getBannerList(data);
        });
      });
    }
  },

  methods: {
		// 底部按钮跳转
		opensbrand() {

			// #ifdef MP-ALIPAY
			if (!this.userInfo.avatar) {
				this.needAuth = true;
				return;
			}
			// #endif
			// #ifdef MP-WEIXIN
			if (!this.userInfo.unionId || !this.userInfo.avatar) {
				this.needAuth = true;
				return;
			}
			// #endif

			const query = {
				mini_type: 'sweep',
				md: 4,
				eom: 1
			};

			const content = { content: JSON.stringify(query) };
			uni.navigateTo({ url: `/pages/client/index?${QS.stringify(content)}` });
		},
    userInfoHandler(userInfo) {
      // 更新全局数据
      setGlobalData({ userInfo });
    },

    // 手机号授权
    decryptPhoneNumber(e) {
      let this_ = this;
      if (e.detail.encryptedData) {
        uni.login({
          success: (res) => {
            this.$http.get({
              scope: 'auth',
              url: 'thirdAuth/wxLogin.htm',
              data: {
                appId: this_.app_id,
                code: res.code,
                encryptedUserData: {
                  encryptedData: e.detail.encryptedData,
                  iv: e.detail.iv
                }
              },
              success: ({ data }) => {
                if (data && data.success) {
                  let userInfo = data.data();
                  setGlobalData({ userInfo });
                }
              },
              fail: (err) => {
                console.warn('_loginBySliverBox.fail:', err);
              }
            });
          }
        });
      }
    },

    // 轮播图跳转
    toAdPage(item) {
      if (item && item.redirectType === 1 && item.redirectUrl) {
        const query = { url: encodeURIComponent(item.redirectUrl) };
        const content = { content: JSON.stringify(query) };
        uni.navigateTo({ url: `/pages/client/index?${QS.stringify(content)}` });
      }
    },

    // 跳转其他app
    toOtherApp(item) {

      // #ifdef MP-ALIPAY
      if (!this.userInfo.avatar) {
        this.needAuth = true;
        return;
      }
      // #endif
      // #ifdef MP-WEIXIN
      if (!this.userInfo.unionId || !this.userInfo.avatar) {
        this.needAuth = true;
        return;
      }
      // #endif

      const query = {
        mini_type: item.type
      };

      if (item.md) query.md = item.md;

      const content = { content: JSON.stringify(query) };

      uni.navigateTo({ url: `/pages/client/index?${QS.stringify(content)}` });
    },

    // 轮播图
    getshopIdId(appId) {
      return new Promise((resolve, reject) => {
        this.$http.get({
          url: 'miniApp/getMiniConfigByAppId.htm',
          data: { appId },
          success: ({ data }) => {
            console.log(data, 'datadatadatadata');
            if (data.code === 10000) {
              resolve(data);
            }
            else {
              reject(new Error(data.msg));
            }
          },
          fail: (reason) => {
            console.log('App Show', reason);
            reject(new Error(reason.errMsg));
          }
        });
      });
    },
    getBannerList(params) {
      let this_ = this;
      return new Promise((resolve, reject) => {
        this.$http.get({
          url: 'miniApp/findMiniBannerCarouselImagesList.htm',
          data: {
            'shopId': params.data.shopId
          },
          success: ({ data }) => {
            if (data.code === 10000) {
              this_.bannerlist = data.data;
              if (data.data.length > 1) {
                this.indicatorDots = true;
              }
            }
            else {
              reject(new Error(data.msg));
            }
          },
          fail: (reason) => {
            reject(new Error(reason.errMsg));
          }
        });
      });
    }
  }
};
</script>

<style lang="scss">

%flexblockcenter {
  display: flex;
  justify-content: center;
  align-items: center;
}

%flexblockbetween {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.group-index {
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;

  .group-index__bg {

    .group-index__banner {
      padding: 25rem 35rem 35rem;

      .swiper {
        height: 450rem;
        border-radius: 25rem;
        overflow: hidden;

        .swiper-item {
          width: 100%;
        }
      }
    }

    .group-index__menu {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      margin: 0 40rem;

      .group-index__menu--item {
        width: calc((100% - 58rem) / 3);
        height: 190rem;
        background: #ffffff;
        box-shadow: 0 0 20px 0 rgba(191, 191, 191, 0.15);
        border-radius: 18rem;
        margin-bottom: 29rem;
        @extend %flexblockcenter;
        position: relative;

        .item-getphone {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0.01;
        }

        &:nth-child(3n+2) {
          margin-left: 29rem;
          margin-right: 29rem;
        }

        .menu-icon {
          width: 60rem;
          height: 60rem;
        }

        .menu-text {
          font-size: 32rem;
          color: #353535;
          font-weight: bold;
          margin-top: 17rem;
        }
      }
    }

    .group-index__bannerbot {
      border: 1rem solid #dedede;
      border-radius: 18rem;
      margin: 7rem 60rem;
      overflow: hidden;
      height: 120rem;
      margin-bottom: 30rem;

      & > image {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
