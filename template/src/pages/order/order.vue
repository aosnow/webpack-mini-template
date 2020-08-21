<template>
  <view class="group-order">
    <!--筛选-->
    <view class="tabSerch" v-if="isShowTab">
      <view class="tabSerch-tab">
        <block v-for="(item,index) in tabname" :key="item">
          <view :class="{'active': currentInx === index }"
                @click="onTab(index)"
          >{{item}}
          </view>
        </block>
      </view>
	 <view @click="isShowSerchHander" class="iconType">
		 <icon :type="iconType[0]" size="18"/>
	 </view>

    </view>
    <view class="cell-padding" v-if="!isShowTab">
      <view class="cells">
        <view class="cell">
		  <view @click="serchHander">
			  <icon :type="iconType[0]" size="18"/>
		  </view>
          <input class="uni-input" focus placeholder="请输入门店名称" confirm-type="search" v-model='inputValue' @confirm="confirm"/>
        </view>
        <view class="flexbetween">
          <icon :type="iconType[1]" size="18" @click="clearVal"/>
          <view class="reset" @click="resetHander">取消</view>
        </view>
      </view>
    </view>

    <!--列表-->
    <view v-if="listData && listData.length > 0">
      <view class="group-order__order">
        <block v-for="(item, index) in listData" :key="item">
          <view class="group-order__order--item">
            <view class="order-header">
              <span class="order-header__storename">{{item.storeName}}</span>
              <span class="order-header__orderstatus">{{item.orderStatus | statusfil}}</span>
            </view>
            <view class="order-body">
              <view class="flexbetween">
                <image class="order-body__head" :src="item.shopLogo | imgfil"></image>
                <view>
                  <view class="order-body__name">{{item.titleGoodsName}}{{item.itemCount}}件</view>
                  <view class="order-body__time">{{item.createTime}}</view>
                </view>
              </view>
              <view class="order-body__prize">
                ¥{{item.totalPrice}}
              </view>
            </view>
          </view>
        </block>
      </view>
    </view>
    <view v-else class="defalt-page">
      <view>
        <image src="~@/static/order-defalt.png"/>
      </view>
      <text>暂无订单</text>
    </view>
  </view>
</template>

<script>

import Vue from 'vue';
import { mapGlobalData, setGlobalData } from '@/utils';
import AuthDialog from '@/components/auth/AuthDialog';
import shopLogo from '@/static/logo.png';

