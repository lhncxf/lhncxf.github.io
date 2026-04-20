# 🛠️ 单点实战与最佳实践：定制化 UI 组件库的从 0 到 1（基于 Monorepo 的包管理与自动化按需加载设计）

> **使用场景**：在公司业务发展到多条产品线（如 B 端后台、C 端小程序、H5 营销页）时，为了统一视觉规范和交互体验，前端团队必须沉淀一套属于自己的企业级 UI 组件库。本文记录了从零搭建一个类似 Element Plus / Ant Design 的现代化组件库的核心架构设计与工程化避坑指南。

## 📌 一、 业务背景与技术痛点 (Context & Pain Points)
*为什么不直接用开源的，非要自己造轮子？*
* **历史包袱**：公司一直用着 Element UI，但设计师觉得默认的主题太“土”，于是我们在业务代码里写了无数的 `/deep/` 和 `!important` 强行覆盖样式。久而久之，业务代码里混杂了大量的重复组件封装（如：带公司特色上传逻辑的 `CustomUpload`），新人接手完全不知道该用哪个。
* **开发协同灾难**：如果把组件提取到一个单独的 Git 仓库（多仓 Multi-repo），每次修改一个小 Bug，都要经历：改代码 -> 提交 -> 发 npm 包 -> 回到业务项目 -> `npm update` -> 发现没修好 -> 继续循环。这种跨仓库的割裂感直接让开发效率降至冰点。
* **选型诉求**：我们需要一个能同时管理“组件库本体”、“官方文档站点”以及“内部测试 Demo”的架构（Monorepo），并且产出的 npm 包必须支持完美的 Tree-Shaking（按需加载），不能让引入一个 Button 就把整个库 500KB 的代码全打进去。

## 💡 二、 架构选型与核心难点 (Architecture & Challenges)
*造轮子的核心不是写一个炫酷的 Button，而是构建一套完美的“生产流水线”。*

### 2.1 Monorepo 基建：pnpm workspace 与 Turborepo
抛弃 Lerna，全面拥抱 **pnpm workspace**。
*   **依赖扁平化与幽灵依赖防御**：pnpm 的 `node_modules` 软链接机制天生解决了多个包（packages）之间依赖版本冲突的问题，且比 Yarn/npm 安装快得多。
*   **目录结构规划**：
    ```text
    my-ui-monorepo/
    ├── packages/
    │   ├── components/   # 组件核心代码 (导出所有的 Button, Input)
    │   ├── theme-chalk/  # 独立的 CSS/Sass 样式包 (解耦逻辑与样式)
    │   ├── utils/        # 公共工具函数 (防抖、深拷贝)
    │   └── hooks/        # 独立的 Composition API (Vue3) 或 React Hooks
    ├── docs/             # 基于 VitePress/Dumi 的官方文档站点
    └── play/             # 基于 Vite 的本地开发调试靶场 (Playground)
    ```
*   **Turborepo 构建加速**：当我们在根目录运行 `pnpm build` 时，Turborepo 会根据包之间的依赖拓扑图（比如 `components` 依赖 `utils` 和 `theme-chalk`），聪明地决定编译顺序，并把未修改的包直接走本地缓存（Cache Hit），将构建时间从分钟级压缩到秒级。

### 2.2 打包产物与 ESM/CJS 的抉择 (Vite / Rollup)
组件库的打包和业务项目的打包（通常用 Webpack/Vite 直接打成一个体积巨大的 `dist/index.js`）完全不同。
组件库必须输出两种格式，以兼容现代浏览器和老旧的 Node.js/SSR 环境：
1.  **ESM (ECMAScript Modules)**：使用 `import / export`，这是实现按需加载（Tree-Shaking）的基石。输出到 `dist/es/` 目录。
2.  **CJS (CommonJS)**：使用 `require / module.exports`，兼容老旧环境。输出到 `dist/lib/` 目录。

