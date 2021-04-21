// ------------------------------------------------------------------------------
// name: query
// author: mudas( mschool.tech )
// created: 2021/4/20 15:08
// ------------------------------------------------------------------------------

import QS from 'query-string';
import { snakeCase } from '@/utils';

export default {
  methods: {

    /**
     * 分析向 webview 内嵌项目输出的公共参数集合
     * <p>网关 gateway 和 店铺列表 shop 项目在判断业务导向时使用的是 mini_type，目前只支持 “扫码点餐sweep、会员member、团购groupbuy、排队queue、预定reserve”</p>
     * <p>请在需要进行指定的业务导向跳转时，使用 option 参数指定 mini_type 来控制业务导向</p>
     * @param {Object} option page在onLoad时的参数
     * @param {Boolean} [transform=true] 是否使用 'query-string' 将 url 参数转换成字符串格式
     * @return {String|Object}
     */
    genQueryData(option, transform = true) {
      const {
        appId: app_id,
        miniType: mini_type,
        channel,
        source,
        shopId: shop_id,
        storeId: store_id,
        tableInfoId: table_info_id
      } = this.configInfo;

      const {
        avatar,
        gender,
        mobile,
        nickName: nick,
        thirdUserId: third_user_id,
        unionId: union_id,
        userId: user_id,
        longitude,
        latitude
      } = this.userInfo;

      const query = {
        app_id,
        mini_type,
        channel,
        source,

        shop_id,
        store_id,
        table_info_id,

        avatar: encodeURIComponent(avatar),
        gender,
        nick,
        third_user_id,
        union_id,
        user_id,
        mobile,
        longitude,
        latitude
      };

      // 驼峰变量转换成下划线变量
      const optionCopy = {};
      Object.keys(option).forEach(key => {
        optionCopy[snakeCase(key)] = option[key];
      });

      // URL 参数可以覆盖全局数据
      const urlQuery = { ...query, ...optionCopy };

      // 是否直接输出 qs 字符串集合，还是输出 qs Object
      return transform ? QS.stringify(urlQuery) : urlQuery;
    }

  }
};
