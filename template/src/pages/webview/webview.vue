<template>
  <view>
    <web-view :webview-styles="webviewStyles" :src="H5Url"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      H5Url: '',
      webviewStyles: {
        progress: {
          color: '#FF3333'
        }
      }
    };
  },

  onLoad(option) {
    console.warn('optionoptionoptionoptionoption:', option);
    uni.showLoading({
      title: '加载中...',
      mask: true
    });
    let H5urlObj = JSON.parse(option.H5Url);
    let url = '';
    let urlparam = '';
    Object.keys(H5urlObj).forEach(function(key) {
      if (key === 'url') {
        url = decodeURIComponent(H5urlObj[key]);
      }
      else if (key === 'avatar') {

        urlparam = urlparam + '&' + key + '=' + encodeURI(H5urlObj[key]);
      }
      else {
        urlparam = urlparam + '&' + key + '=' + H5urlObj[key];
      }
    });
    urlparam = urlparam.substr(1);
    console.log(urlparam, 'urlparam');
    if (urlparam) {
      this.H5Url = `${url}?${urlparam}`;
    }
    else {
      this.H5Url = url;
    }

    uni.hideLoading();
    console.log(this.H5Url, 'H5Url');

  }
};
</script>

<style>

</style>
