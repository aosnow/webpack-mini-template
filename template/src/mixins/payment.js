// ------------------------------------------------------------------------------
// name: payment - 配合 wxPay/wxPay 使用的混合
// author: mudas( mschool.tech )
// created: 2021/4/21 23:00
// ------------------------------------------------------------------------------

/*
支付结果反馈功能支持
具备 webview 的页面，若需要从 H5 调度微信小程序支付，需要加载此混合
使用方法：

  import mixPayment from '@/mixins/payment';

  export default {
    mixins: [mixPayment('url')]
  }
 */

export default function(urlName = 'url') {
  return {

    // 原应用页面重新打开
    // 一般支付成功后，返回到应用进行显示支付结果
    onShow() {
      const payResultUrl = this.getGlobalData('payResultUrl');

      if (payResultUrl) {
        this[urlName] = ''; // 触发重置和隐藏（payResultUrl 前后地址一致时有效）
        this[urlName] = payResultUrl;

        // 打开新的支付结果后，清空 payResultUrl
        // 避免每次重复打开支付结果页面
        this.setGlobalData({ payResultUrl: '' });
      }
    },

    onHide() {
      this.setGlobalData({ payResultUrl: '' });
    }

  };
};
