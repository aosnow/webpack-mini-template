<!--------------------------------------------------
  name: App2.vue
  author: mudas( mschool.tech )
  created: 2021/4/19
---------------------------------------------------->

<script>

import * as Types from '@/store/types';
import { formatOption } from '@/utils';

export default {
  globalData: {
    readyState: false
  },

  onLaunch(option) {
    // 手机硬件及环境信息
    uni.getSystemInfo({
      success: (res) => {
        this.setSystem(res);
      }
    });
  },

  onShow(option) {
    const query = formatOption(option);

    // 记录环境参数
    this.ready = false;
    this.setConfig({ guid: query.guid, scene: query.scene });
    this.setParam(query);

    // 1、若是通用码进入，携带 guid，通过接口拿取基本参数
    if (query.guid) {
      // 测试GUID：'384EE981DCEBD791D80602FE91DB363B'
      this.$store.dispatch(Types.LAUNCH_QR, { guid: query.guid })
          .then(({ data }) => {
            const { shopId, storeId, tableInfoId } = data;
            this.isReady({ shopId, storeId, tableInfoId });
          })
          .catch(reason => this.failed(reason));
    }

    // 2、在线点餐、门店码、桌台码（包含 table_info_id）
    else if (query.shop_id && query.store_id) {
      this.isReady({ shopId: query.shop_id, storeId: query.store_id, tableInfoId: query.table_info_id });
    }

      // 3、默认启动
      // 通过配置中的 appId 拿取基本参数

    // 支付宝体验码进来或者微信体验码，以及搜索小程序进入的场景
    else {
      this.$store.dispatch(Types.LAUNCH_SHOP, { appId: this.appId })
          .then((data) => {
            const { shopId } = data.data;
            this.isReady({ shopId });
          })
          .catch(reason => this.failed(reason));
    }

    // 4、本地测试
    // this.isReady({ shopId: '73862', storeId: '79982' });
    // this.isReady({ shopId: '6546771', storeId: '6546797', tableInfoId: '1890120' });
    // this.isReady({ shopId: '1000000' });
  },

  onHide() {
    // 关闭小程序的时候清空guid重新加载，避免用户小程序栏打开小程序重新进入此前二维码扫码结果页面
    this.$store.commit(Types.ENV_RESET);
  },

  methods: {

    // 应用启动结束
    isReady(value) {
      this.ready = true;
      this.setConfig(value);
      uni.$emit('ready', value);
    },

    failed(reason) {
      uni.showModal({ title: '启动失败', content: reason.message, showCancel: false });
    }
  }
};
</script>

<style lang="scss">
page {
  color: $uni-text-color;
  font-family: $uni-body-font-family;
  font-size: $uni-font-size-base;
  line-height: 1;
  background-color: $uni-background-color-base;

  // 字体渲染抗锯齿，只对 MacOS 的 webkit、moz 有效，Windows 系统无区别
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

%border-box {
  box-sizing: border-box;
  outline: none;
}

view, scroll-view, swiper, cover-view, cover-image, match-media, movable-area, text, rich-text, swiper-item, input, textarea {
  @extend %border-box;

  &:before, :after {
    @extend %border-box;
  }
}
</style>
