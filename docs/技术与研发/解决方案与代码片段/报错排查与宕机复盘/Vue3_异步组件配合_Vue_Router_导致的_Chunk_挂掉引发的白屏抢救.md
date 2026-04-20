# 单点实战与最佳实践 [Vue3 异步组件配合 Vue Router 导致的 Chunk 挂掉引发的白屏抢救]

> **使用场景**：在微前端、微服务繁荣的时代，前端项目采用 Webpack/Vite 极度依赖 Code Splitting（代码分割）来减少首屏体积。但一旦上线（特别是灰度发布、全量发布后的几分钟内），老用户在页面上点击某个跳转菜单时，由于引用的远端 `[hash].js` Chunk 文件已经被服务器新版本覆盖删除，就会触发经典的 `Loading chunk {n} failed` 报错，导致整个页面彻底白屏死机。

## 1. 痛点与需求场景 (Context)
* **原始痛点**：
  - **版本更新导致的断链 (404 Not Found)**：昨天上线了版本 v1.0，首页的 Chunk 是 `home.v1.js`，用户 A 昨晚没关浏览器。今天我们发了版本 v2.0（服务器上的文件变成了 `home.v2.js`，删除了 v1.js）。此时用户 A 在当前旧页面上点击“个人中心”，Vue Router 试图去请求 `user.v1.js`，结果返回 404。
  - **白屏没有任何提示**：Vue Router 在底层通过 `import('./user.vue')` 请求异步组件失败时，抛出的未捕获的 Promise Rejection 会导致整个渲染树崩塌。用户看到的就是死寂一般的白屏。
* **预期目标**：
  - **全局容错与拦截**：监听这种特定的 Chunk 加载失败错误，在报错的一瞬间，自动强制刷新当前页面（以拉取最新版本的 `index.html` 和对应的最新 JS 资源树）。
  - **优雅降级体验**：如果真的是网络断了（不是版本更新导致的 404），则不能死循环刷新，要弹出“网络异常，点击重试”的兜底组件。

## 2. 核心架构与设计思路 (Design & Best Practice)
* **Vue Router 4 的原生错误钩子 (`router.onError`)**：
  - Router 官方提供了在导航发生不可预见错误时的捕获机制。我们可以通过正则匹配报错信息（`Loading chunk \d+ failed`）或者错误类型来精准识别此类灾难。
* **全局错误处理 (`app.config.errorHandler`)**：
  - Vue 的全局异常监控。不仅是路由 Chunk，如果是父组件里面通过 `defineAsyncComponent` 引入的子组件（比如点击弹出一个巨大的富文本编辑器插件）因为网络波动拉取失败，也会在这里报错。
* **防死循环强刷机制**：
  - 如果真的因为 CDN 挂了（导致你刷新页面后，新的 JS 依然拉不到，再次触发报错），你写在 onError 里的 `location.reload()` 就会让用户的屏幕疯狂鬼畜闪烁。**必须借助 sessionStorage 做标识，10 秒内只允许抢救刷新一次。**

## 3. 开箱即用：核心代码骨架 (Implementation)

### 3.1 核心路由层抢救 (Vue Router 4)

在初始化 Router 实例后，紧接着注册全局 Error 钩子。

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: '/user', 
      component: () => import('@/views/user/index.vue') // 异步 Chunk
    }
  ]
});

