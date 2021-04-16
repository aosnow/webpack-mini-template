// ------------------------------------------------------------------------------
// name: auth
// author: mudas( mschool.tech )
// created: 2020/11/27 17:00
// ------------------------------------------------------------------------------

import { mapGlobalData, setGlobalData } from '@/utils';

export default {

  data() {
    return {
      authed: false
    };
  },

  computed: {
    // 提取 globalData 全局数据
    ...mapGlobalData({ app_id: 'app_id' })
  },

  onLoad(option) {
    // 应用的启动状态（主要针对小程序启动参数处理）
    if (this.$var('ready')) {
      this._pageReady('ready');
    }
    else {
      uni.$once('ready', data => {
        this._pageReady('ready.event');
      });
    }
  },

  methods: {
    _pageReady(source) {
      const { pageReady } = this;
      // 若需要在页面进行用户授权，则设置 data.needAuth = true，否则可不定义或设置 false
      const authCheck = !this.needAuth ? true : this.authed;

      if (this.$var('ready') && authCheck && typeof pageReady === 'function') {
        pageReady.call(this, source);
      }
    },

    // 用户授权数据获取成功
    userInfoHandler(userInfo) {
      setGlobalData({ userInfo });
      this.authed = true;
      this._pageReady('auth');
    }
  }
};
