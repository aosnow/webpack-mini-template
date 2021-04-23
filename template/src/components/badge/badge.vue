<!--------------------------------------------------
  name: badge.vue
  author: mudas( mschool.tech )
  created: 2021/4/22
---------------------------------------------------->

<template>
  <view :class="[bem('wrapper')]">
    <!--支付宝环境无法启用 <slot>{{renderContent}}</slot> 的模式-->
    <slot></slot>
    <view :class="classList" :style="style" v-text="renderContent"/>
  </view>
</template>

<script>
import { isDefine, isNumeric } from '@/utils';
import { namespace, normalClasses, normalStyle } from '../style';

const bem = namespace('badge');

export default {
  name: bem(),

  // options: {
  //   virtualHost: true
  // },

  props: {
    dot: Boolean,
    fixed: Boolean,
    max: [Number, String],
    color: String,
    content: [Number, String]
  },

  computed: {
    style() {
      const style = Object.create(null);
      if (this.color) style['background-color'] = this.color;
      return normalStyle(style);
    },

    classList() {
      return normalClasses([
        bem({
          dot: this.dot && !this.hasContent,
          fixed: this.slots.default || this.fixed
        })
      ]);
    },

    hasContent() {
      return isDefine(this.content) && this.content !== '';
    },

    renderContent() {
      if (this.hasContent) {
        if (isDefine(this.max) && isNumeric(this.content) && +this.content > this.max) {
          return this.max + '+';
        }

        return this.content;
      }

      return '';
    }
  },

  methods: {
    bem
  }
};
</script>

<style lang="scss">
@import "~@/css/var.scss";

// Badge
$badge-size: 32rem;
$badge-color: $--color-white;
$badge-padding: 0 6rem;
$badge-font-size: $--font-size-extra-small;
$badge-font-weight: $--font-weight-secondary;
$badge-border-width: $--border-width-base;
$badge-background-color: rgba($--color-red, .9);
$badge-dot-color: $--color-red;
$badge-dot-size: 16rem;
$badge-font-family: -apple-system-font, Helvetica Neue, Arial, sans-serif;

.s-badge {
  display: inline-block;
  box-sizing: border-box;
  min-width: $badge-size;
  padding: $badge-padding;
  color: $badge-color;
  font-weight: $badge-font-weight;
  font-size: $badge-font-size;
  font-family: $badge-font-family;
  line-height: 1.2;
  text-align: center;
  background-color: $badge-background-color;
  border: $badge-border-width solid $--color-white;
  border-radius: $--border-radius-large;

  &--fixed {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    transform-origin: 100%;
  }

  &--dot {
    width: $badge-dot-size;
    min-width: 0;
    height: $badge-dot-size;
    background-color: $badge-dot-color;
    border-radius: 100%;
  }

  &__wrapper {
    position: relative;
    display: inline-block;
  }
}
</style>
