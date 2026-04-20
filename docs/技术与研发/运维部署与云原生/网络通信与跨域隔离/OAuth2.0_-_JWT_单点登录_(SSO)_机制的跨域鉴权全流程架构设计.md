# 探究 OAuth2.0 - JWT 单点登录 (SSO) 机制的跨域鉴权全流程架构设计

> **使用场景**：针对多子域名、多中心化业务体系的鉴权基建。解决“登录一次，到处通行”在跨域、安全性、令牌续约上的核心难点。

## 1. 探究动机 (Why Now?)

现在的 B 端业务复杂得离谱，一个主站挂着四五个二级域名的子系统（BI、CRM、Admin 等）。如果还守着传统的 Session + Cookie，光是处理 `SameSite` 策略和顶级域名下的 Cookie 共享就够喝一壶的。

*   **现状盲区**：以前觉得 SSO 就是把 Token 存到父域 Cookie 里。后来发现，当涉及到完全不同根域（例如 a.com 和 b.com）的单点登录时，常规 Cookie 方案直接报废。必须得有一套标准化的认证协议（CAS 或 OAuth2）加上无状态的 JWT 才能玩转。

## 2. 核心机制解构 (Mental Model)

### 核心链路 1：OAuth2.0 授权码模式 (Authorization Code)
这是目前最稳健的方案。
1.  用户访问子系统 A，发现没登录。
2.  子系统 A 重定向用户到认证中心 (SSO Center)。
3.  用户在认证中心登录成功，带上 `code` 跳回子系统 A。
4.  子系统 A 后端拿着 `code` 去认证中心换取 `access_token` (JWT)。

### 核心链路 2：JWT 的无状态校验
拿到 JWT 后，前端塞到 `Authorization: Bearer <token>` 头部。后端不再查数据库，直接解密验证签名、过期时间、权限位。

```javascript
// JWT 的结构就是：Header.Payload.Signature
// 专家提醒：千万别在 Payload 里放敏感信息（如密码），那是 base64 明文！
const jwt = require('jsonwebtoken');

// 后端验证逻辑极简版
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, user: decoded };
  } catch (err) {
    // 处理 TokenExpiredError 或 JsonWebTokenError
    return { valid: false, reason: err.message };
  }
};
```

## 3. 认知反转与横向对比 (Mental Shift & Comparison)

*   **认知刷新**：以前总纠结 `localStorage` 安全还是 `HttpOnly Cookie` 安全。现在明白了：安全没有绝对，只有场景。JWT 存 `localStorage` 虽然防不了 XSS，但它天生免疫 CSRF（因为不是 Cookie 自动携带）。对于跨域频发的现代架构，JWT 的灵活度完胜。
*   **横向对比**：
    *   **Session-based SSO**：强一致性，服务端随时可以踢人。缺点是：服务端有状态，不好扩容，跨域麻烦。
    *   **JWT-based SSO**：无状态，水平扩容极快。缺点是：令牌一旦发出去，服务端很难在有效期内使其强制失效（除非搞黑名单机制，但这又变相回到了有状态）。

## 4. 业务投影与延伸思考 (Extension)

*   **避坑指南 1：关于双令牌 (Access + Refresh Token)**
    为了平衡安全和体验，`Access Token` 设置短点（比如 15 分钟），`Refresh Token` 设置长点（比如 7 天）。前端要做静默续约逻辑：在拦截器里捕捉 401，然后用 `Refresh Token` 换个新的 `Access Token` 重发请求，用户无感知。
*   **避坑指南 2：退出登录的坑**
    SSO 退出不仅是清除当前子系统的 Token，还得重定向到 SSO 中心清除全局 Session，并利用 Back-channel 或广播机制通知其他子系统失效。
*   **延伸探索**：下一步研究 `BFF (Backend for Frontend)`。在 BFF 层统一处理鉴权转换，前端甚至可以不直接触碰 JWT，只跟 BFF 玩 Session，安全性更上一层楼。
