// ------------------------------------------------------------------------------
// name: slots
// author: mudas( mschool.tech )
// created: 2021/4/23 17:15
// ------------------------------------------------------------------------------

export default {
  computed: {

    /**
     * 兼容微信、支付宝的插槽数据列表，用以替代 $slots
     * @return {Object}
     */
    slots() {
      const data = {};

      // 支付宝：this.$scope.prop
      // 微信：this.$scope.properties
      const prop = this.$scope ? this.$scope.properties || this.$scope.props || {} : {};
      const $slots = prop.$slots;

      if ($slots) {
        Object.keys($slots).forEach(slot => {
          const name = slot.slice(slot.slice(0, 1) === '$' ? 1 : 0);
          data[name] = true; // 不能等于原值，只能作标记，否则会引起 JSON 循环转换错误
        });
      }

      return data;
    }

  }
};
