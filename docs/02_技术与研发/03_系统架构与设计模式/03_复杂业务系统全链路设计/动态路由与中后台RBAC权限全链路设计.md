# 🛠️ 复杂业务系统全链路设计：动态路由与中后台RBAC权限全链路设计

> **使用场景**：在主导 B 端中后台（如 ERP、CRM）的从零搭建或架构升级时，前端必然要面对的“地狱级”权限管控问题。本文从经典的 RBAC（基于角色的权限访问控制）模型出发，拆解从登录、获取菜单树、动态路由注册，到按钮级细粒度权限管控的完整闭环。

## 📌 一、 业务背景与技术痛点 (Context & Pain Points)
*如果所有页面的路由都写死在前端，那这就叫“玩具系统”。*
* **历史包袱**：一个 100 多页面的 B 端后台，新来的实习生为了图快，把路由全部在 `router/index.js` 注册成了静态数组。左侧菜单也是写死的一级一级 `v-if="role === 'admin'"`。后来业务方要求：财务只能看前两列菜单，运营只能看第三列，还要能根据用户动态隐藏“删除”按钮。于是代码里到处都是 `v-if="role.includes('caiwu') || role.includes('yunying')"`。
* **选型诉求**：我们需要一套真正的“菜单、路由、页面、按钮”四位一体的动态权限架构。后端管理权限树，前端负责消费权限。即使用户通过 URL 强行访问没权限的页面，也会在路由守卫处被拦截踢出。这就是中后台基建的灵魂。

## 💡 二、 架构选型与核心难点 (Architecture & Challenges)
*前端到底该怎么管路由？两种流派的终极对决。*

### 2.1 纯后端主导流派（后端下发整棵路由配置树）
后端接口直接返回一个巨大的 JSON 数组，里面包含了 `{ path: '/user', component: 'views/user/index.vue', title: '用户管理' }` 这种完全耦合前端代码结构的配置。
*   *痛点*：这种方案极其死板。前端重构改了组件路径，后端必须跟着改库里的配置；如果是本地开发阶段后端还没配菜单，前端连页面都打不开，开发体验如同吃屎。

### 2.2 推荐架构：前端主导路由全集映射，后端下发权限码 (Code/Key)
**大厂中后台标准范式**：前端的 `router.js` 里维护着整个系统**所有可能存在**的动态路由表（通常挂载在 Vue Router 的 `asyncRoutes` 常量里），但**初始化时绝不把它们挂载到 router 实例上**。

1.  **用户登录拿 Token**：先走 Login 接口。
2.  **获取权限码 (Permission Codes)**：紧接着走 `getUserInfo` 接口，后端返回该用户拥有权限的标识集合（如 `['USER_VIEW', 'ORDER_EDIT']`）。
3.  **前端本地过滤与动态注入 (`addRoute`)**：在全局路由守卫（`beforeEach`）中，前端拿后端的 `['USER_VIEW']` 数组，去和本地的 `asyncRoutes` 全集进行递归比对（通过路由 `meta.roles` 或 `meta.code` 匹配）。过滤出一棵“该用户专属的干净路由树”。
4.  **注册与渲染**：调用 `router.addRoute()` 把这棵干净的树挂载进实例，最后把树存进 Pinia 渲染成左侧菜单。

### 2.3 RBAC 模型在后端的底层投影 (Role-Based Access Control)
要想前端接得舒服，后端数据库必须严格遵循 RBAC：
*   **用户表 (User)**：张三。
*   **角色表 (Role)**：超级管理员、财务总监。张三被赋予“财务总监”角色。
*   **权限表 (Permission/Menu)**：菜单级（页面URL）、按钮级（新增/删除标记）。“财务总监”角色绑定了哪些权限。
最终，前端完全不需要知道张三是不是“财务总监”，前端只看张三有没有 `ORDER_EDIT` 这个具体的权限点，彻底解耦了具体角色和前端逻辑。

```javascript
// 极简伪代码：全局前置守卫中的权限流转与拦截 (Vue Router 4)
router.beforeEach(async (to, from, next) => {
  const token = getToken();
  if (!token) {
    if (to.path === '/login') return next();
    return next(`/login?redirect=${to.path}`); // 没登录滚去登录
  }

  // 已经登录，但还没拉取权限字典（通常是刚刷新页面）
  if (userStore.permissions.length === 0) {
    try {
      // 1. 获取后端下发的权限码 ['USER_VIEW', 'ORDER_EDIT']
      const { permissions } = await userStore.getInfo();
      
      // 2. 根据权限码，递归过滤本地的 asyncRoutes
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions);
      
      // 3. 把过滤后的这棵干净的树，动态注入到 vue-router 实例中
      accessedRoutes.forEach(route => router.addRoute(route));
      
      // 4. Hack 技巧：因为 addRoute 是异步的，必须用 replace，否则可能白屏
      next({ ...to, replace: true });
    } catch (error) {
      // 拉取失败（Token过期等），清空踢回登录页
      userStore.resetToken();
      next('/login');
    }
  } else {
    next(); // 已经拉过权限并注好路由了，放行
  }
});
```

## 🔖 三、 认知反转与最佳实践 (Mental Shift & Best Practices)
*中后台踩坑大赏。*

1.  **按钮级别的细粒度管控（自定义指令 `v-has`）**
    *   页面进得去，但页面里那个刺眼的“强制删除”红色按钮，普通员工绝对不能点，甚至连看都不能看。
    *   **解法**：绝对不要写 `v-if="permissions.includes('DELETE')"`。写一个全局自定义指令 `v-permission`。在指令的 `mounted` 钩子里判断如果没权限，直接操作 DOM `el.parentNode.removeChild(el)` 强行拔掉这个按钮。
2.  **页面刷新 404 (404 Page Refresh Trap)**
    *   **痛点**：用户在 `/user/detail` 页面按 F5 刷新，结果页面直接变成了 404 Not Found。
    *   **解法**：因为刷新那一瞬间，Vue 程序重新执行，`router` 实例里只有死写的 `/login` 等基础静态路由。而动态的 `/user/detail` 路由要等走完 `beforeEach` 调接口、`addRoute` 之后才存在。如果你在初始化时配了个全局的通配符 `path: '/:catchAll(.*)', component: 404`，一刷新就被它捕获了。**必须把 404 通配符路由，放在动态 `addRoute` 的最后面才推进去。**

## 📝 四、 业务投影与延伸思考 (Extension)
*   **延伸思考：服务端渲染 (SSR) 场景下的权限鉴权**：在 Nuxt 或 Next.js 中做中后台（虽然很少见，但比如做带 SEO 的门户后台）。由于首屏是 Node.js 直接吐出的 HTML，那么你在客户端 `beforeEach` 里的拦截逻辑就晚了。必须把获取用户信息和权限路由的比对，前置到服务端的 `getServerSideProps` 或中间件（Middleware）去执行，如果在服务端发现没权限，直接 302 重定向走人，连首屏 HTML 都不吐给黑客。

## 🎯 五、 行动清单 (Actionable Checklist)
* [ ] 审查目前项目中左侧菜单树的渲染数据源。如果是后端直接吐出的、带着前端组件物理路径的僵硬 JSON，立刻提一个重构提案：把路由字典改由前端维护，后端只吐权限码数组。
* [ ] 在全局自定义一个 `v-auth="['sys:user:add']"` 的指令，替换掉页面上散落的几百个丑陋的 `v-if` 权限判断逻辑，感受一下中后台代码工程化的纯净。
