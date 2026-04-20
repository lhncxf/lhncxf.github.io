# 深度问题排查与避坑备忘 [SSR (Nuxt/Next) 服务端渲染的 Node.js 内存泄露排查与首屏 TTFB 极限优化]

> **使用场景**：记录 SSR 架构下典型的 Node.js 服务端性能瓶颈。针对 Nuxt/Next 这种同构框架在服务端运行时的内存增长曲线异常，以及高并发下 TTFB（Time To First Byte）由于闭包、全局对象污染导致劣化的排查全过程。

## 1. 故障现场 (Phenomenon)
* **现象描述**：线上 Nuxt3 服务运行 48 小时后，Pod 频繁触发 OOM 重启。监控显示 Node.js 进程内存呈锯齿状阶梯式上升，无法通过 GC 回到基准线。同时，首屏 TTFB 从正常的 100ms 逐渐退化至 2s+，用户侧感知明显卡顿。
* **影响范围**：全平台 SSR 页面，尤其是包含复杂图表和高频异步调用的详情页。
* **复现路径**：使用 `wrk` 或 `autocannon` 进行高并发压测，在 `connection: keep-alive` 模式下，内存随着请求量线性增长。

## 2. 深度排查链路追踪 (Root Cause Analysis)

### 2.1 排查步骤 1：初步怀疑方向
* **单例污染**：专家的第一反应就是 SSR 的“同构陷阱”。在客户端习惯用的全局单例（如自定义的 `EventBus` 或全局变量）在服务端是跨请求共享的。如果每个请求都往全局对象里 `push` 数据且不清理，内存必爆。
* **排查手段**：检查 `plugins` 和 `composables`，确认是否有在 `setup` 外部定义的响应式变量或监听器。

### 2.2 排查步骤 2：底层机制与快照分析
* **Heap Dump**：通过 `node --inspect` 暴露调试端口，在内存高位时 dump 出 `.heapsnapshot` 文件，导入 Chrome DevTools。
* **发现异常**：发现大量 `V8EventListener` 和 `InternalObject` 无法释放。溯源后发现，某三方图表库在 SSR 环境下依然尝试在 `window`（被 jsdom 模拟）上挂载监听，或者在每个请求中创建了新的 `axios` 实例却挂载了全局的 `interceptor`。

### 2.3 最终定位 (Root Cause)
* **根因 1 (Memory Leak)**：在 Nuxt 的 `server middleware` 中错误地使用了全局缓存对象，且未设置 LRU 过期机制。
* **根因 2 (TTFB Lag)**：首屏渲染时，服务端进行了过多的非必要 API 序列化。由于 `useAsyncData` 的 `payload` 过大（包含了未使用的冗余字段），导致 V8 序列化 JSON 耗时过长，阻塞了 Event Loop。

## 3. 最终修复方案与底层解剖 (Resolution & Core Diff)

### 3.1 核心修复：单例解耦与精准清理
```javascript
// 错误代码 (Anti-pattern): 全局拦截器污染
import axios from 'axios';
export default defineNuxtPlugin(() => {
  // 这种写法在 SSR 会导致拦截器随请求数无限累加
  axios.interceptors.request.use(config => {
    config.headers.token = useCookie('auth').value;
    return config;
  });
});

// 修复代码 (Best Practice): 使用实例化的 local client
export default defineNuxtPlugin(() => {
  const api = axios.create(); // 每个请求创建独立实例或使用 Nuxt 内置的 $fetch
  api.interceptors.request.use(config => {
    // ...逻辑同上，但作用域仅限当前实例
    return config;
  });
  return { provide: { api } };
});
```

### 3.2 TTFB 优化：数据精简 (Shallow Data)
```javascript
// 修复点：通过 transform 仅提取页面渲染所需的字段，减少 payload 序列化负担
const { data } = await useAsyncData('user', () => $fetch('/api/user'), {
  transform: (user) => ({
    id: user.id,
    name: user.name,
    avatar: user.avatar // 剔除掉后端返回的 50+ 个冗余字段
  })
});
```

### 深入底层原理 (Why it Works)
* **Context Isolation**：SSR 下的 Node 进程是常驻的，跨请求的上下文隔离全靠框架的 `AsyncLocalStorage`（Nuxt/Next 内部实现）。任何挂载在全局 `global` 或模块顶层的变量，都会在整个进程生命周期内存活。
* **Event Loop Block**：Node.js 是单线程的。当 `JSON.stringify` 处理一个 5MB 的深度嵌套对象时，会占用 CPU 几十毫秒。在这几十毫秒内，所有其他并发请求的 `accept` 都会被挂起，直接导致 TTFB 飙升。

## 4. 全局规避策略与工程化防腐 (Prevention)
* **监控兜底**：在 CI 环境集成 `clinic.js` 进行压力测试，自动检测 `bubbleprof` 异常。
* **规范拦截**：
    * 强制要求所有 SSR 数据请求使用 `pick` 或 `transform` 参数。
    * 自研 ESLint 插件：禁止在 `defineNuxtPlugin` 或 `composables` 的非生命周期钩子中直接使用 `global` 对象。
* **架构设计建议**：尽量将逻辑下沉至 BFF 层（如 Nest.js），保持 SSR 层（Nuxt/Next）仅作为纯粹的视图渲染机，减少在渲染层进行复杂的数据转换和逻辑计算。
