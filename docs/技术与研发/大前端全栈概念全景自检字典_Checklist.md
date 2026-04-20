# 大前端全栈概念全景自检字典 (Checklist)

> **专家注**：本文件为大前端全栈技能全景图，仅作为知识点自检清单（Checklist）。
> - **基础节点**：穷举基础知识树，证明“树上有这片叶子”。
> - **进阶/架构节点**：挂载**高质量外链**（MDN、官方文档、源码库）及**内链**（本地深度解析文章）。
> - **格式规范**：每个知识节点下的参考链接均拆分为独立子列表项，外链用 `🔗`，内链用 `📝`，方便后续不断追加。
> - **目标**：资深视角，覆盖 from 语言底座 to 云原生部署的全链路闭环。

## 1. 语言底座 (HTML/CSS/JS/TS)

### 1.1 JavaScript 核心与 V8 引擎
*   **变量、作用域与提升 (Hoisting)**
    *   🔗 [MDN: Hoisting (外链)](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)
*   **原型、原型链与继承机制**
    *   🔗 [MDN: Inheritance and the prototype chain (外链)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
    *   📝 [JavaScript_TypeScript_核心闭环.md (内链)](./01_前端开发/01_语言内核与基建重塑/JavaScript_TypeScript_核心闭环_从原型链_闭包陷阱到高阶类型体操的体系化梳理.md)
*   **闭包 (Closures) 与内存泄露**
    *   🔗 [MDN: Closures (外链)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
*   **事件循环 (Event Loop) 与宏任务/微任务**
    *   🔗 [HTML Spec: Event loops (外链)](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)
    *   📝 [高并发-高频交互下的事件循环.md (内链)](./01_前端开发/02_语言底座与高阶特性/高并发-高频交互下的事件循环_(Event_Loop)_调度与_Web_Worker_离线计算优化.md)
*   **V8 垃圾回收 (GC) 机制 (Scavenge/Mark-Sweep)**
    *   🔗 [V8 Blog: Trash talk (外链)](https://v8.dev/blog/trash-talk)
    *   📝 [V8_引擎垃圾回收机制与前端内存泄漏.md (内链)](./01_前端开发/02_语言底座与高阶特性/V8_引擎垃圾回收机制与前端内存泄漏全链路监控体系方案.md)
*   **Promise (A+ 规范) 与 Async/Await**
    *   🔗 [Promises/A+ Spec (外链)](https://promisesaplus.com/)
    *   📝 [Promise_A+规范与微任务调度的底层实现解构.md (内链)](./01_前端开发/02_语言底座与高阶特性/Promise_A+规范与微任务调度的底层实现解构.md)
*   **ES6+ 高阶：Generator/Proxy/Reflect**
    *   🔗 [MDN: Proxy (外链)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
    *   📝 [ES6_核心机制与进阶应用.md (内链)](./01_前端开发/02_语言底座与高阶特性/ES6_核心机制与进阶应用.md)

### 1.2 TypeScript 工程化
*   **基础类型与接口 (Interface/Type)**
    *   🔗 [TS Config: Everyday Types (外链)](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
*   **泛型编程 (Generics) 与类型推导**
    *   🔗 [TS Config: Generics (外链)](https://www.typescriptlang.org/docs/handbook/2/generics.html)
*   **高级类型体操 (Conditional/Mapped/Infer)**
    *   🔗 [TS Config: Conditional Types (外链)](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
    *   📝 [TypeScript_高级类型体操与工程实践.md (内链)](./01_前端开发/02_语言底座与高阶特性/TypeScript_高级类型体操与工程实践.md)
*   **装饰器 (Decorators) 与元数据 (Reflect-metadata)**
    *   🔗 [TS Config: Decorators (外链)](https://www.typescriptlang.org/docs/handbook/appendix/decorators.html)

### 1.3 HTML5 & CSS3 布局与性能
*   **语义化、A11y (无障碍) 与 SEO**
    *   🔗 [MDN: HTML semantic elements (外链)](https://developer.mozilla.org/en-US/docs/Glossary/Semantics#html_semantics)
    *   📝 [HTML_渲染核心与语义化重塑.md (内链)](./01_前端开发/01_语言内核与基建重塑/HTML_渲染核心与语义化重塑.md)
*   **CSS 盒模型、BFC 与 IFC 渲染上下文**
    *   🔗 [MDN: Introduction to the CSS box model (外链)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)
*   **现代布局：Flexbox 与 Grid 详解**
    *   🔗 [CSS-Tricks: A Complete Guide to Flexbox (外链)](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
*   **层叠上下文 (Stacking Context) 与 z-index**
    *   🔗 [MDN: Stacking context (外链)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context)
*   **渲染流水线：重排 (Reflow) 与重绘 (Repaint) 优化**
    *   🔗 [Web.dev: Minimize browser reflow (外链)](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/)
    *   📝 [CSS_渲染机制与架构演进.md (内链)](./01_前端开发/01_语言内核与基建重塑/CSS_渲染机制与架构演进.md)

---

## 2. 现代框架 (Vue/React 基础到源码)

### 2.1 Vue 生态 (Vue 2 & Vue 3)
*   **响应式原理：DefineProperty vs Proxy**
    *   🔗 [Vue3 Docs: Reactivity in Depth (外链)](https://vuejs.org/guide/extras/reactivity-in-depth.html)
    *   📝 [Vue3_响应式内核与编译时演进.md (内链)](./01_前端开发/03_框架内核与生态/Vue3_响应式内核与编译时演进.md)
*   **虚拟 DOM 与 Diff 算法 (双端比较 vs 快速 Diff)**
    *   🔗 [Vue Source: core/renderer.ts (外链)](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/renderer.ts)
    *   📝 [Vue2与3及React响应式与渲染机制源码级横评.md (内链)](./01_前端开发/03_框架内核与生态/Vue2与3及React响应式与渲染机制源码级深度横评.md)
*   **模板编译优化：Static Hoisting/PatchFlag**
    *   🔗 [Vue SFC Playground (外链)](https://play.vuejs.org/)
*   **状态管理：Vuex vs Pinia (竞态与持久化)**
    *   🔗 [Pinia Docs (外链)](https://pinia.vuejs.org/)
    *   📝 [万行级项目中状态管理的竞态控制.md (内链)](./01_前端开发/03_框架内核与生态/万行级项目中状态管理_(Pinia-Redux)_的竞态控制与读写性能瓶颈突破.md)
*   **组件通信与生命周期 (Composition API)**
    *   🔗 [Vue3 Docs: Composition API FAQ (外链)](https://vuejs.org/guide/extras/composition-api-faq.html)

### 2.2 React 生态
*   **JSX 原理与不可变数据声明**
    *   🔗 [React Docs: Describing the UI (外链)](https://react.dev/learn/describing-the-ui)
*   **Hooks 架构：useState/useEffect 闭包陷阱**
    *   🔗 [React Docs: Hooks (外链)](https://react.dev/reference/react/hooks)
    *   📝 [React_Hooks架构与闭包陷阱.md (内链)](./01_前端开发/03_框架内核与生态/React_Hooks架构与闭包陷阱.md)
*   **Fiber 调度架构：Lane 模型与时间分片**
    *   🔗 [React Source: ReactFiberLane.js (外链)](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberLane.js)
    *   📝 [React_Fiber与Concurrent并发架构源码级调度解析.md (内链)](./01_前端开发/03_框架内核与生态/React_Fiber与Concurrent并发架构源码级调度解析.md)
*   **Concurrent Mode 与 Suspense 渲染并发控制**
    *   🔗 [React Docs: Transitions (外链)](https://react.dev/reference/react/useTransition)
    *   📝 [React_Fiber与Concurrent并发架构源码级调度解析.md (内链)](./01_前端开发/03_框架内核与生态/React_Fiber与Concurrent并发架构源码级调度解析.md)
*   **SSR/SSG：Next.js 与 React Server Components (RSC)**
    *   🔗 [Next.js Docs: Rendering (外链)](https://nextjs.org/docs/app/building-your-application/rendering)
    *   📝 [SSR_服务端渲染的_Node.js_内存泄露排查.md (内链)](./01_前端开发/03_框架内核与生态/SSR_(Nuxt-Next)_服务端渲染 of Node.js 内存泄露排查与首屏 TTFB 极限优化.md)

---

## 3. 跨端、多端与边缘技术 (H5/小程序/RN/Electron)

### 3.1 移动端 H5 与 响应式适配
*   **Viewport 视口、Rem/Vw 适配方案**
    *   🔗 [Web.dev: Responsive Design (外链)](https://web.dev/learn/design/)
    *   📝 [跨端与多端架构体系志_响应式H5.md (内链)](./01_前端开发/01_语言内核与基建重塑/跨端与多端架构体系志_响应式H5_微信小程序底层_RN与uni-app跨端方案的生命周期与性能天花板对比.md)
*   **移动端 300ms 延迟、Retina 屏 1px 实现**
    *   🔗 [MDN: Mobile touch events (外链)](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

### 3.2 微信小程序
*   **双线程架构：Logic Layer vs View Layer**
    *   🔗 [微信小程序官方文档: 运行机制 (外链)](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/mechanisms.html)
    *   📝 [微信小程序底层渲染机制：setData阻塞治理.md (内链)](./01_前端开发/06_跨端与多端底层架构/微信小程序底层渲染机制：双线程通信带来的_setData_阻塞问题与终极解决思路.md)
*   **setData 原理与渲染性能极限调优**
    *   🔗 [微信小程序官方文档: 性能优化 (外链)](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/tips.html)

### 3.3 React Native & Uni-app
*   **RN 架构：JSI/Fabric 渲染引擎演进**
    *   🔗 [React Native Docs: New Architecture (外链)](https://reactnative.dev/docs/the-new-architecture-intro)
    *   📝 [UniApp与ReactNative架构对比.md (内链)](./01_前端开发/06_跨端与多端底层架构/UniApp与ReactNative架构对比与技术选型防坑指南.md)
*   **Uni-app 跨端原理与 Vue 开发体验优化**
    *   🔗 [DCloud Docs: Uni-app 框架原理 (外链)](https://uniapp.dcloud.net.cn/tutorial/architecture.html)

### 3.4 桌面端与 PWA
*   **Electron 进程间通信 (IPC) 与主/渲染进程架构**
    *   🔗 [Electron Docs: Inter-Process Communication (外链)](https://www.electronjs.org/docs/latest/tutorial/ipc)
    *   📝 [PWA_-_Electron_进程间通信耗时优化.md (内链)](./01_前端开发/06_跨端与多端底层架构/PWA_-_Electron_桌面级前端应用的探索与进程间_(IPC)_通信耗时优化.md)
*   **PWA：Service Worker、Manifest 与离线缓存**
    *   🔗 [MDN: Progressive web apps (外链)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

---

## 4. 前端工程化 (Webpack/Vite/规范/微前端/低代码)

### 4.1 构建工具链
*   **Webpack：Loader/Plugin 机制与 HMR 原理**
    *   🔗 [Webpack Docs: Concepts (外链)](https://webpack.js.org/concepts/)
    *   📝 [现代前端构建体系原理与调优.md (内链)](./01_前端开发/04_前端工程化与组件化/现代前端构建体系原理与调优：Webpack到Vite的平滑过渡.md)
*   **Vite：Esbuild 预构建与 No-bundle 机制**
    *   🔗 [Vite Docs: Why Vite (外链)](https://vitejs.dev/guide/why.html)
*   **Rust 赋能：SWC 与 Rspack 高性能构建**
    *   🔗 [Rspack Docs (外链)](https://www.rspack.dev/)
    *   📝 [Rust_工具链生态对前端工程化构建的打击.md (内链)](./05_AI与前沿探索/04_前端计算极限探索/Rust_工具链生态_(SWC_-_Rspack)_对前端工程化构建降维打击的持续追踪.md)

### 4.2 工程规范与包管理
*   **Monorepo 架构：pnpm workspace 与 Turborepo**
    *   🔗 [pnpm Docs: Workspaces (外链)](https://pnpm.io/workspaces)
    *   📝 [定制化_UI_组件库基于_Monorepo_的包管理.md (内链)](./01_前端开发/04_前端工程化与组件化/定制化_UI_组件库的从_0_到_1：基于_Monorepo_的包管理与自动化按需加载设计.md)
*   **代码质量控制：ESLint/Prettier/Husky 自动化链路**
    *   🔗 [Husky Docs (外链)](https://typicode.github.io/husky/)
    *   📝 [万行级代码防腐化：基于_ESLint-Husky-Prettier.md (内链)](./01_前端开发/04_前端工程化与组件化/万行级代码防腐化：基于_ESLint-Husky-Prettier_的深度定制化拦截与_CI-CD....md)

### 4.3 架构高级模式
*   **微前端：Qiankun 沙箱隔离与 Single-spa**
    *   🔗 [Qiankun Docs (外链)](https://qiankun.umijs.org/)
    *   📝 [微前端(qiankun&wujie)架构拆分实战.md (内链)](./03_系统架构与设计模式/02_分布式与微前端深度治理/微前端(qiankun&wujie)架构拆分实战与技术债治理.md)
*   **低代码 (Low-Code)：JSON Schema 协议与物料系统**
    *   🔗 [JSON Schema Spec (外链)](https://json-schema.org/)
    *   📝 [低代码平台：JSON_Schema_渲染引擎架构.md (内链)](./03_系统架构与设计模式/03_复杂业务系统全链路设计/低代码_(Low-Code)_平台：JSON_Schema_渲染引擎与组件物料协议架构设计.md)

---

## 5. 服务端与全栈 (Node.js/Nest/MySQL/Redis/MQ)

### 5.1 Node.js 服务端内核
*   **Event Loop、Libuv 线程池与 I/O 模型**
    *   🔗 [Node.js Docs: Event Loop (外链)](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
    *   📝 [NodeJS_事件驱动机制与架构演进.md (内链)](./02_后端开发与中间件/02_服务端语言与框架/NodeJS_事件驱动机制与架构演进.md)
*   **Buffer、Stream 与文件处理**
    *   🔗 [Node.js Docs: Stream (外链)](https://nodejs.org/api/stream.html)
*   **Nest.js：IoC 控制反转、DI 注入与 AOP 切面**
    *   🔗 [Nest.js Docs: Overview (外链)](https://docs.nestjs.com/)
    *   📝 [Nest.js_-_Express.js_架构设计.md (内链)](./02_后端开发与中间件/02_服务端语言与框架/Nest.js_-_Express.js_架构设计：中间件洋葱模型与企业级异常拦截链路.md)
*   **BFF 层：数据裁剪、聚合与 GraphQL**
    *   🔗 [GraphQL Docs (外链)](https://graphql.org/)
    *   📝 [BFF层(Node.js)架构设计与业务聚合实战.md (内链)](./02_后端开发与中间件/02_服务端语言与框架/BFF层(Node.js)架构设计与业务聚合实战.md)

### 5.2 数据库与中间件
*   **MySQL：索引优化 (B+ Tree)、事务隔离级别 (MVCC)**
    *   🔗 [MySQL Docs: InnoDB Locking and Transaction Model (外链)](https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-model.html)
    *   📝 [复杂业务的事务隔离级别场景分析.md (内链)](./02_后端开发与中间件/03_关系型数据库进阶/复杂业务的事务隔离级别：幻读-脏读场景分析与乐观锁-悲观锁在订单状态防刷中的应用.md)
*   **Redis：数据结构与缓存三剑客 (击穿/穿透/雪崩)**
    *   🔗 [Redis Docs (外链)](https://redis.io/docs/)
    *   📝 [缓存击穿、穿透与雪崩的防御与兜底.md (内链)](./02_后端开发与中间件/04_缓存架构与海量数据/缓存击穿、缓存穿透与缓存雪崩的系统级防御与兜底预案.md)
*   **消息队列 (MQ)：RabbitMQ/Kafka 异步削峰与消息幂等性**
    *   🔗 [RabbitMQ Docs (外链)](https://www.rabbitmq.com/getstarted.html)
    *   📝 [消息防丢失设计与幂等性消费一致性保障.md (内链)](./02_后端开发与中间件/05_消息队列架构实战/消息防丢失设计、幂等性消费在前端状态回流中的一致性保障.md)

---

## 6. DevOps 与架构 (Nginx/Docker/K8s/CI-CD/安全)

### 6.1 网络通信与安全
*   **HTTP 协议演进：HTTP/1.1 -> 2 -> 3 (QUIC)**
    *   🔗 [Cloudflare Blog: HTTP/3 (外链)](https://blog.cloudflare.com/http3-the-past-present-and-future/)
*   **WebSocket 与 WebRTC 低延迟通信**
    *   🔗 [MDN: WebRTC API (外链)](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
    *   📝 [WebRTC与WebSocket在低延迟通信中的架构.md (内链)](./04_运维部署与云原生/01_网络通信与跨域隔离/WebRTC与WebSocket在低延迟音视频通信中的架构演进.md)
*   **前端安全防护：XSS、CSRF、CSP 与 JWT 鉴权**
    *   🔗 [OWASP Top Ten (外链)](https://owasp.org/www-project-top-ten/)
    *   📝 [前端防高维攻击与CSP策略.md (内链)](./01_前端开发/05_性能优化与安全/前端防高维攻击：基于_BFF_层的反_XSS-CSRF_终极方案与_CSP_内容安全策略.md)

### 6.2 Nginx 与服务器运维
*   **Nginx：反向代理、负载均衡与 Gzip 调优**
    *   🔗 [Nginx Docs: Beginner's Guide (外链)](https://nginx.org/en/docs/beginners_guide.html)
    *   📝 [前端视角的Nginx高阶配置.md (内链)](./04_运维部署与云原生/04_服务器运维监控预警/前端视角的Nginx高阶配置与线上异常监控(Sentry)闭环.md)
*   **Linux 系统：文件系统、进程管理与并发压测**
    *   🔗 [Linux Journey (外链)](https://linuxjourney.com/)
    *   📝 [服务器并发资源压测与Node.js进程级监控.md (内链)](./04_运维部署与云原生/04_服务器运维监控预警/服务器并发资源压测_(JMeter)_与_Node.js_进程级性能监控预警闭环.md)

### 6.3 容器化与 CI/CD
*   **Docker：镜像瘦身、多阶段构建 (Multi-stage)**
    *   🔗 [Docker Docs: Multi-stage builds (外链)](https://docs.docker.com/build/building/multi-stage/)
    *   📝 [前端_Docker_镜像极致瘦身与多阶段构建.md (内链)](./04_运维部署与云原生/02_容器化高阶部署/前端_Docker_镜像极致瘦身与多阶段构建_(Multi-stage_build)_实战.md)
*   **Kubernetes (K8s)：Pods、Service 与回滚策略**
    *   🔗 [K8s Docs: Concepts (外链)](https://kubernetes.io/docs/concepts/)
    *   📝 [K8s_基础拓扑与前端高可用部署回滚策略.md (内链)](./04_运维部署与云原生/02_容器化高阶部署/K8s_(Kubernetes)_基础拓扑认知：Pods、节点调度、前端容器化部署的高可用回滚策略.md)
*   **CI/CD：GitHub Actions 与 GitLab CI 流水线定制**
    *   🔗 [GitHub Actions Docs (外链)](https://docs.github.com/en/actions)
    *   📝 [GitOps与企业级CI-CD流水线定制.md (内链)](./04_运维部署与云原生/03_自动化流水线演练/GitOps与企业级CI-CD流水线的深度定制化实战.md)
