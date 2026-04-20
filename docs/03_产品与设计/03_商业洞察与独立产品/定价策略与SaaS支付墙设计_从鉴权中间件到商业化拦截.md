# 定价策略与SaaS支付墙设计：从鉴权中间件到商业化拦截

> **使用场景**：针对 10 年资深前端背景的独立开发者，将 SaaS 产品的商业化设计（定价、支付墙、试用模式）映射为熟悉的工程架构（路由守卫、鉴权中间件、RBAC 权限控制），实现从“写代码”到“做产品”的思维重构。

## 1. 痛点与需求场景 (Context)
* **原始痛点**：开发者习惯于 `if (isLoggedIn)` 的二元逻辑，但在 SaaS 商业化场景下，权限是多维且动态的。硬编码（Hard-coding）支付逻辑会导致：
    * **逻辑耦合**：支付墙逻辑散落在业务组件中，修改定价方案需要重构整个 UI 层。
    * **鉴权漏洞**：仅在前端拦截路由，未在 BFF (Backend For Frontend) 或 API 层做强一致性校验。
    * **转化率黑洞**：支付墙弹出时机生硬，缺乏像“平滑滚动”一样的用户体验，导致用户直接“关闭标签页”。
* **预期目标**：将支付墙视为一种**高级路由守卫 (Advanced Router Guard)**，实现：
    * **声明式权限**：通过配置 `tier: 'pro'` 自动拦截受限资源。
    * **动态拦截**：支持“试用期 (Trial)”、“配额制 (Quota)”等复杂状态的实时反馈。
    * **灰度实验室**：像 A/B 测试一样快速调整定价文案与权益组合，无需重新部署代码。

## 2. 核心架构与设计思路 (Design & Best Practice)
* **思路解析**：
    * **商业化即中间件 (Business logic as Middleware)**：不要在组件内写 `showPaywall`。应在全局状态（Pinia/Redux）中维护 `userContext`，并在路由守卫 `beforeEach` 中注入支付墙逻辑。
    * **RBAC 模型的扩展**：将传统 RBAC (Role-Based Access Control) 升级为 **PBAC (Pricing-Based Access Control)**。角色不再是 `admin/user`，而是 `free/basic/pro/enterprise`。
    * **支付墙作为“边缘情况” (Edge Case Management)**：支付墙不是错误弹窗，而是一个特殊的组件状态。设计时需考虑：
        * **拦截 (Intercept)**：未支付时阻止 Action。
        * **引导 (Upsell)**：展示差异化的 Feature Matrix（功能矩阵）。
        * **降级 (Fallback)**：支付失败或过期时的只读模式。

## 3. 开箱即用：核心架构骨架 (Implementation)

### 3.1 声明式支付墙守卫 (Vue/React Pseudo-code)
```typescript
// router/guards.ts
router.beforeEach(async (to, from, next) => {
  const { tier, status } = useUserStore();
  
  // 1. 检查页面是否需要 Pro 权限 (类似于 meta: { requiresAuth: true })
  if (to.meta.requiresPro && tier !== 'pro') {
    // 2. 触发支付墙拦截，而不是简单的 redirect
    // 保持当前 URL，但在 UI 上层覆盖支付组件
    payloadStore.openPaywall({
      feature: to.name,
      context: 'route_gate'
    });
    return next(false); // 终止跳转
  }
  
  next();
});
```

### 3.2 商业化拦截中间件 (BFF/Node.js)
```javascript
// middleware/paywall.js
export const checkQuota = (featureKey) => {
  return async (req, res, next) => {
    const { user } = req;
    const usage = await getUsage(user.id, featureKey);
    const limit = PLAN_LIMITS[user.tier][featureKey];

    // 逻辑类似于速率限制 (Rate Limiting)
    if (usage >= limit) {
      return res.status(402).json({
        code: 'PAYMENT_REQUIRED',
        message: `${featureKey} quota exceeded`,
        upgradeUrl: '/pricing'
      });
    }
    next();
  };
};
```

## 4. 边界情况与避坑补充 (Edge Cases & Gotchas)
* **缓存一致性 (Cache Invalidation)**：用户支付成功后，必须立即刷新 `userContext`。不要等待 Token 自然过期，应手动触发 `fetchUserInfo` 或使用 WebSocket 推送状态变更，否则用户会陷入“我付了钱为什么还没权限”的循环。
* **暗度陈仓 (Feature Flagging)**：新功能上线时，先通过 Feature Flag 对所有用户开放。验证稳定后，再一键切入“支付墙”拦截。这相当于在生产环境做“热插拔”商业化。
* **本地状态与服务端真实性**：前端 UI 负责“好看的引导”，后端中间件负责“严谨的拦截”。永远不要相信前端传来的 `isPro: true`，所有敏感操作必须回源校验 `stripe_customer_id`。
* **试用期倒计时 (Trial Logic)**：试用期结束不是一个 Boolean 状态，而是一个 `time_left` 变量。在 UI 上应展示“剩余 3 天”，这种**紧迫感 (Urgency)** 的状态反馈比直接拦截转化率高出 30% 以上。
