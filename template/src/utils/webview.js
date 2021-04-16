// ------------------------------------------------------------------------------
// name: webview
// author: mudas( mschool.tech )
// created: 2020/11/16 16:53
// ------------------------------------------------------------------------------

import QS from 'query-string';
import { mapGlobalData } from '@/utils/globalData';
import { analyzeOption } from '@/utils/launch';

/**
 * 分析向 webview 内嵌项目输出的公共参数集合
 * <p>网关 gateway 和 店铺列表 shop 项目在判断业务导向时使用的是 mini_type，目前只支持 “扫码点餐sweep、会员member、团购groupbuy、排队queue、预定reserve”</p>
 * <p>请在需要进行指定的业务导向跳转时，使用 option 参数指定 mini_type 来控制业务导向</p>
 * @param {Object} option page在onLoad时的参数
 * @param {Boolean} [qs=true] 是否使用 'query-string' 将 url 参数转换成字符串格式
 * @return {String|Object}
 */
export function parseQuery(option = {}, qs = true) {
  const optionQuery = analyzeOption(option);

  const { app_id, mini_type, shop_id, store_id, table_info_id, channel, userInfo } = mapGlobalData([
    'app_id',
    'mini_type',
    'channel',
    'shop_id',
    'store_id',
    'table_info_id',
    'userInfo'
  ], false);

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
  } = userInfo;

  const query = {
    app_id,
    mini_type,
    channel,
    source: channel === 'wechat' ? 2 : 1, // 1是支付宝 2是微信

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

  // URL 参数可以覆盖全局数据
  const urlQuery = { ...query, ...optionQuery };

  // 是否直接输出 qs 字符串集合，还是输出 qs Object
  return qs ? QS.stringify(urlQuery) : urlQuery;
}
