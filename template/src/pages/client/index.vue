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
import { parseQuery, analyzeOption } from '@/utils';
import mixAuth from '@/mixins/auth';

export default {
  mixins: [mixAuth],

  data() {
    return {
      url: '',
      option: null
    };
  },

  onLoad(option) {
    this.option = analyzeOption(option);
  },

  methods: {
    pageReady(source) {
      console.warn('page ready...', source);
      this.url = `http://172.16.17.5:8080/#?${parseQuery({ ...this.option, mini_type: 'sweep' })}`;
    }
  }
};
</script>

<style lang="scss">
.group-client {
  height: 100vh;
}
</style>
