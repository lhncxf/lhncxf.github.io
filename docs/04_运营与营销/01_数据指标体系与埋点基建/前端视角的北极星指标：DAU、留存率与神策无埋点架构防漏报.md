# 前端视角的北极星指标：DAU、留存率与神策无埋点架构防漏报

> **使用场景**：作为从资深开发转向 Growth Hacking 的基础认知重塑。重点在于从 HTTP 协议、DOM 渲染和状态管理等前端底层逻辑，重新理解运营口中的“北极星指标”与“埋点基建”。

## 1. 探究动机 (Why Now?)

* **现状盲区**：过去 10 年，我眼中的数据只是接口返回的 JSON。PV 是页面跳转，UV 是统计 ID。但当业务进入存量竞争时代，前端必须理解数据背后的“增长逻辑”。如果埋点不准，所有的 A/B Test 和转化分析都是沙堆上的城堡。
* **认知断层**：我发现很多前端同学分不清 Sentry（错误监控）和 Sensors Data（行为分析）的本质区别。一个关注“死没死”，一个关注“活得好不好”。

## 2. 核心机制解构 (Mental Model)

### 2.1 基础指标的底层映射
从前端老炮视角看，所谓的指标不过是网络请求与本地存储的变体：
* **PV (Page View)**：本质是路由切换（SPA 中的 `hashchange` 或 `popstate`）触发的特定埋点请求。
* **UV (Unique Visitor)**：过去靠 Cookie，现在更多靠持久化的 `localStorage` 唯一标识或 Canvas 指纹。
* **DAU/MAU**：聚合后的结果。在前端看来，就是当天/当月内至少有一次携带有效 JWT Token 的活跃 Session。

### 2.2 转化漏斗与 DOM 验证
转化漏斗（Funnel）不是虚无的概念，它是用户在 DOM 节点上的路径演进。
以电商下单为例：
1. **View Step**：商品详情页渲染完成（`DOMContentLoaded`）。
2. **Action Step**：点击“立即购买”，触发购物车 API。
3. **Form Step**：收货地址表单的 `onChange` 校验与 `onSubmit` 提交。
4. **Success Step**：支付回调后的结果页展示。
**漏斗流失点排查**：前端要关注的是，哪一步因为 JS 报错或网络抖动（4xx/5xx）导致用户无法触达下一个 DOM 状态。

### 2.3 埋点架构：代码埋点 vs 无埋点
| 特性 | 代码埋点 (Manual) | 全埋点/无埋点 (Auto) |
| :--- | :--- | :--- |
| **底层实现** | `track('buy_click', { id: 123 })` | 劫持 `addEventListener` 或 `sendBeacon` |
| **精度** | 极高，可携带复杂业务上下文 | 较高，主要记录交互位置 (XPath) |
| **维护成本** | 高，随业务代码发版 | 低，一次部署长久生效 |
| **适用工具** | Google Analytics / 自建 SDK | Sensors Data (神策) / GrowingIO |

```javascript
// 无埋点 SDK 的核心伪代码：全局拦截点击事件
window.addEventListener('click', (e) => {
  const target = e.target;
  const xPath = getXPath(target); // 获取元素在 DOM 树中的唯一路径
  const content = target.innerText;
  
  // 自动上报，无需业务代码干预
  sensors.track('$WebClick', {
    $element_path: xPath,
    $element_content: content,
    $url: window.location.href
  });
}, true);
```

## 3. 认知反转与横向对比 (Mental Shift & Comparison)

* **认知刷新**：以前觉得“无埋点”是玄学，深入神策 SDK 源码后发现，它本质上是对浏览器底层 API（如 `History API`、`MutationObserver`）的深度 Hook。
* **防漏报策略**：
    * **Beacon 优先**：传统 XHR 在页面关闭时会被浏览器进程直接 kill。必须优先使用 `navigator.sendBeacon()`，它能保证请求在卸载时依然异步发出且不阻塞下个页面加载。
    * **持久化重试**：如果离线或上报失败，先存入 `IndexedDB`，待网络恢复或下次启动时静默补偿，这是解决“数据失真”的硬核手段。

## 4. 业务投影与延伸思考 (Extension)

* **业务指导**：在处理复杂营销活动时，不能只埋“成功”点。要在关键按钮的 `onClick` 第一行就埋下“尝试点击”点，通过“尝试点 - 接口成功点”的差值，精确反推接口性能导致的流失率。
* **延伸探索**：
    * 接下来需要研究 **可视化圈选** 的实现原理：如何通过后端的 DOM 快照在管理后台“点哪埋哪”。
    * 探索 **归因分析 (Attribution)**：前端如何通过 `document.referrer` 和 URL 参数（UTM）还原用户的完整流转链路。
