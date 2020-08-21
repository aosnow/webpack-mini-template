<!--------------------------------------------------
  name: index.vue
  author: mudas( mschool.tech )
  created: 2020/5/12
---------------------------------------------------->

<template>
  <view class="wxpay">
    <web-view v-if="success" :src="resultUrl"/>
  </view>
</template>

<script>
import { setGlobalData } from '@/utils';

// 参考：https://uniapp.dcloud.io/collocation/frame/lifecycle?id=%E9%A1%B5%E9%9D%A2%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F
export default {
  name: 'wxpay',
  data() {
    return {
      success: false,
      resultUrl: ''
    };
  },

  // 监听页面加载，其参数为上个页面传递的数据
  onLoad(option) {
    const { success, result_url, payParam } = option;

    if (payParam !== undefined) {
      this.requestPayment(JSON.parse(decodeURIComponent(payParam)));
    }
    else if (success !== undefined && result_url !== undefined) {
      this.paymentResult({ success, resultUrl: result_url });
    }
    else {
      // 意外情况
    }
  },

  // 页面卸载
  // 跳转到 index page 时触发
  onUnload() {
    console.log('微信收银onUnload');
  },

  // 页面隐藏
  // 跳转到第三方支付时会先触发该 Hide，后触发 App.hide（但此时未完成支付，支付结果未知）
  onHide() {
  },

  methods: {

    // 调起微信收银台（第三方非银盒子）
    requestPayment(payParam) {
      const {
        successUrl, // 成功页面跳转地址
        failUrl, // 失败页面跳转地址
        appId, // 外刊小程序appid
        timeStamp, // 时间戳，自1970年以来的秒数
        nonceStr, // 随机串
        package: wxPackage,
        signType, // 微信签名方式
        paySign // 微信签名
      } = payParam;

      wx.requestPayment({
        timeStamp,
        nonceStr,
        package: wxPackage,
        signType, //'MD5',
        paySign,
        success: (res) => {
          // 支付操作完成之后返回H5页面
          console.log('微信收银台success_res：', res);
          this.backToH5(decodeURIComponent(successUrl));
        },
        fail: (res) => {
          console.log('微信收银台fail_res：', res);
          uni.showToast({ title: res.errMsg, icon: 'none', mask: true });
          this.backToH5(`${decodeURIComponent(failUrl)}&err_msg=${res.errMsg}`);
        },
        complete: (res) => {
          console.log('微信收银台complete_res：', res);
          // 较早版本，用户取消支付，不进入fail回调，仅回调 complete
          // res.errMsg为requestPayment:fail cancel
          if (/fail\s*cancel/i.test(res.errMsg)) {
            // 用户取消返回订单页
            this.backToH5(`${decodeURIComponent(failUrl)}&err_msg=${res.errMsg}`);
          }
        }
      });
    },

    // 支付完成结果
    paymentResult({ success, resultUrl }) {
      this.success = success;
      this.resultUrl = resultUrl;
    },

    // 打开 web-view 页面
    backToH5(url) {
      console.log('backUrl:', url);
      setGlobalData({ payResultUrl: url });

      // 小程序主动返回到上一个页面。即从wxpay page到index page。此时index page的webview已经重新加载了url 了
      // 微信小程序的page 也有栈的概念 navigateBack 相当于页面出栈的操作
      uni.navigateBack();
    }

  }
};
</script>

<style lang="scss">
.wxpay {}
</style>
