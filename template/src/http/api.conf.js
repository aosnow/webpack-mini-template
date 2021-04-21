// ------------------------------------------------------------------------------
// name: api.conf
// author: mudas( mschool.tech )
// created: 2021/4/21 23:31
// ------------------------------------------------------------------------------

// API 接口相关的前缀根地址
export default {
  // 测试环境
  test: {
    auth: 'http://test.blibao.com/Auth/',
    pay: 'https://dev.blibao.com/SweepPay/',
    openapi: 'http://test.api.blibao.com/ApiService/',
    syncapi: 'http://test.api.blibao.com/sync/',
    sweep: 'http://test.blibao.com:5001/',
    sweepapi: 'http://test.api.blibao.com/sweep-api/'
  },

  // 预发环境
  pre: {
    auth: '',
    pay: '',
    openapi: '',
    syncapi: '',
    sweep: '',
    sweepapi: ''
  },

  // 线上环境
  release: {
    auth: '',
    pay: '',
    openapi: '',
    syncapi: '',
    sweep: '',
    sweepapi: ''
  }
};
