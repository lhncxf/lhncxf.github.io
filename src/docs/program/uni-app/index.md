# uni-app

## 一、uni-app简介
uni-app 是一个使用 Vue.js 开发所有前端应用的框架，开发者编写一套代码，可发布到 iOS、Android、H5、以及各种小程序平台（微信/支付宝/百度/头条/QQ/快手/钉钉/淘宝等）。它旨在简化跨平台开发流程，提高开发效率。

## 二、安装与环境配置
1. **安装 HBuilderX**：这是官方推荐的 IDE，内置了对 uni-app 的支持。可以从 [DCloud官网](https://www.dcloud.io/hbuilderx.html) 下载。
2. **创建项目**：
    - 打开 HBuilderX，选择“文件 -> 新建 -> 项目”，然后选择“uni-app”模板。
    - 输入项目名称和保存路径后点击创建即可生成一个新的 uni-app 项目。

3. **运行项目**：
    - 在 HBuilderX 中直接点击“运行 -> 运行到浏览器”或“运行 -> 运行到手机或模拟器”，根据需要选择目标平台进行调试。

## 三、基础概念
1. **页面结构**：uni-app 页面由 `<template>`, `<script>`, `<style>` 三个部分组成，类似于 Vue 单文件组件。
2. **生命周期**：除了 Vue 的生命周期钩子外，还增加了 `onLoad`, `onShow`, `onHide` 等小程序特有的生命周期方法。
3. **路由与导航**：uni-app 使用的是基于 tabBar 和 pages.json 配置的路由方式，不支持 Vue Router。

## 四、快速开始
创建一个简单的页面：
```html
<template>
  <view class="container">
    <text>{{ message }}</text>
    <button @click="changeMessage">Change Message</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello uni-app!'
    };
  },
  methods: {
    changeMessage() {
      this.message = 'Message Changed!';
    }
  }
};
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
```

## 五、跨平台适配
1. **条件编译**：uni-app 支持通过条件编译来处理不同平台之间的差异。
    ```javascript
    // #ifdef MP-WEIXIN
    console.log('微信小程序');
    // #endif

    // #ifdef APP-PLUS
    console.log('App端');
    // #endif
    ```
2. **API 调用**：uni-app 提供了一套统一的 API 来调用原生功能，如获取系统信息、网络请求等。
    ```javascript
    uni.getSystemInfo({
      success: function(res) {
        console.log(res.model); // 设备型号
        console.log(res.pixelRatio); // 屏幕像素密度
      }
    });
    ```

## 六、状态管理
对于复杂的应用场景，可以引入 Vuex 来进行状态管理。
1. **安装 Vuex**：
    ```bash
    npm install vuex --save
    ```
2. **配置 Store**：
    ```javascript
    import Vue from 'vue'
    import Vuex from 'vuex'

    Vue.use(Vuex)

    const store = new Vuex.Store({
      state: {
        count: 0
      },
      mutations: {
        increment (state) {
          state.count++
        }
      }
    })

    export default store
    ```

## 七、UI 组件库
uni-app 推荐使用 [uni-ui](https://ext.dcloud.net.cn/plugin?id=55)，这是一个专门为 uni-app 设计的 UI 组件库。
1. **安装 uni-ui**：
    ```bash
    npm install @dcloudio/uni-ui
    ```
2. **使用组件**：
    ```html
    <template>
      <view>
        <uni-card title="标题文字" extra="额外信息" :isFull="true">
          这是卡片内容主体
        </uni-card>
      </view>
    </template>

    <script>
    import uniCard from '@dcloudio/uni-ui/lib/uni-card/uni-card.vue';

    export default {
      components: {uniCard}
    }
    </script>
    ```

## 八、性能优化
1. **分包加载**：合理划分主包和分包，减少首页加载时间。
2. **图片资源优化**：使用合适的图片格式，按需加载图·片资源。
3. **避免不必要的全局变量**：尽量减少全局变量的使用，防止内存泄漏。

## 九、发布与部署
1. **打包 H5 应用**：在 HBuilderX 中点击“发行 -> 网站-PWA”，按照提示操作即可生成 H5 应用。
2. **打包 App**：点击“发行 -> 原生App-云打包”，填写相关信息后等待打包完成。
3. **小程序发布**：将项目导出为对应的小程序工程文件，然后按照各平台的要求上传并提交审核。

## 十、案例研究
- **DCloud 官方示例**：提供了多个实用的例子展示如何使用 uni-app 实现常见的业务需求。
- **第三方插件市场**：访问 [插件市场](https://ext.dcloud.net.cn/) 寻找更多开源组件和插件以加速开发进程。

## 十一、总结
uni-app 提供了一个强大的解决方案，让前端工程师能够轻松地进入多端开发领域。无论是构建简单的移动应用还是复杂的商业应用，掌握 uni-app 都将极大地提升你的技能树。希望这篇笔记能够为你提供一个全面的学习路径，助你在 uni-app 的世界里不断探索和成长。记住，实践是检验真理的唯一标准，动手做项目是深入理解 uni-app 的最佳方式。
