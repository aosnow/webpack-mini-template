<template>
  <view class="share-content">
    <view class="share-content-close" :style="'top:' + top +'rem'">
        <image @tap="back" class="content-imgBox_icon" :src="cloose" mode="scaleToFill"></image>
    </view>
    <image class="share-content-mask"  :src="defaultImage"></image>
    <view class="share-content-imgBox" @tap="showShareBtn">
        <!-- // 预览的  image -->
        <image :style="'transform:scale(' + scall + ')'" class="content-imgBox_shareImage" :src="defaultImage" mode="scaleToFill"></image>
        <!-- 海报底部的 -- 统一标识 -->
        <view class="content-imgBox_YinHeLogoBox">
            <image class="imgBox_YinHeLogoBox--logo" :src="yinhe" mode=""></image>
            <text class="imgBox_YinHeLogoBox--text">发现好商品</text>
        </view>
    </view>
    <view class="share-content-shareBox" :style="'bottom:' + bottom +'rem'">
        <view class="share-content-shareBox_title">
            更多操作
        </view>
        <view class="share-content-shareBox_Btn">
            <block v-for="(item, index) in shareList" :key="index">
                <view class="shareBox_Btn--item">
                    <image class="shareBox_Btn--item-image" :src="item.img" :data-type="item.type" @tap="chooseAction"></image>
                    <text class="shareBox_Btn--item-text">{{item.text}}</text>
                    <button v-if="!item.type" class="shareBox_Btn--item_mask" open-type="share"></button>
                </view>
            </block>
        </view>
    </view>
  </view>
</template>

<script>
import Qs from "query-string";
export default {
  data() {
    return {
      title: '银盒宝成拼团',
      defaultImage: '../../static/logo.png',
      yinhe: '../../static/copyright.png',
      cloose: '../../static/cloose.png',
      active: false,
      scall: 1,
      bottom: -340,
      top: -176,
      shareList: [
          {
            type: 0,
            img:'../../static/weixin.png',
            text:'微信'
          }
        //   {
        //     type: 2,
        //     img:'../../static/keep.png',
        //     text:'保存图片'
        //   }
        //   {
        //     type: 3,
        //     img:'../../static/fx.png',
        //     text:'复制链接'
        //   }
      ],
      show: false,
      groupId: '',
      parmas: {}
    };
  },

  onLoad(option) {
    this.parmas = option;
    if (option.default_image) {
      this.defaultImage =  `https://img.blibao.com/${option.default_image}`;
      delete this.parmas.default_image;
    }
    console.log(this.parmas, '[=====]')
  },
  onShow(opt) {
      // console.log('opt', opt);
  },
  onShareAppMessage() {

    let resData = {
        title: decodeURIComponent(this.parmas.group_name) || '分享',
        path:'/pages/storepage/index?' + Qs.stringify(this.parmas), // 此路径只能是小程序中的  某个路径，不可直接写到h5页面路径
        imageUrl: this.defaultImage, //分享的图片
        success: (res) => {
            // console.log(res);
            // 转发成功之后的回调
            if(res.errMsg == 'shareAppMessage:ok'){
                uni.navigateBack({
                    delta: 1
                })
            }
        },
        fail:function(res) {

        }
    }
    return resData;
  },

  methods: {
    back() {
        uni.navigateBack({
            delta: 1
        })
    },
    showShareBtn() {
        this.active = !this.active;
        if ( this.active ) {
            this.scall = 0.9;
            this.bottom = 0;
            this.top = 0;
        } else {
            this.scall = 1;
            this.bottom = -340;
            this.top = -176;
        }
    },
    chooseAction(e){
        const type = e.target.dataset.type;
        if (type === 2){
            this.keepImage();
        }
        else {
            this.copyUrl();
        }
    },
    // 保存海报
    keepImage() {
        uni.getImageInfo({
            src: this.defaultImage,
            success: function (res) {
                uni.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success: function (data) {
                        uni.showToast({
                            title:"保存成功！"
                        })
                    }
                })
            }
        })
    },
    // 复制链接
    copyUrl() {

    }
  }
};
</script>

<style lang="scss">
.share-content {
    height: calc(100vh);
    position: relative;
    overflow: hidden;
    .share-content-close{
        position: absolute;
        width: 100%;
        height: 176rem;
        top: 0;
        z-index: 4;
        // transform: scaleY(-88rem);
        background-color: rgba(0, 0, 0, 0.3);
        transition: all .1s;
        // border: 1rem solid red;
        display: flex;
        align-items: flex-end;
        .content-imgBox_icon{
            width: 44rem;
            height: 44rem;
            margin-left: 5%;
            margin-bottom: 44rem;
        }
    }
    .share-content-mask{
        background-size: 120% 120%;
        background-repeat: no-repeat;
        position: absolute;
        width: 100%;
        height: calc(100vh - 4rem);
        filter: blur(10rem);
        z-index: 2;
    }
    .share-content-imgBox{
        position: absolute;
        width: 100%;
        height: calc(100vh - 4rem);
        z-index: 3;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .content-imgBox_shareImage{
            width: 600rem;
            margin: 10% auto;
            height: 480rem;
            box-shadow: 6rpx 6rpx 26rpx #999;
            border-radius: 12rpx;
            transition: all .1s;

        }
        .content-imgBox_YinHeLogoBox{
            height: 100rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;

            .imgBox_YinHeLogoBox--logo{
                width: 300rem;
                height: 40rem;
                background-size: contain;
            }
            .imgBox_YinHeLogoBox--text{
                color: #666;
                font-size: 30rem;
                letter-spacing: 14rem;
            }
        }
    }
    .share-content-shareBox{
        position: absolute;
        width: 100%;
        height: 340rem;
        z-index: 3;
        transform: scaleY(-340rem);
        background-color: white;
        transition: all .1s;
        .share-content-shareBox_title{
            width: 100%;
            height: 88rem;
            line-height: 88rem;
            text-align: center;
            font-size: 36rem;
            color: #000;
            font-weight: 600;
            letter-spacing: 10rem;
        }
        .share-content-shareBox_Btn{
            height: calc(100% - 88rem);
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            .shareBox_Btn--item{
                width: 50%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: relative;
                .shareBox_Btn--item-image{
                    width: 90rem;
                    height: 90rem;
                    margin-bottom: 24rem;
                }
                .shareBox_Btn--item-text{
                    font-size: 26rem;
                    color: #333;
                    margin-bottom: 1rem;
                }
                .shareBox_Btn--item_mask{
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: 3;
                    background: transparent;
                    &::after{
                        border: none;
                    }
                }
            }
        }
    }
}
</style>
