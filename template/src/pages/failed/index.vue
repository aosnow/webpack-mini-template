<!--------------------------------------------------
  name: failed/index.vue
  author: mudas( mschool.tech )
  created: 2021/4/22
---------------------------------------------------->

<template>
  <view class="startup-failed">
    <icon type="value" size="26"/>
    <text>启动失败，请关闭后重试</text>
  </view>
</template>

<script>
// 参考：https://uniapp.dcloud.io/collocation/frame/lifecycle?id=%E9%A1%B5%E9%9D%A2%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F
export default {
  name: 'startup-failed',
  data() {
    return {
      content: 'Template page: failed/index.vue'
    };
  },

  // 监听页面初次渲染完成。注意如果渲染速度快，会在页面进入动画完成前触发
  onReady() {
  },

  // 监听页面加载，其参数为上个页面传递的数据
  onLoad(option) {
  },

  // 页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面
  onShow() {
  },

  // 页面隐藏
  onHide() {
  },

  // 页面卸载
  onUnload() {
  },

  /**
   * 点击 tab 时触发
   * @param {string} index 被点击tabItem的序号，从0开始
   * @param {string} text 被点击tabItem的按钮文字
   * @param {string} pagePath 被点击tabItem的页面路径
   */
  onTabItemTap({ index, text, pagePath }) {
  },

  // 用户点击右上角分享
  onShareAppMessage() {
  }
};
</script>

<style>
.startup-failed {}
</style>
