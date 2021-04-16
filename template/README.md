# {{ name }}
> {{ description }}

## Project setup
```
npm install
```

### 调试和发布
```
npm run dev:%PLATFORM%
npm run build:%PLATFORM%
```

dev 模式下，通过 `npm run dev:%PLATFORM%` 启动完成后，需要继续启动相应的“支付宝”或“微信”开发者工具，来导入“dist/dev/mp-wexin”等对应的平台开发编译项目来进行查看效果。


- %PLATFORM% 可取值如下:

值|平台
---|---
app-plus|app平台生成打包资源（仅支持npm run build:app-plus）
h5|H5
mp-alipay|支付宝小程序
mp-baidu|百度小程序
mp-weixin|微信小程序
mp-toutiao|字节跳动小程序
mp-qq|qq 小程序
quickapp-vue|快应用

- dev 和 build 模式区别：
  - dev 模式编译出的各平台代码存放于根目录下的 /dist/dev/目录，打开各平台开发工具选择对应平台目录即可进行预览（h5 平台不会在此目录，存在于缓存中）；
  - build 模式编译出的各平台代码存放于根目录下的 /dist/build/ 目录，发布时选择此目录进行发布；
  - dev 和 build 模式的区别：
    1. dev 模式有 SourceMap 可以方便的进行断点调试；
    2. build 模式会将代码进行压缩，体积更小更适合发布为正式版应用；
    3. 进行环境判断时，dev 模式 process.env.NODE_ENV 的值为 development，build 模式 process.env.NODE_ENV 的值为 production。

### vue 与 uni-app 小程序的差异
[vue 与 uni-app 小程序的差异详细介绍](https://uniapp.dcloud.io/use/)
