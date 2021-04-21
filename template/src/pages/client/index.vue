<!--------------------------------------------------
  name: index.vue
  author: mudas( mschool.tech )
  created: 2020.05.05
---------------------------------------------------->

<template>
  <view class="group-client">
    <!--需要开启 component2 编译模式支持-->
    <web-view-client :url="url"/>
  </view>
</template>

<script>
import mixQuery from '@/mixins/query';
import { formatOption } from '@/utils';

export default {
  mixins: [mixQuery],

  data() {
    return {
      url: ''
    };
  },

  onLoad(option) {
    this.pageReady(formatOption(option));
  },

  methods: {
    pageReady(option) {
      console.warn('page ready...');
      this.url = `http://172.16.17.5:8080/#?${this.genQueryData({ ...option, miniType: 'sweep' })}`;
    }
  }
};
</script>

<style lang="scss">
.group-client {
  height: 100vh;
}
</style>
