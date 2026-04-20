# 提升开发效能的结构化 Prompt 库沉淀与代码自动化 Code Review 专属模板

## 1. Context (痛点与需求场景)

在 AI 辅助开发的时代，许多开发者的痛点已经从“怎么写代码”变成了“怎么把业务需求转化为高质量、无歧义的 Prompt，让 AI 写出符合团队工程规范的代码”。
常见痛点包括：
1. **沟通效率低**：给 AI 的提示词太泛（如“帮我写个 Vue3 表单”），导致生成的代码缺乏错误处理、类型定义丢失、样式不符合规范，需要反复对话（Re-prompting）。
2. **代码评审成本高**：团队内缺少统一的 Code Review (CR) 标准，或者单纯依赖人力 CR 耗时过长，且容易漏掉安全边界和性能隐患。
3. **知识无法复用**：每个开发者都在单独摸索如何让 AI 更好用，缺乏结构化的 Prompt 资产沉淀。

本篇旨在总结一套针对 10 年资深前端/全栈视角的**结构化 Prompt 模板**，并提供利用 AI 进行自动化 Code Review 的标准操作规范。

## 2. Design & Best Practice (核心架构与设计思路)

### 2.1 结构化 Prompt 框架原则：B-R-I-E-F 模型
优秀的 Prompt 不是长篇大论，而是包含以下核心要素的结构化表达：
- **B (Background)**：背景与上下文（我们在什么业务场景下做这个）。
- **R (Role)**：设定 AI 的专家角色（你是一个拥有 10 年经验的大前端架构师）。
- **I (Instruction)**：明确、具体的指令（请使用 Vue3 Composition API + TypeScript 实现一个...）。
- **E (Examples)**：提供输入/输出的示例或现有代码库的参照规范（必须参考这个界面的数据结构...）。
- **F (Format)**：限定输出格式（只要代码，不要解释，包含完整的 TSDoc 注释）。

### 2.2 自动化 Code Review 的 AI 视角
利用 AI 做 CR，不应仅仅让它检查语法错误（Linter 已经能做了），而是要让它从架构师的角度审视：
- **健壮性**：边界情况、空值处理、防御性编程。
- **性能**：是否存在不必要的渲染、内存泄漏隐患（如闭包未释放、事件监听未卸载）。
- **安全性**：防范 XSS / CSRF，敏感信息是否硬编码。
- **扩展性**：是否违背了 SOLID 原则，耦合度如何。

## 3. Implementation (开箱即用核心代码 / Prompt 库)

### 3.1 零秒启动：全栈需求开发 Prompt 模板

你可以直接复制以下 Markdown 结构丢给 GPT-4 / Claude：

```markdown
# Role
你是一位拥有 10 年经验的大前端与全栈架构师，精通 React/Vue3、TypeScript、Node.js 及微前端架构，代码风格极其严谨。

# Task
请帮我实现一个 [业务模块名称，例如：带虚拟列表的高性能用户选择器] 组件。

# Context & Constraints
1. **技术栈**：Vue 3 (Composition API) + TypeScript + Vite + TailwindCSS。
2. **状态管理**：使用 Pinia 进行跨组件通信。
3. **数据结构**：接口返回的数据结构为：`{ id: string, name: string, avatar: string, status: 0 | 1 }`。
4. **性能要求**：列表可能超过 10,000 条数据，必须使用虚拟滚动（可自行实现或依赖 vueuse）。

# Rules (必须遵守)
- 开启 TypeScript 严格模式，禁止使用 `any`，定义完整的 Interface。
- 必须包含细致的防御性编程（判空、默认值）。
- 组件销毁时，必须清理所有的定时器和事件监听（防止内存泄漏）。
- 使用 `<script setup>` 语法糖。

# Output Format
只需输出最终的完整代码，不要任何废话解释，除非代码中使用了非常规的黑科技，可以在代码上方用 TSDoc 简要说明。
```

### 3.2 降维打击：自动化 Code Review Prompt 模板

在提 PR 之前，将你的 diff 喂给 AI 进行预审：

```markdown
# Role
你是一位苛刻且经验丰富的代码评审专家（Code Reviewer），熟悉干净代码（Clean Code）原则和前端最佳实践。

# Task
请对以下 Git Diff / 代码片段 进行 Code Review。

# Review Checklist (请重点检查以下维度)
1. **潜在 Bug 与边界**：是否存在 Null Pointer、数组越界、竞态条件、死循环风险？
2. **性能隐患**：有没有引发不必要重绘的 Hook 依赖、未清理的副作用（Effect/Event Listener）、过大的计算量未做 Memoization？
3. **安全漏洞**：是否存在 XSS 风险（如直接 v-html 未净化）、注入漏洞？
4. **可维护性**：变量命名是否具有自解释性？是否符合单一职责原则（SRP）？是否存在“坏味道”（Code Smell）？

# Output Format
请按照以下格式输出：
- 🔴 **高危问题 (Blocker)**：必须修复的代码缺陷。
- 🟡 **改进建议 (Warning)**：可以优化性能或可读性的建议（附带重构后的代码片段）。
- 🟢 **优秀实践 (Praise)**：写得好的地方（可选）。

# Code to Review
[粘贴你的代码片段或 Diff]
```

## 4. Edge Cases & Gotchas (边界情况与避坑补充)

- **上下文截断 (Context Window Limit)**：如果你把整个庞大的文件丢给 AI 进行 CR，它可能会遗漏细节或产生幻觉。最佳实践是**拆分模块喂给 AI**，或者使用具有超长上下文能力（如 Claude 3 200K）的模型，并在 Prompt 中强化“仔细阅读完整代码”的指令。
- **警惕“盲目信任”**：AI 生成的重构代码有时会引入新的微妙 Bug（例如在 React 中打乱了 Hook 的调用顺序，或在 Vue 中失去了响应式代理）。始终要对 AI 输出的逻辑跑一遍单元测试或手动自测。
- **业务逻辑盲区**：AI 懂得代码规范，但不一定懂你的底层商业逻辑。CR 模板中如果涉及核心业务资产，一定要在 Context 中将“业务背景和约束”描述清楚，否则它的建议会变得不切实际。
