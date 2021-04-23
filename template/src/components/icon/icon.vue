<!--------------------------------------------------
  name: icon/icon.vue
  author: mudas( mschool.tech )
  created: 2021/4/22
---------------------------------------------------->

<template>
  <view :class="[bem('wrapper')]">
    <!--图标-->
    <template v-if="!hasDotOrBadge">
      <view :class="classList" :style="style"/>
    </template>

    <!--包含徽标的图标-->
    <template v-else>
      <s-badge :dot="dot" :content="badge">
        <view :class="classList" :style="style"/>
      </s-badge>
    </template>
  </view>
</template>

<script>

// uni-app 不支持 render 方式来渲染组件：https://uniapp.dcloud.io/vue-api?id=%e9%80%89%e9%a1%b9

// 该图标组件使用 @vant/icons 的图标资源，其文档规范与 vant 相同
// 参考：https://youzan.github.io/vant/#/zh-CN/icon

import { addUnit, isNil } from '@/utils';
import { namespace, normalStyle, normalClasses } from '../style';

const bem = namespace('icon');

export default {
  name: bem(), // s-icon
  props: {
    // 图标名称
    name: String,

    // 图标大小，如 20px 2em，默认单位为px
    size: [Number, String],

    // 是否显示图标右上角小红点
    dot: Boolean,

    // 图标右上角徽标的内容
    badge: [Number, String],

    // 图标颜色
    color: String,

    // 类名前缀，用于使用自定义图标
    classPrefix: {
      type: String,
      default: 'van-icon'
    }
  },

  computed: {
    style() {
      const style = Object.create(null);
      if (this.size) style['font-size'] = addUnit(this.size, 'rpx');
      if (this.color) style.color = this.color;
      return normalStyle(style);
    },

    classList() {
      return normalClasses([this.bem(), this.classPrefix, `${this.classPrefix}-${this.name}`]);
    },

    // 是否包含自定义徽标内容或者红点
    hasDotOrBadge() {
      return this.dot || !isNil(this.badge);
    },

    badgeContent() {
      return isNil(this.badge) ? '' : this.badge;
    }
  },

  methods: {
    bem
  }
};
</script>

<style lang="less">
@import "~@vant/icons/src/encode-woff2";

.s-icon {
  &__wrapper {
    position: relative;
    display: inline-block;
  }
}
</style>
