<!--------------------------------------------------
  name: index.vue
  author: mudas( mschool.tech )
  created: 2021/4/21
---------------------------------------------------->

<template>
  <view class="map-location">
    <text class="map-location__loading">{{currentMessage}}</text>
  </view>
</template>

<script>
import { formatOption, isNumeric } from '@/utils';

// H5 嵌入环境，由于无法直接打开浏览器地址的第三方“地图去导航”页面
// 使用该小程序原生页面替代：H5 端通过以下方式来使用地图导航功能：
// uni.navigateTo({url:'/pages/map/index?lng=&lat=&name=&address='})
// 微信：在当前页直接打开地图，返回（1次）上级页面
// 支付宝：在新页面打开地图，返回（2次）上级页面

export default {
  data() {
    return {
      state: 'init',
      message: {
        init: '正在打开地图...',
        success: '点击左上角返回原页面'
      }
    };
  },

  computed: {
    currentMessage() {
      return this.message[this.state];
    }
  },

  // 监听页面加载，其参数为上个页面传递的数据
  onLoad(option) {
    this.state = 'init';
    this.openLocation(formatOption(option));
  },

  methods: {
    /**
     * 错误信息打印
     */
    printError({ message }) {
      uni.showModal({
        title: '地图打开失败',
        content: '错误的经纬度数据，请返回重试',
        showCancel: false,
        confirmText: '立即返回',
        success: () => {
          uni.navigateBack();
        }
      });
    },

    /**
     * 打开地图查看位置，点击“去导航”
     * @param {String|Number} longitude
     * @param {String|Number} latitude
     * @param {String} [name='unknown name']
     * @param {String} [address='unknown address']
     */
    openLocation({ longitude, latitude, name = 'unknown name', address = 'unknown address' }) {
      // 数据有效性验证
      if (!isNumeric(longitude) || !isNumeric(latitude)) {
        return this.printError({ message: '经纬度数据错误' });
      }

      // 打开地图指定位置，具备 “去导航” 功能
      uni.openLocation({
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
        name,
        address,
        success: () => {
          setTimeout(() => {
            this.state = 'success';
          }, 2000);
        },
        fail: (reason) => {
          this.printError({ message: reason.errMsg });
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "~@/css/var.scss";

.map-location {
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
