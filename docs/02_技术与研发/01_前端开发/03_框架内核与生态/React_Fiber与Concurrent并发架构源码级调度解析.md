# React Fiber 与 Concurrent 并发架构源码级调度解析

> **探究动机**：即便在 React 18 已经普及的今天，很多开发者对 Concurrent 模式的理解仍停留在“并发”字面上。React 为什么要放弃原有的 Stack Reconciler？为什么不用原生的 `requestIdleCallback`？这些问题背后隐藏着前端渲染架构的范式转移。

## 1. 探究动机：从“死等”到“分片”的演进背景

在 React 16 之前，Stack Reconciler 采用的是递归同步渲染。一旦组件树层级过深，JavaScript 引擎会长时间占用主线程，导致浏览器无法响应用户输入，掉帧、卡顿随之而来。

作为老前端，我们以前习惯用 `setTimeout(..., 0)` 来切分长任务，但这只是治标不治本。React 的解决思路更彻底：将同步的递归过程改成异步的可中断任务。这就诞生了 Fiber。

## 2. Fiber 树结构与双缓存（Double Buffering）

### 核心机制：Fiber 节点与双缓存

Fiber 不仅仅是一个对象结构，它更像是一个“虚拟堆栈帧”。它把递归转换成了循环。

```javascript
// 简化的 Fiber 结构
const fiber = {
  type: 'div',
  key: null,
  child: childFiber, // 指向第一个子节点
  sibling: siblingFiber, // 指向下一个兄弟节点
  return: parentFiber, // 指向父节点
  stateNode: domElement, // 对应的真实 DOM
  alternate: workInProgressFiber, // 双缓存机制的核心：指向另一棵树的对应节点
  lanes: 0b0000, // 优先级控制
};
```

**双缓存机制**：React 维护两棵 Fiber 树。
- **current 树**：当前屏幕上显示的树。
- **workInProgress 树**：正在内存中构建的树。

当渲染完成后，React 只需简单地切换一下指针（`root.current = workInProgress`），就能实现极速更新。这种机制避免了渲染过程中的半成品 UI 被用户看到。

## 3. 调度机制：Lane 优先级与 MessageChannel

### 为什么放弃 requestIdleCallback？
虽然 `requestIdleCallback` 听起来很完美，但它有几个致命缺陷：
1. **浏览器兼容性极差**（尤其是 Safari）。
2. **频率不稳定**：它在标签页切换到后台时会被限制。
3. **性能开销**：它的触发频率不足以支撑 60fps 的流畅渲染。

### 位运算实现的 Lane 优先级
React 弃用了以前的 ExpirationTime，改用 Lane（车道）。这是一种基于**位运算**的优先级模型。

```javascript
// 简化的 Lane 逻辑
const SyncLane = 0b0000000000000000000000000000001;
const InputContinuousLane = 0b0000000000000000000000000000010;
const DefaultLane = 0b0000000000000000000000000001000;
```
通过掩码（Mask）运算，React 可以非常高效地判断哪些任务需要合并，哪些任务需要抢占。

### 时间分片（Time Slicing）
React 内部通过 `MessageChannel` 模拟了一个高性能的调度器。它会给每个任务分配约 5ms 的时间片。如果时间到了任务还没做完，React 会主动交还控制权给主线程（Yielding），等下一帧再继续。

## 4. Concurrent Mode：中断、恢复与 Suspense

### 中断与恢复
Concurrent 的精髓在于“可中断”。当一个低优先级的渲染任务正在进行时，如果用户突然输入了字符（高优先级），Scheduler 会中断当前的渲染，优先处理输入，处理完后再恢复之前的渲染任务。

### Suspense 原理
Suspense 的底层其实是利用了 **Promise 的抛出**。
1. 子组件读取数据，数据未准备好，抛出一个 Promise。
2. React 捕获到这个 Promise，挂起当前子树的渲染。
3. 等 Promise resolve 后，React 重新触发渲染。
这本质上是一种对异步状态的高级抽象，让代码写起来像同步。

## 5. 渲染流程：Render Phase 与 Commit Phase

React 的更新分为两个阶段：
1. **Render 阶段**：
   - 包含 `beginWork` 和 `completeWork`。
   - 这是一个可中断的过程。
   - React 在这里通过 Diff 算法算出需要做的变更（EffectList）。
2. **Commit 阶段**：
   - 包含 `beforeMutation`, `mutation`, `layout` 等子阶段。
   - 这是一个**同步不可中断**的过程。
   - 真正的 DOM 操作就在 `mutation` 阶段发生。

## 6. 防坑指南：并发模式下的“撕裂”与生命周期坑点

并发模式虽然强大，但也带来了不少副作用：

### 1. 生命周期被触发多次
由于 Render 阶段是可中断且可能重启的，这意味着在 Render 阶段调用的某些逻辑（比如在 `useMemo` 或函数体中直接写副作用）可能会执行多次。**绝对不要在 Render 阶段写任何副作用。**

### 2. 状态撕裂（Tearing）
当外部 store（非 React 管理的状态，如 Redux 或全局变量）在 Concurrent 渲染过程中发生变化时，可能会导致页面的一部分显示旧数据，另一部分显示新数据。
- **避坑方案**：使用 React 官方提供的 `useSyncExternalStore`。它能确保在并发渲染时，外部状态的一致性。

### 3. useEffect 与 useLayoutEffect 的选择
- `useEffect` 是异步执行的，不会阻塞渲染。
- `useLayoutEffect` 是在 Commit 阶段同步执行的，会阻塞渲染。
如果是修改 DOM 导致闪烁的问题，必须用 `useLayoutEffect`；如果是请求数据或打点，坚持用 `useEffect`。

## 总结：专家的个人反思
以前我们做优化是靠“减少渲染”，比如写各种 `shouldComponentUpdate`。现在 React 的思路是“不怕你渲染，但我要管好渲染的节奏”。从控制逻辑的颗粒度来看，Fiber 把 React 从一个 UI 库变成了一个具备任务调度能力的微型操作系统。
