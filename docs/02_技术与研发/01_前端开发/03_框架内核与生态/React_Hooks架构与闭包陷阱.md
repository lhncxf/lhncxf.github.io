# React Hooks 架构与闭包陷阱：Fiber 调度与 Concurrent Mode 的底层逻辑

> **使用场景**：本文作为资深前端对 React Hooks 体系的深度重塑。重点不在于如何调用 `useState`，而在于理解 Hooks 如何在 Fiber 架构下维持状态、闭包陷阱的根源，以及并发模式（Concurrent Mode）对开发心智模型的冲击。

## 1. 探究动机 (Why Now?)

React 16.8 引入 Hooks 后，前端开发范式从“类声明”转向了“函数式闭包”。虽然开发体验提升了，但随之而来的“闭包旧值”、“过度渲染”和“复杂的依赖数组”成为了大型项目的隐形杀手。
* **现状盲区**：以前总觉得 Hooks 就是 React 内部维护了一个数组。但当遇到 `useEffect` 拿到旧状态、或者 `useCallback` 导致的子组件无效重绘时，才意识到如果不理解 Fiber 链表和渲染周期，Hooks 架构就是一个随时会炸的黑盒。
* **核心挑战**：
    1. **闭包陷阱 (Stale Closure)**：异步回调、定时器里拿到的永远是初次渲染时的变量值。
    2. **依赖爆炸 (Dependency Hell)**：为了解决闭包问题，不断往依赖数组里塞东西，导致无限循环或性能崩溃。
    3. **调度不可见性**：并发模式下，Render 可能会被中断、挂起，Hooks 状态在多次尝试中是如何保持一致的？

## 2. 核心机制解构 (Mental Model)

### 2.1 Fiber 节点上的 Hooks 链表
Hooks 链表被存储在当前 Fiber 节点的 `memoizedState` 属性上，并以单向链表的形式排列。

```javascript
// 极简版 Hooks 内部结构示意
let workInProgressHook = null; // 当前正在处理的 hook 指针
let currentFiber = {
  memoizedState: null, // 指向 hook 链表的头结点
  stateNode: null
};

function mountWorkInProgressHook() {
  const hook = {
    memoizedState: null, // 存储 hook 自己的状态（如 useState 的值）
    next: null,          // 指向下一个 hook
  };

  if (workInProgressHook === null) {
    currentFiber.memoizedState = workInProgressHook = hook;
  } else {
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}

function useState(initialState) {
  const hook = mountWorkInProgressHook();
  if (!hook.memoizedState) {
    hook.memoizedState = initialState;
  }
  
  const dispatch = (action) => {
    hook.memoizedState = action; // 简化版：直接修改
    render(); // 触发重新渲染
  };
  
  return [hook.memoizedState, dispatch];
}
```
**核心启示**：这就是为什么 Hooks 严禁写在 `if/else` 或循环里。React 依靠**严格的执行顺序**来匹配 Hook 对象。一旦顺序错位，整个链表的取值逻辑就会瞬间崩塌。

### 2.2 闭包陷阱的底层成因
函数组件每次渲染都是一次全新的函数执行。`useState` 返回的是当前渲染周期的常量值。

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  const handleAlert = () => {
    setTimeout(() => {
      // 这里的 count 捕获的是 handleAlert 创建时刻（某次渲染周期）的快照
      alert('Count is: ' + count); 
    }, 3000);
  };

  return <button onClick={handleAlert}>Show Alert</button>;
}
```
当你在 3 秒内点击 `setCount`，`handleAlert` 弹出的依然是点击瞬间的那个 `count`。这在函数式编程中是正确的，但在交互逻辑中往往是灾难。

## 3. 认知反转与横向对比 (Mental Shift & Comparison)

* **认知刷新：useEffect 不是生命周期**。
    * 以前习惯把 `useEffect` 当作 `componentDidMount`。
    * **深度理解**：`useEffect` 是“同步器”。它的作用是让 React 的状态与外部系统（DOM、API、订阅）保持同步。它在浏览器完成绘制（Paint）之后异步执行，不会阻塞渲染。
    * **useLayoutEffect**：在绘制之前同步执行。如果你在 Effect 里操作 DOM 导致位移，用它能避免闪烁。

* **横向对比：Hooks vs Vue3 Composition API**：
    * **React Hooks**：基于闭包和链表。逻辑简单，但有严格的调用顺序限制，且容易产生闭包旧值问题。
    * **Vue3**：基于响应式对象的引用。`setup` 只执行一次，不存在闭包陷阱，调用顺序随意。
    * **专家思考**：React 追求的是纯粹的函数式思想（UI = f(state)），而 Vue 追求的是极致的工程可控性和性能自动优化。

## 4. 业务投影与延伸思考 (Extension)

* **业务指导：攻克闭包与依赖难题**：
    1. **函数式更新**：永远优先使用 `setCount(prev => prev + 1)` 而不是 `setCount(count + 1)`。前者从 Hook 的更新队列里取值，不依赖外部闭包。
    2. **useRef 逃逸舱**：当你需要在异步回调里拿到“最新值”，但又不希望把值塞进依赖数组导致 Effect 频繁刷新时，请使用 `useRef`。`ref.current` 在所有渲染周期中共享同一个引用。
    3. **业务逻辑抽离**：不要在组件里写过长的 Hooks。利用自定义 Hooks 将“数据获取”、“表单处理”、“权限校验”彻底解耦。

* **延伸探索**：
    * **Concurrent Mode 下的 `useTransition`**：如何在高频输入场景下，既保持响应灵敏，又能在后台静默计算重渲染？这涉及 React 的优先级调度算法（Scheduler）。
    * **React Compiler (Forget)**：未来的 React 可能通过编译手段自动处理 `useMemo` 和 `useCallback`。我们需要关注这种从“手动调优”到“编译全自动”的范式转变。