// 监听异步组件/路由分块加载失败
router.onError((error, to, from) => {
  // 正则匹配 Webpack 经典的 chunk failed，或者 Vite 的 failed to fetch dynamically imported module
  const isChunkLoadFailed = error.message.match(/Loading chunk/i) || 
                            error.message.match(/Failed to fetch dynamically imported module/i) ||
                            error.name === 'ChunkLoadError';

  if (isChunkLoadFailed) {
    console.error(`[Router] 捕捉到异步 Chunk 加载失败 (404/网络断开), 目标路由: ${to.fullPath}`, error);
    
    // 【核心】防死循环机制：在 sessionStorage 打一个标记
    const retryKey = `chunk_failed_retry_${to.fullPath}`;
    const hasRetried = sessionStorage.getItem(retryKey);

    if (!hasRetried) {
      // 1. 如果没抢救过，立刻打标，并强行刷新页面拉取最新版本资源
      sessionStorage.setItem(retryKey, String(Date.now()));
      
      // 注意：如果只是 location.reload()，它停留在原来的路径。
      // 因为是跳转过程出错了，所以最好携带目标路径的强刷
      window.location.replace(to.fullPath);
    } else {
      // 2. 如果已经抢救过一次（比如 30 秒内），但依然失败了！说明是真的 CDN 挂了或断网了！
      const lastRetryTime = Number(hasRetried);
      if (Date.now() - lastRetryTime < 30000) { // 30 秒冷却期
        // 这里千万不能再 reload 了！
        // 可以调出你封装好的 UI 弹窗组件
        alert('抱歉，系统更新或网络极差导致模块加载失败。请稍后再试或按 Ctrl+F5 强刷。');
      } else {
        // 过了 30 秒冷却期，可以再试一次
        sessionStorage.setItem(retryKey, String(Date.now()));
        window.location.replace(to.fullPath);
      }
    }
  } else {
    // 别的普通错误，抛出不管
    throw error;
  }
});

export default router;
```

### 3.2 局部异步组件的优雅降级 (defineAsyncComponent)

如果是页面内部点击一个按钮弹出的巨大的子组件。通过 Vue3 的 `defineAsyncComponent` 可以配置极其优雅的 `onError` 重试或者 `errorComponent` 兜底。

```typescript
// views/dashboard.vue
import { defineAsyncComponent, defineComponent, h } from 'vue';

// 兜底报错组件
const ErrorFallback = defineComponent({
  render: () => h('div', { class: 'text-red-500 p-4 border border-red-500' }, '📉 该功能模块加载失败，请检查网络后重试。')
});

const HeavyChartComponent = defineAsyncComponent({
  loader: () => import('@/components/HeavyChart.vue'), // 这是独立打包的 chunk
  
  // 异步加载失败时展示
  errorComponent: ErrorFallback,
  
  // 如果加载时间超过这个数字（默认 Infinity），也会展示 errorComponent
  timeout: 10000, 

  // 提供原生的失败重试底层钩子（比如在弱网下尝试重新拉 3 次）
  onError(error, retry, fail, attempts) {
    if (error.message.match(/fetch/i) && attempts <= 3) {
      // 每次失败递增延迟，最多试 3 次
      setTimeout(() => {
        retry();
      }, attempts * 1000); // 1s, 2s, 3s
    } else {
      // 重试了 3 次都崩了，宣告失败，展示 ErrorFallback
      fail();
    }
  }
});
```

## 4. 边界情况与避坑补充 (Edge Cases & Gotchas)
* **不要盲目删除老版本 Chunk**：导致这个白屏的最根本原因，是运维在发版部署时（跑了 `rm -rf dist` 再 `mv`），非常暴力地把服务器上上一版的文件彻底干掉了。在 CI/CD 最佳实践中，针对静态资源（JS/CSS），**在 OSS/CDN 或 Nginx 上绝对不能直接覆盖删除老资源**！应该至少保留近 3 个版本的物理文件存活 24 小时（增量部署），这样哪怕老用户不刷新浏览器，他旧版的 HTML 请求旧版的 JS 依然是 200 OK 的。
* **Vite 热更新断联 (HMR Error)**：在本地开发时，Vite 的 WebSocket 断开了，经常会在控制台抛出不可捕捉的 `[vite] server connection lost` 或者 Chunk 无法找到。这个时候不必用上述复杂的线上代码兜底，因为一旦你重新跑了 `npm run dev`，强刷一下页面就解决了。上述方案专针对生产环境构建产物设计。
