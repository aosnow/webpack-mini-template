<template>
  <view class="group-barcodePay">
    <view class="member-code">
      <view class="hollow-wrap">
        <view class="hollow-wrap__head">
          <view class="hollow-wrap__head--inner">
            <view class="inner-icon"
                  :style="userInfo.avatar ? 'background-image: url(' + userInfo.avatar + ')' : ' background-image: url(data:image/png;base64,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);'"
            ></view>
            <text class="inner-text">我的会员码</text>
          </view>
        </view>

        <view class="hollow-wrap__mask">
          <view class="hollow-wrap__mask--border"></view>
        </view>

        <view class="hollow-wrap__body">
          <view class="member-code__barcode">

            <!-- #ifdef MP-WEIXIN -->
            <canvas canvas-id="barcode" class="barcode"/>
            <!-- #endif -->

            <!-- #ifdef MP-ALIPAY-->
            <canvas id="barcode" class="barcode"/>
            <!--#endif-->
            <p class="member-code__qrcode--notify">{{barcode}}</p>

          </view>
          <view class="member-code__qrcode">
            <!-- #ifdef MP-WEIXIN -->
            <canvas canvas-id="qrcode" class="qrcode"/>
            <!-- #endif -->
            <!-- #ifdef MP-ALIPAY-->
            <canvas id="qrcode" class="qrcode"/>
            <!--#endif-->
            <p class="member-code__qrcode--notify">使用时向收银员出示</p>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>

import { mapGlobalData, setGlobalData } from '@/utils';
import barcode from '@/utils/barcode';
import qrcode from '@/utils/qrcode';
import AuthDialog from '@/components/auth/AuthDialog';

export default {
  components: { AuthDialog },

  data() {
    return {
      barcode: '',
      avatar: ''
    };
  },

  computed: {
    // 提取 globalData 全局数据
    ...mapGlobalData([
      'app_id',
      'channel',
      'shop_id',
      'mini_type',
      'source',
      'userInfo'
    ])
  },

  onLoad(option) {
    let this_ = this;

    if (this.$var('ready')) {
      this_.getBarcodeData();
    }
    else {
      uni.$on('ready', data => {
        this_.getBarcodeData();
      });
    }
  },

  methods: {
    userInfoHandler(userInfo) {

      // 更新全局数据
      setGlobalData({ userInfo });
    },
    getBarcodeData() {

      let this_ = this;
      this_.loginByUid().then(function(data) {
        if (data.data.token) {
          this_.querUserDynamicCode(data);
        }
        else {
          this_.loginByWechatPhone(data).then(function(data) {
            this_.querUserDynamicCode(data);
          });
        }
      });
    },
    loginByUid() {
      let this_ = this;
      let dataparams = {
        shopper_id: this.shop_id,
        out_request_source: 'commonMember',
        source: this.source,
        openid: this.userInfo.userId
      };

      if (this.userInfo.memberUid) {
        dataparams = { ...dataparams, ...{ uid: this.userInfo.memberUid } };
      }

      return new Promise(function(resolve, reject) {
        this_.$http.post({
          scope: 'member',
          url: '/login/loginByUid',
          data: {
            ...dataparams
          },
          success: ({ data }) => {
            if (data.code === 10000) {
              resolve(data);
            }
            else {
              reject(new Error(data.msg));
            }
          },
          fail: (err) => {
            reject(new Error(err.errMsg));
          }
        });
      });
    },

    loginByWechatPhone(param) {
      let this_ = this;
      return new Promise(function(resolve, reject) {
        this_.$http.post({
          scope: 'member',
          url: 'login/loginByWeChatPhone',
          data: {
            phone: this_.userInfo.mobile,
            openid: this_.userInfo.userId,
            shopper_id: this_.shop_id,
            source: this_.source,
            union_id: this_.userInfo.unionId,
            mini_type: this_.mini_type,
            channel: this_.channel,
            app_id: this_.app_id
          },
          success: ({ data }) => {
            if (data.code === 10000) {
              resolve(data);
            }
            else {
              reject(new Error(data.msg));
            }
          },
          fail: (err) => {
            console.warn('barcode================.fail:', err);
            reject(new Error(err.errMsg));
          }
        });
      });
    },

    querUserDynamicCode(param) {
      let this_ = this;
      return new Promise(function(resolve, reject) {
        this_.$http.post({
          scope: 'member',
          url: '/memberCard/querUserDynamicCode',
          data: {
            user_uid: param.data.uid,
            token: param.data.token
          },
          success: ({ data }) => {
            if (data.code === 10000) {
              resolve(data);
              if (data && data.data && data.data.dynamic_code) {

                this_.barcode = data.data.dynamic_code;

                // #ifdef MP-WEIXIN
                barcode.code128(wx.createCanvasContext('barcode'), this_.barcode, '600', '60');
                qrcode.api.draw(this_.barcode, {
                  ctx: wx.createCanvasContext('qrcode'), width: '160', height: '160'
                });
                // #endif

                // #ifdef MP-ALIPAY
                barcode.code128(my.createCanvasContext('barcode'), this_.barcode, '600', '60');
                qrcode.api.draw(this_.barcode, {
                  ctx: my.createCanvasContext('qrcode'), width: '160', height: '160'
                });
                // #endif
              }
              else {
                uni.showToast({
                  title: '您还不是该店铺会员呢！',
                  duration: 1000
                });
              }
            }
            else {
              reject(new Error(data.msg));
            }
          },
          fail: (err) => {
            reject(new Error(err.errMsg));
          }
        });
      });
    }
  }
};
</script>