我们采用 **Rollup（或底层基于 Rollup 的 Vite 库模式）**。因为 Rollup 天生就是为打包“类库（Library）”而生的，它打出来的代码极其干净，没有 Webpack 那些臃肿的 `__webpack_require__` 胶水代码。
同时，利用 `rollup-plugin-vue` 或 Vite 的插件，我们将每一个组件（如 `Button.vue`）分别打包成独立的 `.js` 文件，保留目录结构（`preserveModules: true`），而不是打包成一坨。

### 2.3 极致的按需加载与 Tree-Shaking 魔法
以前引入组件库，我们需要配置复杂的 `babel-plugin-import`。
在 Vite 时代，**Tree-Shaking 是原生支持的**。只要我们的产物是纯粹的 ESM 格式，且在 `package.json` 中声明了 `"sideEffects": false`（告诉打包工具：我这个包里没有副作用代码，比如直接修改全局 `window` 的操作），打包工具在构建业务项目时，就会自动把没被 `import` 进来的组件代码全部剔除（Dead Code Elimination）。
对于样式的按需加载，业界现在流行使用 `unplugin-vue-components`。在业务项目的 `vite.config.js` 里配置一下，它就能在我们写下 `<my-button>` 时，自动帮我们在顶部注入 `import { MyButton } from 'my-ui'` 以及对应的 CSS 文件。

## ⚙️ 三、 最佳实践与避坑指南 (Best Practices & Pitfalls)
*造完轮子，如何丝滑地推向全公司？*

1.  **规范化的版本发布 (Changesets)**
    *   **痛点**：每次发版，都要手动去改 4 个 package 的 `version`，还要翻 Git Commit 手写 Changelog，极易出错。
    *   **解法**：引入 `@changesets/cli`。开发者在提 PR 前运行 `pnpm changeset`，简单选一下是 `patch` (修 Bug) 还是 `minor` (新功能)，写一句描述。发版时，跑一条命令，它会自动把所有相关的包版本号统一升上去，并自动生成极其规范的 `CHANGELOG.md`，最后自动执行 `npm publish`。
2.  **样式与逻辑的彻底解耦 (BEM 规范与 CSS 变量)**
    *   千万别把 `<style scoped>` 写死在 `.vue` 组件里！这会让按需加载样式和提供“一键换肤（Dark Mode）”功能变得极其困难。
    *   所有组件的结构（HTML+JS）在一个独立的包里。所有的样式（SCSS）在另外一个 `theme-chalk` 包里。采用严格的 BEM 命名规范（如 `.my-button`, `.my-button--primary`, `.my-button__icon`）。
    *   全面拥抱 CSS Variables（`var(--my-color-primary)`）。这样业务方想要换主题色，连 SCSS 变量都不用重写，直接在顶层 `body` 注入新的 CSS 变量值即可瞬间换肤。
3.  **单元测试的底线 (Vitest / Testing Library)**
    *   没有单测的组件库就是在裸奔。核心组件（如 DatePicker、Select）涉及到极度复杂的边界条件。引入 Vitest，配合 `@vue/test-utils`，至少保证渲染逻辑、点击事件 `emit`、以及属性 `props` 传入时的 DOM 变化是符合预期的。单测覆盖率低于 80% 的组件严禁合入主分支。

## 📝 四、 沉淀与复盘 (Takeaways)
*   **认知反转**：做一个业务组件和做一个开源级别的 UI 组件库，难度是指数级差异的。业务组件只需要满足当下的 3 个条件；而开源组件库必须思考 100 种极限边缘场景（如穿透传递 `$attrs`、无障碍访问 `a11y` 键盘操作、SSR 服务端渲染时的水合不匹配等）。这极其考验一个前端架构师的代码洁癖与 API 设计审美。

## 🎯 五、 行动清单 (Actionable Checklist)
* [ ] 在目前的业务系统中，挑出 3 个被复制粘贴最多、且带有很多 `/deep/` 覆写样式的业务公共组件（比如带有公司鉴权逻辑的上传组件）。
* [ ] 尝试用 pnpm workspace 在本地初始化一个极简的 Monorepo 目录结构，把这 3 个组件抽离进去，配置 Vite 打包出一个能被本地业务项目 `link` 引用的极简库，跑通从开发到发布的最小 MVP（Minimum Viable Product）闭环。
