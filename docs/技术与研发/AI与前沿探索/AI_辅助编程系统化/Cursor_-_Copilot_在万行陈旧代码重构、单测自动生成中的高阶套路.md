# 单点实战与最佳实践 [Cursor / Copilot 在万行陈旧代码重构、单测自动生成中的高阶套路]

> **使用场景**：接手一个 5 年前的“屎山”前端项目（例如：几千行的 React Class Component、满天飞的 `any` 和 jQuery 混编、没有任何单元测试）。手动重构风险极高且极其痛苦。此时，引入基于 GPT-4 / Claude 3.5 Sonnet 的 AI 辅助编程工具（如 Cursor、GitHub Copilot），通过结构化 Prompt 和代码库上下文（Codebase Context）感知，实现降维打击式的重构。

## 1. 痛点与需求场景 (Context)
* **原始痛点**：
  - **陈旧框架难以阅读**：一个 3000 行的 `componentDidMount` 里面写满了异步请求、事件绑定和 DOM 操作。想把它重构成 React Hooks（`useEffect`）或者 Vue3 Composition API，手动拆解极其容易漏掉依赖项（Dependencies）导致闭包陷阱。
  - **缺乏单测的重构恐惧**：“不敢动，动了不知道哪里会崩”。要在重构前补齐 80% 的测试覆盖率，手写 mock 和断言（Expect）需要耗费比写业务代码多 3 倍的时间。
  - **普通的 ChatGPT 复制粘贴太蠢**：把 3000 行代码贴进网页版的 ChatGPT，往往会触发 Token 长度限制（或者它只给你返回一半的代码让你自己拼），而且它不知道你项目中封装的 `request` 工具长什么样，直接给你瞎编了一个 `fetch`。
* **预期目标**：
  - **IDE 原生接入 (IDE-Native)**：在 VS Code / Cursor 内，让 AI 直接读取整个 Workspace 的文件关联（Imports/Exports），不需要你来回复制粘贴。
  - **精准重构 (Precise Refactoring)**：高亮一段 500 行的烂代码，快捷键呼出 AI，输入“拆分为 3 个自定义 Hook，提取视图层，遵循 SOLID 原则”，让 AI 原地 Diff 替换。
  - **零成本单测 (Zero-Cost Testing)**：在某个复杂的 Util 函数上，让 AI 自动分析所有边界情况（Edge Cases），生成 Jest / Vitest 的测试用例并自动 Mock 外部依赖。

## 2. 核心架构与设计思路 (Design & Best Practice)
* **Context is King (上下文为王)**：
  - AI 编程的核心不在于你问得多好，而在于你给的“参考资料”有多准。
  - 在 Cursor 中，使用 `@Files` 或 `@Folders` 强行把项目中标准的（你认为写得最好的）新组件、类型定义文件（`types.ts`）、以及封装好的请求库（`api.js`）塞给大模型作为范本。
* **增量重构 (Incremental Refactoring)**：
  - 绝对不要指望 AI 能一次性完美重构 3000 行的组件。必须采用“外科手术式”的精准拆解。
  - 第一步：让 AI 帮忙梳理 State 和生命周期，抽离出纯粹的 API 请求逻辑。
  - 第二步：让 AI 把巨大的 Render 函数按照功能块（Header, Table, Footer）拆分成几个子组件。
  - 第三步：最后才是把它整体转成 Functional Component + Hooks。
* **TDD 倒置重构 (Test-Driven Refactoring)**：
  - 面对黑盒逻辑，先让 AI 根据现有老代码生成一套覆盖率极高的单元测试。
  - 运行这套单测（确保全部 Pass）。
  - 然后再让 AI 去大刀阔斧地重构老代码。
  - 再次运行单测，如果没挂，说明重构是安全的（这是高阶程序员的必备套路）。

## 3. 开箱即用：核心代码骨架 (Implementation)

以在 Cursor 中（快捷键 `Cmd + K` 或 `Cmd + L`）重构和生成单测为例，这是你需要掌握的高阶 Prompt 模板库（直接保存在你的笔记里，用时复制即可）。

### 3.1 万能重构咒语 (React Class 到 Hooks 的极致拆解)

**框选陈旧的组件代码后，输入以下 Prompt：**