export default {
  components: { AuthDialog },

  data() {
    return {
      tabname: ['堂食订单', '外卖订单'],
      isShowTab: true,
      currentInx: 0,
      iconType: ['search', 'clear'],
      // 接口必备参数
      inputValue: '', // storeName = inputValue
      shopId: '635809',
      pageNo: 0,
      pageSize: 20,
      buyerId: 'okMSv4hb8pFoPQtN7Ze_JBife7wg',
      outSupportId: 4, // 4堂食  81外卖
      listData: [
        // {storeName:'黑泷堂文一店', orderStatus: '进行中', titleGoodsName: '珍珠奶', itemCount: 5, totalPrice: '50', createTime: '2020-04-04  10:12:12', shopLogo: ''}
      ]
    };
  },

  computed: {
    // 提取 globalData 全局数据
    ...mapGlobalData([
      'app_id',
      'userInfo'
    ])
  },

  onLoad(option) {
    this.getOrderData(this.app_id);
  },
  onReachBottom() {
    let this_ = this;
    let page = this_.pageNo;
    page++;
    this_.pageNo = page;

	uni.showLoading({
      title: '玩命加载中'
    });
    this.getOrderData(this.app_id);
  },
  filters: {
    statusfil: function(number) {
      if (number === -1) {
        return '已下单';
      }
      else if (number === 0) {
        return '待确认订单';
      }
      else if (number === 1) {
        return '商家已接单';
      }
      else if (number === 2) {
        return '商家拒单';
      }
      else if (number === 3) {
        return '加菜订单';
      }
      else if (number === 5) {
        return '退款中';
      }
      else if (number === 6) {
        return '已退款';
      }
      else if (number === 7) {
        return '拒绝退款';
      }
      else if (number === 11) {
        return '交易完成';
      }
      else if (number === 12) {
        return '交易取消';
      }
    },
	imgfil: function(imgUrl) {
    	let url = '';
		if (imgUrl){
			if (imgUrl.indexOf("http") === 0) {
				url = imgUrl
			}
			else {
				url = `https://img.blibao.com/${imgUrl}`;
			}
		}else{
			url = shopLogo;
		}
		return url;
	}
  },

  methods: {
	confirm () {
	  this.listData = [];
	  this.getOrderData(this.app_id);
	},

    isShowSerchHander() {
      this.isShowTab = false;
    },

    // 筛选tab切换
    onTab(index) {
      this.currentInx = index;
      if (index === 0) {
        this.outSupportId = 4;
      }
      else {
        this.outSupportId = 81;
      }
      this.listData = [];
      this.getOrderData(this.app_id);
    },

    // 筛选输入之后搜索
    serchHander() {
      this.listData = [];
      this.getOrderData(this.app_id);
    },

    // 筛选取消
    resetHander() {
      this.isShowTab = true;
      this.inputValue = '';
      this.listData = [];
      this.getOrderData(this.app_id);
    },

    // 筛选清空
    clearVal() {
      this.inputValue = '';
      this.listData = [];
      this.getOrderData(this.app_id);
    },

    getOrderData(appId) {

      let dataprams = {
        // shopId: this.shop_id,
        outSupportId: this.outSupportId, //4堂食  81外卖
        storeName: this.inputValue,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        appId: this.app_id
      };

      if (this.userInfo.memberUid) {
        dataprams = { ...dataprams, ...{ memberUid: this.userInfo.memberUid } };
      }
      else {
        dataprams = { ...dataprams, ...{ buyerId: this.userInfo.userId } };
      }
      this.$http.get({
        scope: 'sweep',
        url: 'waimai/findAllOrdersByShop',
        data: {
          ...dataprams
        },
        success: ({ data }) => {
          if (data && data.data) {
            if (data.data.list.length === 0) {
              uni.showToast({
                title: '暂无更多',
                icon: 'none'
              });
            }
            else {
              this.listData = this.listData.concat(data.data.list);
            }
          }
			uni.hideLoading();
        }
      });
    }
  }
};
</script>

<style lang="scss">

.group-order {
  .flexbetween {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tabSerch {
    @extend .flexbetween;
    padding: 30rem 50rem;

	.iconType{
		width: 150rem;
		text-align: right;
	}
    .tabSerch-tab {
      display: flex;
      align-items: center;

      & view {
        margin-right: 20rem;
        color: #888888;
      }

      & .active {
        font-size: 46rem;
        color: #353535;
      }
    }
  }

  .cell-padding {
    padding: 30rem 50rem;

    .cells {
      padding: 15rem 50rem;
      @extend .flexbetween;
      border-radius: 47.5rem;
      background-color: #ededed;
      align-items: center;

      .cell {
        display: flex;
        flex: 1;
        align-items: center;

	      input{
		      background: transparent;
	      }
      }

      .reset {
        margin-left: 20rem;
      }
    }
  }

  .group-order__order {
    width: 100%;
    padding: 0 40rem;
    box-sizing: border-box;

    .group-order__order--item {
      box-shadow: 0 8px 4px 0 rgba(218, 218, 218, 0.25);
      border-radius: 30rem;
      background: #fff;
      padding: 30rem;
      margin-top: 30rem;

      .order-header {
        height: 81rem;
        line-height: 81rem;
        border-bottom: 1rem solid #ededed;
        margin-bottom: 20rem;
        @extend .flexbetween;

        .order-header__storename {
          font-size: 30rem;
          color: #353535;
        }

        .order-header__orderstatus {
          font-size: 28rem;
          color: #e50413;
        }
      }

      .order-body {
        @extend .flexbetween;

        .order-body__head {
          width: 120rem;
          height: 120rem;
          border-radius: 30rem;
          margin-right: 26rem;
        }

        .order-body__name {
          font-size: 32rem;
          color: #353535;
          margin-top: 16rem;
        }

        .order-body__time {
          font-size: 26rem;
          color: #888888;
          margin-top: 16rem;
        }

        .order-body__prize {
          font-size: 30rem;
          color: #353535;
        }
      }
    }
  }

  .defalt-page {
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    & image {
      width: 230rem;
      height: 218rem;
    }

    & text {
      font-size: 28rem;
      color: #979797;
    }
  }

}
</style>