<style lang="scss">

.group-barcodePay {
  canvas.barcode {
    width: 650rem;
    height: 150rem;
  }

  canvas.qrcode {
    width: 300rem;
    height: 300rem;
  }

  .member-code {
    width: 100%;
    height: 100vh;
    padding: 0;
    background-color: #707070;
    display: flex;
  }

  .hollow-wrap {
    width: 90%;
    margin: auto;
    overflow: hidden;
  }

  .hollow-wrap__head {
    font-size: 32rem;
    height: 120rem;
    background-color: #ffffff;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    border-top-left-radius: 4rem;
    border-top-right-radius: 4rem;
  }

  .hollow-wrap__head--inner {
    margin: auto;
    -webkit-transform: translateY(8rem);
    transform: translateY(8rem);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
  }

  .inner-icon {
    width: 82rem;
    height: 82rem;
    display: block;
    border-radius: 50%;
    overflow: hidden;
    background-image: url(data:image/png;base64,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);
    background-size: cover;
    background-position: 50% 50%;
    margin-right: 30rem;
  }

  .hollow-wrap__mask {
    width: 100%;
    height: 36rem;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 24rem;
    background-image: linear-gradient(to right, transparent 10px, #ffffff 10px, #ffffff calc(100% - 10px), transparent calc(100% - 10px));
    position: relative;
  }

  .hollow-wrap__mask--border {
    height: 50%;
    border: none;
    border-bottom: 2rem dashed #ccc;
  }

  .hollow-wrap__mask:before {
    content: '';
    display: block;
    width: 24rem;
    height: 36rem;
    background-color: #ffffff;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAASCAYAAABvqT8MAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMC8xMS8xOTdsIM4AAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAAcElEQVQoka3T0QnAIAxF0WsXqCM5QkdyFEfpSG6Q/qRiqVQfNBDQj0MgPgNgCBWA1N0jcHjvQ2Fmr3ZYfPqzR6CDWQKOigoiUG+wzbZiZtWnADAFXqcKqgparYKogtRO6lr/fThWo8FH+OR4B8QPdAELRdN2Dl5WwAAAAABJRU5ErkJggg==);
    mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAASCAYAAABvqT8MAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMC8xMS8xOTdsIM4AAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAAcElEQVQoka3T0QnAIAxF0WsXqCM5QkdyFEfpSG6Q/qRiqVQfNBDQj0MgPgNgCBWA1N0jcHjvQ2Fmr3ZYfPqzR6CDWQKOigoiUG+wzbZiZtWnADAFXqcKqgparYKogtRO6lr/fThWo8FH+OR4B8QPdAELRdN2Dl5WwAAAAABJRU5ErkJggg==);
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
  }

  .hollow-wrap__mask:after {
    content: '';
    display: block;
    width: 24rem;
    height: 36rem;
    background-color: #ffffff;
    position: absolute;
    top: 0;
    right: 0;
    -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAASCAYAAABvqT8MAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMC8xMS8xOTdsIM4AAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAAdUlEQVQokZ2T0RGAIAxDg+cAjORojtIRHMGRcIL440fptUDNXb6aBxRKAUAktA9qD4Drc9MFOhYAlSSsPeD0ghEgo7AFWnQM7U31IiS75jxp4J6FLTBd3QJL0kDNAsfqLqlr1UD64X6NxnT4CuL/4I73CHD1Au+12Pw/qW3rAAAAAElFTkSuQmCC);
    mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAASCAYAAABvqT8MAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMC8xMS8xOTdsIM4AAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAAdUlEQVQokZ2T0RGAIAxDg+cAjORojtIRHMGRcIL440fptUDNXb6aBxRKAUAktA9qD4Drc9MFOhYAlSSsPeD0ghEgo7AFWnQM7U31IiS75jxp4J6FLTBd3QJL0kDNAsfqLqlr1UD64X6NxnT4CuL/4I73CHD1Au+12Pw/qW3rAAAAAElFTkSuQmCC);
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
  }

  .hollow-wrap__body {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    justify-content: center;
    text-align: center;
    padding-top: 20rem;
  }

  .member-code__barcode {
    text-align: center;
  }

  .hollow-wrap__body .member-code__qrcode {
    margin: 0 auto 60rem auto;
    text-align: center;
  }

  .member-code__qrcode--notify {
    color: #303133;
    font-size: 28rem;
    text-align: center;
  }

}
</style>
