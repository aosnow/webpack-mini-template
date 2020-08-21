// ------------------------------------------------------------------------------
// name: vue.config.js
// author: 喵大斯( mschool.tech )
// created: 2019/4/23 21:00
// ------------------------------------------------------------------------------

const path = require('path');

function resolve(...dir) {
  return path.join(__dirname, ...dir);
}

// 配置集合
const webpackConfig = {

  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件
  // 此处列出 node_modules 中同样需要让 babel 转译的 esm 模块
  transpileDependencies: [
    '@mudas/*'
  ],

  chainWebpack: (config) => {
    // 路径别名
    config.resolve.alias.set('vue$', 'vue/dist/vue.esm.js');
    config.resolve.alias.set('@', resolve('src'));
  }
};

module.exports = webpackConfig;
