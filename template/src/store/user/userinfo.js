// ------------------------------------------------------------------------------
// name: login
// author: 喵大斯( h5devs.com/h5devs.net )
// created: 2018/8/24 15:18
// ------------------------------------------------------------------------------

import * as Types from '@/store/types';
import EasyStore, { namespace } from '@mudas/store';

const USER_INFO = namespace(Types.USER_INFO);

const Config = [
  {
    type: USER_INFO,
    increment: true,
    state: {
      avatar: '',
      gender: 1,
      mobile: '',
      nickName: '',
      thirdUserId: '',
      unionId: '',
      userId: '',

      // 地图相关信息
      longitude: 0, // 经度
      latitude: 0 // 纬度
    }
  }
];

export default new EasyStore(Config).output();
