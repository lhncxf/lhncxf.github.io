# 单点实战与最佳实践 [前端防高维攻击：基于 BFF 层的反 XSS/CSRF 终极方案与 CSP 内容安全策略]

> **使用场景**：在金融、政务、电商等高安全要求的项目中，仅仅依靠前端框架（如 React/Vue）自带的 HTML 转义是不够的。必须通过 BFF（Node.js）层建立统一的安全拦截防线，并配合浏览器的 CSP（Content Security Policy）头，彻底阻断跨站脚本（XSS）和跨站请求伪造（CSRF）攻击。

## 1. 痛点与需求场景 (Context)
* **原始痛点**：
  - **XSS 漏网之鱼**：虽然 Vue/React 默认转义了数据绑定（`{{}}`），但如果使用了 `v-html`、`dangerouslySetInnerHTML`、或者在富文本编辑器中直接渲染后端返回的脏数据，很容易被注入 `<script>恶意代码</script>`，导致用户 Cookie 被窃取。
  - **CSRF 钓鱼攻击**：用户的登录态（Cookie）在浏览器中。黑客诱导用户点击钓鱼网站上的一个按钮，该按钮暗中往真正的银行接口发送了转账 POST 请求（浏览器会自动带上银行的 Cookie），导致资金被盗。
* **预期目标**：
  - **XSS 防御**：BFF 层对所有入参/出参进行 DOMPurify 净化；前端配置强 CSP 策略。
  - **CSRF 防御**：摒弃传统的同步 Cookie，改用基于 Token 的验证，或者配置严格的 SameSite Cookie 策略配合 CSRF Token 防御机制。

## 2. 核心架构与设计思路 (Design & Best Practice)
* **纵深防御 (Defense in Depth)**：
  - 第一道防线（浏览器）：通过 HTTP Header 设置 `Content-Security-Policy`，直接从浏览器底层禁止加载非白名单域名的脚本，甚至禁止内联脚本（`unsafe-inline`）。
  - 第二道防线（BFF 拦截器）：在网关层使用 XSS 过滤器，对所有 Payload 进行标签清洗，过滤 `javascript:`、`onerror=` 等危险属性。
  - 第三道防线（Cookie 策略）：敏感的身份凭证（如 JWT）若存在 Cookie 中，必须设置 `HttpOnly`（防 XSS 窃取）和 `SameSite=Strict/Lax`（防 CSRF 跨域发送）。

## 3. 开箱即用：核心代码骨架 (Implementation)

### 3.1 BFF 层 (Node.js) XSS 终极净化中间件

在 Express/NestJS 中接入 `xss` 或 `DOMPurify` 库，对所有传入的 JSON 请求体进行递归净化。

```javascript
// Express 中间件：xss-cleaner.js
const xss = require('xss');

// 配置允许的白名单（对于富文本，可以放开 p, span, img 等，但彻底封杀 script, iframe）
const xssOptions = {
  whiteList: {
    p: ['style'],
    img: ['src', 'alt'],
    b: [],
    strong: []
  },
  stripIgnoreTagBody: ['script', 'style'] // 把 <script>内容</script> 整个删掉
};

const xssCleaner = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    // 递归遍历清理对象
    const cleanObject = (obj) => {
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string') {
          obj[key] = xss(obj[key], xssOptions);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          cleanObject(obj[key]);
        }
      });
    };
    cleanObject(req.body);
  }
  next();
};

app.use(express.json());
app.use(xssCleaner); // 挂载到全局
```

### 3.2 Nginx/BFF 下发强劲的 CSP (内容安全策略) 头

通过在响应头注入 `Content-Security-Policy`，告诉浏览器：“只允许执行来自本域名和信任 CDN 的脚本”。这是防 XSS 的核武器。

```nginx
# nginx.conf 生产环境配置
server {
    listen 443 ssl;
    server_name myapp.com;

    # 核心：配置 CSP
    # default-src 'self' : 默认只能加载同源资源
    # script-src 'self' https://cdn.trusted.com : 允许同源和受信任 CDN 的 JS，禁止内联 <script>
    # object-src 'none' : 禁止 Flash 等插件
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://cdn.trusted.com; img-src 'self' data: https://oss.trusted.com; object-src 'none'; frame-ancestors 'none';" always;

    # 附赠：防点击劫持（Clickjacking），禁止 iframe 嵌套我们的页面
    add_header X-Frame-Options "DENY" always;
    
    # 附赠：禁止浏览器 MIME 类型嗅探（防脚本伪装攻击）
    add_header X-Content-Type-Options "nosniff" always;
}
```

### 3.3 CSRF 防御：SameSite Cookie 与 CSRF Token 混合双打

如果你的身份认证依赖 Cookie：

**1. 后端 Set-Cookie 时的基建级配置：**
```javascript
res.cookie('sessionId', token, {
  httpOnly: true, // XSS 无法通过 document.cookie 获取
  secure: true,   // 仅 HTTPS 传输
  sameSite: 'Strict', // 核心：跨站请求（即使是从别人网站点击跳过来的）绝对不带此 Cookie，彻底阻断 CSRF
  maxAge: 3600000
});
```

**2. 传统站点的 CSRF Token 方案 (备用)：**
如果业务强制要求 `sameSite: 'None'`（比如跨域单点登录），则必须在前端所有 POST 请求 Header 中附带防御标识：
- 前端读取 Cookie 中的 `csrf_token` 字段。
- 将其放入 HTTP Header `X-CSRF-Token: <token>` 中。
- 后端校验 Header 中的 Token 与 Cookie 中的 Token 是否一致。钓鱼网站无法读取同源 Cookie，所以无法伪造 Header，从而被拦截。

## 4. 边界情况与避坑补充 (Edge Cases & Gotchas)
* **CSP 误伤内联脚本 (Inline Scripts)**：如果你配置了强 CSP（不含 `unsafe-inline`），那么你 HTML 中的 `<script>window.INIT_DATA={}</script>` 也会被浏览器拦截报错。**解法**：为这个内联脚本生成一个动态 Hash 或 Nonce，后端渲染时带上：`<script nonce="随机字符串">`，并在 CSP 头中加入 `'nonce-随机字符串'`，这样既放行了安全内联，又干掉了 XSS 注入的内联。
* **SSR 带来的二次 XSS 风险**：在使用 Nuxt/Next.js 做服务端渲染时，后端把 Redux Store 作为全局变量注入到 HTML 字符串里（脱水阶段）。如果存入 Store 的用户名含有 `</script><script>alert(1)</script>`，会导致服务端渲染出的 HTML 被截断执行恶意代码。**解法**：在 SSR 把状态转为字符串注入时，必须使用 `serialize-javascript` 或通过 HTML entity 转义处理 JSON 字符串。
