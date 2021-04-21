<!--------------------------------------------------
  name: wxpay - 微信小程序支付
  author: mudas( mschool.tech )
  created: 2020/5/12
---------------------------------------------------->

<template>
  <view class="wxpay">
    <web-view v-if="success" :src="resultUrl"/>
  </view>
</template>

<script>

/*
微信小程序支付
说明：微信小程序嵌套H5在支付场景下，H5直连支付无效，需要调取小程序支付事务逻辑（支付宝无此问题）
支付流程：
  - H5发起订单创建请求（发向后台服务，处理相关私有数据、签名等）
  - 服务端创建订单，生成支付基础数据，调取微信统一下单，生成预支付交易
  - 后端页面回调小程序支付页 wxPay（wx.navigateTo({url:"/pages/wxPay/wxPay?支付参数"})）
  - 小程序支付页接收服务端处理后的支付参数，开始正式向微信发起支付
  - 用户操作，完成支付
  - 后端异步接收支付结果，查询订单状态，组织支付结果，再次调用 wxPay（wx.navigateTo({url:"/pages/wxPay/wxPay?支付结果"})）
  - 小程序 webview 显示支付结果
 */

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

    // 支付参数，发起支付请求（请求微信支付）
    if (payParam !== undefined) {
      this.requestPayment(JSON.parse(decodeURIComponent(payParam)));
    }

    // 处理支付结果（result_url 为 h5 地址，需要 webview 承载来打开）
    else if (success !== undefined && result_url !== undefined) {
      this.paymentResult({ success, resultUrl: result_url });
    }
    else {
      // 意外情况
    }
  },

  // 页面卸载
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
          this.backToH5(`${decodeURIComponent(failUrl)}&err_msg=${'payment failed'}`);
        },
        complete: (res) => {
          console.log('微信收银台complete_res：', res);
          // 较早版本，用户取消支付，不进入fail回调，仅回调 complete
          // res.errMsg为requestPayment:fail cancel
          if (/fail\s*cancel/i.test(res.errMsg)) {
            // 用户取消返回订单页
            this.backToH5(`${decodeURIComponent(failUrl)}&err_msg=${'cancels payment'}`);
          }
        }
      });
    },

    // 支付完成结果
    paymentResult({ success, resultUrl }) {
      this.success = success;
      this.resultUrl = resultUrl;
    },

    // 打开 web-view 原应用页面
    // 原应用页面监听 onShow() 来处理 payResultUrl 跳转需求
    backToH5(url, failed) {
      console.log('backUrl:', url);
      this.setGlobalData({ payResultUrl: url });
      // 小程序主动返回到上一个页面。即从wxpay page到index page。此时index page的webview已经重新加载了url 了
      // 微信小程序的page 也有栈的概念 navigateBack 相当于页面出栈的操作
      // !failed && uni.navigateBack();
      uni.navigateBack();
    }

  }
};
</script>

<style lang="scss">
.wxpay {}
</style>
