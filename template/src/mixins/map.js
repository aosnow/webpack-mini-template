// ------------------------------------------------------------------------------
// name: map
// author: mudas( mschool.tech )
// created: 2020/11/13 13:59
// ------------------------------------------------------------------------------

import { setGlobalData } from '@/utils';

export default {

  data() {
    return {
      longitude: 0,
      latitude: 0
    };
  },

  methods: {
    // 设置地图当前中心点
    setLocation({ longitude, latitude }) {
      this.longitude = longitude;
      this.latitude = latitude;
    },

    // 获取或者更新当前用户的位置
    getLocation(type = 'gcj02') {
      return new Promise((resolve, reject) => {
        uni.getLocation({
          type,
          success: (res) => {
            /*
              latitude	纬度，浮点数，范围为-90~90，负数表示南纬
              longitude	经度，浮点数，范围为-180~180，负数表示西经
              speed	速度，浮点数，单位m/s
              accuracy	位置的精确度
              altitude	高度，单位 m
              verticalAccuracy	垂直精度，单位 m（Android 无法获取，返回 0）
              horizontalAccuracy	水平精度，单位 m
             */
            const position = { longitude: res.longitude, latitude: res.latitude };
            setGlobalData({ userInfo: { ...position } });
            this.longitude = position.longitude;
            this.latitude = position.latitude;

            resolve(position);
          },
          fail(reason) {
            reject(reason);
          }
        });
      });
    }
  }
};
