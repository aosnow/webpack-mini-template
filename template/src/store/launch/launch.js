// ------------------------------------------------------------------------------
// name: launch
// author: mudas( mschool.tech )
// created: 2021/4/20 15:56
// ------------------------------------------------------------------------------

import Vue from 'vue';
import * as Types from '@/store/types';
import EasyStore, { namespace } from '@mudas/store';

const LAUNCH_QR = namespace(Types.LAUNCH_QR);
const LAUNCH_SHOP = namespace(Types.LAUNCH_SHOP);

const Config = [
  {
    type: LAUNCH_QR,
    action(context, params, conf) {
      return Vue.http.openapi.get('ajax/getShopQrInfo.htm', { ...params }, conf)
                 .then(({ data }) => {
                   if (data.success) {
                     context.commit(LAUNCH_QR, data);
                     return Promise.resolve(data);
                   }
                   else {
                     return Promise.reject(new Error(data.msg));
                   }
                 })
                 .catch((reason) => Promise.reject(reason));
    }
  },

  {
    type: LAUNCH_SHOP,
    action(context, params, conf) {
      return Vue.http.sweepapi.get('miniApp/getShopIdByAppId.htm', { ...params }, conf)
                 .then(({ data }) => {
                   context.commit(LAUNCH_SHOP, data);
                   return Promise.resolve(data);
                 })
                 .catch((reason) => Promise.reject(reason));
    }
  }
];

export default new EasyStore(Config).output();
