<template>
  <view class="group-my">
    <auth-dialog :needAuthDialog="needAuth" :app-id="app_id" @user-info="userInfoHandler"/>
    <!-- 头像信息 -->
    <view class="group-my__head">
      <image :src="userInfo.avatar || useravatar"/>
    </view>
    <view class="group-my__name">{{userInfo.nickName}}</view>

    <!-- 跳转菜单 -->
    <view class="group-my__menu">
      <block v-for="item in menuDataList" :key="item">
        <view class="item" @click="topage(item.type)">
          <!-- 获取手机号 -->
          <!-- #ifdef MP-WEIXIN -->
          <view v-if="!userInfo.mobile && (userInfo.unionId || userInfo.avatar) " class="menu-list__item--getphone">
            <button type="default" open-type="getPhoneNumber" @getphonenumber="getphonenumber">获取手机号</button>
          </view>
		  <!-- #endif -->
          <view class="flexblockbetween">
            <image :src="item.icon" class="group-my__menu--icon"/>
            <view class="group-my__menu--name">{{item.name}}</view>
          </view>
          <image src="~@/static/arrow.png" class="group-my__menu--arrow"/>
        </view>
      </block>
    </view>

  </view>
</template>

<script>

import Vue from 'vue';
import { mapGlobalData, setGlobalData } from '@/utils';
import AuthDialog from '@/components/auth/AuthDialog';

export default {
  components: { AuthDialog },

  data() {
    return {
      useravatar: '/static/head_pic.jpeg',
      menuDataList: [
        { icon: '/static/icon_menu_user.png', name: '个人信息', type: 'personInfo' },
        { icon: '/static/icon_menu_code.png', name: '会员码', type: 'barcodePay' }
      ],
      needAuth: false
    };
  },

  computed: {
    // 提取 globalData 全局数据
    ...mapGlobalData([
      'appName',
      'app_id',
      'imgPath',
      'channel',
      'shop_id',
      'store_id',
      'table_info_id',
      'guid',
      'scene',
      'userInfo'
    ])
  },

  onLoad(option) {
    console.log(this.userInfo, 'userInfouserInfouserInfouserInfo=================');

  },

  methods: {
    userInfoHandler(userInfo) {

      // 更新全局数据
      setGlobalData({ userInfo });

    },

    getphonenumber(e) {
      let this_ = this;
      if (e.detail.encryptedData) {
        uni.login({
          success(res) {
            if (res.code) {
              // #ifdef MP-WEIXIN
              this_.$http.get({
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
                success(res) {
                  if (res.data.success) {
                    const userInfo = res.data.data;
                    setGlobalData({ userInfo });
                    uni.showToast({ title: '授权成功', icon: 'success', mask: true, duration: 1000 });
                  }
                },
                fail: (err) => {
                  uni.showToast({ title: '授权失败', icon: 'none', mask: true, duration: 1000 });
                  reject(new Error(err.errMsg));
                }
              });
              // #endif
              // #ifdef MP-ALIPAY
              this_.$http.get({
                scope: 'auth',
                url: 'thirdAuth/alipayLogin.htm',
                data: {
                  appId: this_.app_id,
                  userId: this_.userInfo.userId,
                  encryptedData: e.detail.encryptedData
                },
                success(res) {
                  if (res.data.success) {
                    const userInfo = res.data.data;
                    setGlobalData({ userInfo });
                    uni.showToast({ title: '授权成功', icon: 'success', mask: true, duration: 1000 });
                  }
                },
                fail: (err) => {
                  uni.showToast({ title: '授权失败', icon: 'none', mask: true, duration: 1000 });
                  reject(new Error(err.errMsg));
                }
              });
              // #endif
            }
          }
        });
      }
    },

    topage(page) {
    	console.log(this.userInfo, "niunai");


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

	if (!this.userInfo.mobile) {
		return;
	}
	// #endif

      uni.navigateTo({ url: `/pages/${page}/${page}` });
    }
  }
};
</script>

<style lang="scss">

.flexblockbetween {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.group-my {
  text-align: center;
  overflow: hidden;

  .group-my__head {
    width: 150rem;
    height: 150rem;
    border-radius: 150rem;
    overflow: hidden;
    margin: 0 auto;
    margin-top: 60rem;

    & image {
      width: 100%;
      height: 100%;
    }
  }

  .group-my__name {
    font-size: 40rem;
    color: #353535;
    margin-top: 42rem;
    font-weight: bold;
  }

  .group-my__menu {
    padding: 0 40rem;
    margin-top: 100rem;

    .item {
      width: 100%;
      height: 120rem;
      box-shadow: 0 10px 4px 0 rgba(235, 235, 235, 0.25);
      border-radius: 30rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 40rem;
      box-sizing: border-box;
      background: #ffffff;
      margin-bottom: 30rem;
      position: relative;

      .menu-list__item--getphone {
        position: absolute;
        top: 0;
        left: 0;
        height: 120rem;
        width: 100%;
        opacity: 0.01;
      }

      .group-my__menu--icon {
        width: 40rem;
        height: 40rem;
      }

      .group-my__menu--arrow {
        width: 14rem;
        height: 24rem;
      }

      .group-my__menu--name {
        font-size: 32rem;
        color: #353535;
        margin-left: 20rem;
      }
    }
  }
}
</style>
