<script>

import { observableGlobalData, setGlobalData, analyzeLaunchOption } from '@/utils';

import Config from './config'; // 根据不同的 platform 加载不同的配置

// globalData 实际是 App 的一个属性成员
// 因此与 getApp() 读写相关操作只能在下一级的页面中进行

const globalData = observableGlobalData({
  ...Config,
  env: 'test'  // test | pre | release 目前主要影响所使用的 http 配置
});

export default {
  // 全局数据
  globalData,

  onLaunch(option) {
    // console.log('App Launch', option);
  },

  onShow(option) {
    const query = analyzeLaunchOption(option);

    globalData.guid = query.guid || '';
    globalData.scene = option.scene || '';
    globalData.ready = false; // 每次启动的状态还原

    // 小程序每次打开包括第一次启动，都会触发该回调
    setGlobalData({ query }, globalData);

    // 若是通用码进入，携带 guid，通过接口拿取基本参数
    if (globalData.guid) {
      // #ifdef MP-WEIXIN
      this.getQRCodeInfo(globalData.guid) //'384EE981DCEBD791D80602FE91DB363B'
          .then(({ data }) => {
            const { shopId, storeId, tableInfoId } = data;

            globalData.ready = true;
            setGlobalData({ shop_id: shopId, store_id: storeId, table_info_id: tableInfoId }, globalData);
            uni.$emit('ready', { shop_id: shopId, store_id: storeId });
          })
          .catch(reason => uni.showModal({ title: '错误', content: reason.message, showCancel: false }));
      // #endif
    }
    else {
      if (query.shop_id && query.store_id) { // 支付宝通用码进来
        globalData.ready = true;
        // 更新shop_id和store_id
        setGlobalData({ shop_id: query.shop_id, store_id: query.store_id, table_info_id: query.table_info_id }, globalData);
        uni.$emit('ready', { shop_id: query.shop_id, store_id: query.store_id });
      }
      else {
        globalData.ready = true; // 支付宝体验码进来或者微信体验码
        setGlobalData({ shop_id: '1000000' }, globalData);
        uni.$emit('ready', { shop_id: '1000000' });
      }
    }
  },

  onHide() {
    console.log('App Hide');
    // 关闭小程序的时候清空guid重新加载，避免用户小程序栏打开小程序重新进入此前二维码扫码结果页面
    globalData.guid = '';
    globalData.shop_id = '';
    globalData.store_id = '';
    globalData.table_info_id = '';
  },

  methods: {
    getQRCodeInfo(guid) {
      return new Promise((resolve, reject) => {
        this.$http.get({
          scope: 'openapi',
          url: 'ajax/getShopQrInfo.htm',
          data: { guid },
          success: ({ data }) => {
            console.log('App Show', data);
            if (data.success) {
              // 更新shop_id和store_id
              setGlobalData({ shop_id: data.data.shopId, store_id: data.data.storeId });
              if (data.data.tableInfoId) {
                setGlobalData({ table_info_id: data.data.tableInfoId });
              }
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
    }
  }
};
</script>

<style lang="scss">
page {
  color: $uni-text-color;
  font-family: $uni-body-font-family;
  font-size: $uni-font-size-base;
  background-color: $uni-background-color-base;
  line-height: 1;

  // 字体渲染抗锯齿，只对 MacOS 的 webkit、moz 有效，Windows 系统无区别
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

*, *:before, *:after {
  box-sizing: border-box;
  outline: none;
}
</style>