```text
你是一个资深的 React 架构师。请将这段 Class Component 重构为符合现代 React 最佳实践的 Functional Component。

【强制约束】：
1. 使用 React Hooks (useState, useEffect, useCallback, useMemo) 替换所有的生命周期和 this.state。
2. 将里面臃肿的 API 请求逻辑抽离为一个自定义 Hook `useFetchData`，不要和 UI 混在一起。
3. 严格检查 `useEffect` 的依赖数组（deps），绝对不能出现 eslint-plugin-react-hooks 的警告，也不能引发死循环。
4. 原代码中绑定的 `window.addEventListener`，必须在 `useEffect` 的 return 闭包中正确 `removeEventListener` 防止内存泄露。
5. 参考我的新规范，使用 @/utils/request 作为请求方法（不要用原始 fetch），参考 @/types/user.ts 补齐 TypeScript 类型定义。
6. 保持原有的 CSS className 和 DOM 结构 100% 不变。
```
**为什么爽？** 
这套咒语直接卡死了 AI 最容易犯错的几个点（漏掉解绑防泄漏、瞎编请求库、丢失 TS 类型、改崩了 UI）。它会老老实实地给你吐出一个完美解耦的新组件。

### 3.2 一键生成企业级单元测试 (Vitest / Jest)

**打开一个包含极度复杂正则、或树形结构递归处理的 `utils.js`，光标选中函数，调出 Copilot/Cursor：**

```text
请为当前高亮的函数生成高质量的单元测试文件。我们项目使用 Vitest + Vue Test Utils（如果是 React 请换成 @testing-library/react）。

【强制要求】：
1. 使用 `describe` 和 `it` / `test` 组织结构，描述清晰。
2. 必须包含核心的正向测试（Happy Path）。
3. 必须包含这几个边界情况（Edge Cases）的断言：
   - 传入 null, undefined, 空数组等极值。
   - 包含特殊字符或超长字符串的截断表现。
4. 如果该函数内部调用了 `axios` 或者其他外部依赖，请使用 `vi.mock()` / `jest.mock()` 进行完美的打桩，不要发起真实的网路请求。
5. 提供足够的模拟数据（Mock Data）。
```
**结果演示：** AI 会直接新建一个 `xxx.spec.ts` 文件，里面把 5 种边界情况的断言全部写好。你只需要 `npm run test`，看着屏幕飘起一片绿色的 PASS。

### 3.3 补齐陈旧代码的 TypeScript 接口 (AnyScript 拯救者)

老项目里如果到处都是 `let data: any`，让 AI 根据后端的 JSON 或者现有的使用上下文反推类型：

```text
作为 TypeScript 专家，请帮我消灭这段代码里的 `any`。
请分析变量在后续代码中的点操作（如 item.user.name），或者参考我提供的 @API_Response.json 格式，
严格推导出对应的 Interface / Type 定义，并替换掉所有的 any。
如果有不确定的字段，可以使用 `unknown` 或者 `Optional` 修饰符（?），并用 // TODO: 注释标出。
```

## 4. 边界情况与避坑补充 (Edge Cases & Gotchas)
* **大模型丢失上下文 (Context Window Overflow)**：虽然现在 Claude 3.5 有 200k 的上下文，但如果你一次性 `@` 进去了十个动辄 2000 行的组件，AI 的注意力机制（Attention）会严重衰减。它可能会在重构时悄悄删掉你原来的一小段特殊逻辑（俗称“偷工减料”）。**解法**：永远不要让 AI 一次重构超过 500 行的核心逻辑。如果文件太大，先手动把它拆成三个小文件，再分别让 AI 去精雕细琢。
* **伪造的 API 和幽灵依赖 (Hallucinated Imports)**：Copilot 最喜欢的操作就是：为了让代码看起来完整，它会自作主张地写一句 `import { debounce } from 'lodash'`，但实际上你的 `package.json` 里根本没装 lodash！或者它会从你的本地项目里瞎编一个其实不存在的文件路径。**解法**：在 Cursor 中，生成代码后一定要立刻按 `Cmd + S` 保存，让本地的 ESLint 和 TS Server (LSP) 跑一遍，看看有没有红色的波浪线报错，如果有，直接在聊天框里跟 AI 说“这里报错找不到模块，我们项目用的是 utils 里的自定义防抖”，让它自我修正。
