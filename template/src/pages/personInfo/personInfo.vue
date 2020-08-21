<template>
  <view class="group-personinfo">
    <block v-for="cell in personInfoGroup" :key="cell">
      <view class="cell-group">
        <text class="cell-group__title">{{cell.tit}}</text>
        <block v-for="item in cell.cellinfo" :key="item">
          <view class="cell-group__cont">
            <text>{{item.tit}}</text>
            <view class="arrow-center">
              <text class="cell-group__cont--value">{{item.value}}</text>
              <image src="~@/static/arrow.png" class="menu-list__item--arrow" v-if="item.arrow"/>
            </view>
          </view>
        </block>
      </view>
    </block>
  </view>
</template>

<script>

import Vue from 'vue';
import { mapGlobalData, setGlobalData } from '@/utils';
import AuthDialog from '@/components/auth/AuthDialog';

export default {
  components: { AuthDialog },

  data() {
    return {
      personInfoGroup: [
        {
          tit: '基本信息',
          cellinfo: [{ tit: '姓名', value: '', key: 'real_name' }, { tit: '性别', value: '', key: 'sex' }, { tit: '生日', value: '', key: 'birthday' }]
        },
        {
          tit: '联系信息',
          cellinfo: [{ tit: '手机', value: '', key: 'mobile' },
            { tit: '邮箱', value: '', arrow: false, key: 'email' },
            { tit: '地址', value: '', arrow: false, key: 'location' }]
        }
      ]
    };
  },

  computed: {
    // 提取 globalData 全局数据
    ...mapGlobalData([
      'app_id',
      'channel',
      'shop_id',
      'source',
      'userInfo'
    ])
  },

  onLoad(option) {
    this.getPsrsonData();
  },

  methods: {
    userInfoHandler(userInfo) {

      // 更新全局数据
      setGlobalData({ userInfo });

    },

    getPsrsonData() {
      let this_ = this;
      this_.loginByUid().then(function(data) {
        if (data.data.token) {
          this_.queryUserInfo(data);
        }
        else {
          this_.loginByWechatPhone(data).then(function(data) {
            this_.queryUserInfo(data);
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
            reject(new Error(err.errMsg));
          }
        });
      });
    },

    queryUserInfo(param) {
      console.log(param, 'paramparamparam======================');
      let this_ = this;
      return new Promise(function(resolve, reject) {
        this_.$http.post({
          scope: 'member',
          url: '/memberCard/queryUserInfo',
          data: {
            mobile: param.data.mobile,
            user_id: param.data.uid
          },
          success: ({ data }) => {
            if (data.code === 10000) {
              var personInfoGroup = [
                {
                  tit: '基本信息',
                  cellinfo: [{ tit: '姓名', value: '', key: 'real_name' },
                    { tit: '性别', value: '', key: 'sex' },
                    { tit: '生日', value: '', key: 'birthday' }]
                },
                {
                  tit: '联系信息',
                  cellinfo: [{ tit: '手机', value: '', key: 'mobile' },
                    { tit: '邮箱', value: '', arrow: false, key: 'email' },
                    { tit: '地址', value: '', arrow: false, key: 'location' }]
                }
              ];
              if (data && data.data) {
                Object.keys(data.data).forEach(function(key) {
                  personInfoGroup.map(item => {
                    item.cellinfo.map(item => {
                      // console.log(key);
                      if (key === 'sex') {
                        if (data.data[key] === 1) {
                          item.value = '男';
                        }
                        else {
                          item.value = '女';
                        }
                      }
                      else if (item.key === key) {
                        item.value = data.data[key] == null ? '未设置' : data.data[key];
                      }
                    });
                  });
                });
              }
              personInfoGroup[0].cellinfo[2].value = personInfoGroup[0].cellinfo[2].value.substr(0, 10);
              this_.personInfoGroup = personInfoGroup;
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

.group-personinfo {

  .cell-group__title {
    padding: 0 32rem;
    color: #969799;
    font-size: 28rem;
    height: 80rem;
    line-height: 80rem;
  }

  .cell-group__cont {
    display: flex;
    justify-content: space-between;
    padding: 20rem 32rem;
    overflow: hidden;
    color: #323233;
    background: #ffffff;
    font-size: 28rem;
    line-height: 48rem;
  }

  .cell-group__cont--value {
    color: #969799;
  }

  .arrow-center {
    display: flex;
    align-items: center;
  }

  .menu-list__item--arrow {
    width: 14rem;
    height: 24rem;
    margin-left: 20rem;
  }
}
</style>
