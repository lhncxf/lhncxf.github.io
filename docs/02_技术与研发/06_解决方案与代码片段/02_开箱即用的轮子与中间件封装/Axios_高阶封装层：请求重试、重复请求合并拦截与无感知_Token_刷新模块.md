# 单点实战与最佳实践 [Axios 高阶封装层：请求重试、重复请求合并拦截与无感知 Token 刷新模块]

> **使用场景**：企业级应用中，网络环境复杂多变，Token 失效是常态。如果不做高阶封装，用户会频繁遇到“请求超时”、“请重新登录”的弹窗，或者因为手抖狂点按钮导致后端被相同的 POST 请求打爆。

## 1. 痛点与需求场景 (Context)
* **原始痛点**：
  - **并发重复请求**：用户网卡时狂点“提交订单”，前端发出 10 个相同的请求，导致数据库生成 10 个订单。
  - **Token 过期体验差**：Token 只有 2 小时有效期，过期后接口报 401。如果直接跳登录页，用户刚填了半小时的表单直接丢失，会被骂死。
  - **弱网环境中断**：高铁、电梯里接口偶尔超时，没有静默重试机制。
* **预期目标**：
  - **防抖拦截**：利用 `AbortController` 自动取消进行中且完全相同的请求。
  - **无感知刷新 (Silent Refresh)**：接口报 401 时，拦截它，挂起后续所有请求，去调用 `refreshToken` 接口。拿到新 token 后，重发刚才失败的请求，再把挂起的请求全部释放，用户完全无感知。

## 2. 核心架构与设计思路 (Design & Best Practice)
* **双 Token 机制**：后端下发 `accessToken` (短效，2小时) 和 `refreshToken` (长效，7天)。
* **请求队列 (Request Queue)**：在刷新 Token 的几百毫秒内，如果页面并发发起了其他请求，必须把它们的 Promise 的 `resolve` 存入一个数组队列中阻塞住，等新 Token 到来后再遍历执行。
* **Map 缓存用于取消重复请求**：用 `Map` 存储当前正在 pending 的请求，Key 为 `URL + Method + Params + Data` 的 hash，Value 为 `AbortController.abort`。

## 3. 开箱即用：核心代码骨架 (Implementation)

### 3.1 拦截器核心框架

```typescript
import axios from 'axios';

// 正在进行中的请求列表
const pendingMap = new Map<string, AbortController>();

// 生成唯一请求 Key
const getPendingKey = (config: any) => [config.method, config.url, JSON.stringify(config.params), JSON.stringify(config.data)].join('&');

// 添加 pending
const addPending = (config: any) => {
  const pendingKey = getPendingKey(config);
  config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
    if (!pendingMap.has(pendingKey)) {
      pendingMap.set(pendingKey, cancel);
    }
  });
};

// 移除 pending
const removePending = (config: any) => {
  const pendingKey = getPendingKey(config);
  if (pendingMap.has(pendingKey)) {
    const cancel = pendingMap.get(pendingKey);
    cancel && cancel(pendingKey);
    pendingMap.delete(pendingKey);
  }
};

const instance = axios.create({
  baseURL: process.env.VITE_API_URL,
  timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 1. 取消重复请求
    removePending(config);
    addPending(config);

    // 2. 注入 Token
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

### 3.2 无感知刷新 Token 核心逻辑

```typescript
let isRefreshing = false; // 是否正在刷新 Token
let requestsQueue: Array<() => void> = []; // 挂起的请求队列

instance.interceptors.response.use(
  (response) => {
    removePending(response.config);
    return response.data;
  },
  async (error) => {
    error.config && removePending(error.config);
    
    // 弱网重试机制 (简单实现)
    const { config } = error;
    if (!config || !config.retry) return Promise.reject(error);

    // Token 过期处理 (通常是 401)
    if (error.response && error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          // 调用刷新接口
          const res = await axios.post('/api/auth/refresh', { refresh_token: refreshToken });
          const newAccessToken = res.data.access_token;
          
          localStorage.setItem('access_token', newAccessToken);
          
          // 配置新的 Token 并重新发起失败的请求
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          
          // 释放队列中的所有请求
          requestsQueue.forEach((cb) => cb(newAccessToken));
          requestsQueue = [];
          
          return instance(config); // 重发当前请求
        } catch (refreshError) {
          // Refresh Token 也过期了，彻底清空并跳登录页
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // 如果正在刷新中，返回一个未决的 Promise，放入队列
        return new Promise((resolve) => {
          requestsQueue.push((newToken: string) => {
            config.headers.Authorization = `Bearer ${newToken}`;
            resolve(instance(config));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);
```

## 4. 边界情况与避坑补充 (Edge Cases & Gotchas)
* **上传/下载文件的重复拦截**：对于文件上传请求（FormData），`JSON.stringify(config.data)` 会报错或者失效，必须在 `getPendingKey` 时排除 FormData 类型的参数校验，或者允许开发者在发起请求时传入自定义参数绕过查重拦截（`config.ignoreCancelToken = true`）。
