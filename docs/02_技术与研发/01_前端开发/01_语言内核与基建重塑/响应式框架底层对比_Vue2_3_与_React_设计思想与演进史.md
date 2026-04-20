# 📚 响应式框架底层对比：Vue2/3 与 React 设计思想与演进史

> **使用场景**：用于对现有掌握的知识进行体系化回顾，系统性横向对比当前三大主流框架的核心底层响应式机制。从架构设计的维度，探究尤雨溪和 Dan Abramov 在应对前端状态同步与视图更新时的核心取舍（Trade-off）。

## 📌 一、 探究动机 (Why Now?)
*为什么到了今天还要去翻 Vue 和 React 的响应式底层？*
* **现状盲区**：在日常业务开发中，我们习惯了 `ref`、`reactive` 或者 `useState` 的黑盒调用。但当应用规模膨胀到万行级、甚至十万行级代码，长列表、巨型表单、高频 WebSocket 推送等极端场景接踵而至时，框架底层的性能天花板就会暴露无遗。
* **架构视角**：如果不搞懂 Vue2 的 `Object.defineProperty` 劫持粒度、Vue3 的 `Proxy` 依赖收集模型，以及 React 基于 Fiber 架构的 Pull 调度模型，我们在做全局状态管理选型（Redux vs Pinia）和性能优化（Memo、useMemo、v-once）时，就如同盲人摸象。这不是面试八股文，这是指导我们在高并发交互下写出防腐化、高性能代码的心智底座。

## 💡 二、 核心机制解构 (Mental Model)
*抛开繁杂的边界处理源码，三大框架底层的核心逻辑到底是什么？*

### 2.1 Vue2：基于 `Object.defineProperty` 的精准推演 (Push)
Vue2 的核心是 **“依赖收集与触发更新”**。它在组件初始化时，递归遍历 `data` 对象，为每个属性强制注入 `getter` 和 `setter`。当组件 Render 函数执行时，触发 `getter`，将当前的 `Watcher`（订阅者）推入属性专属的 `Dep`（依赖管家）中。一旦数据突变，触发 `setter`，`Dep` 就会精准通知所有的 `Watcher` 去重新执行 Render。
**致命痛点**：递归劫持的初始化性能开销极大；无法原生监听到对象属性的新增/删除和数组索引的直接修改（被迫引入 `$set` 和重写数组原型方法）。

### 2.2 Vue3：基于 `Proxy` 的惰性代理与编译时优化 (Push + Compile)
Vue3 彻底抛弃了全量递归，改用 ES6 的 `Proxy`。它不再劫持具体属性，而是直接代理整个对象。最精妙的是**惰性递归**：只有当你真正访问到嵌套对象深层属性时，它才会在 `getter` 中对那一层进行 `Proxy` 包装。
同时，配合 Composition API，Vue3 引入了极具破坏力的 **编译时优化（Block Tree & PatchFlag）**。框架知道模板里哪里是静态的、哪里是动态绑定的，从而在 Diff 阶段直接跳过静态节点，实现了靶向更新。

### 2.3 React：基于 Fiber 架构的暴力比对与调度 (Pull)
与 Vue “数据知道自己被谁使用了”不同，React 的哲学是 **“数据不知道，我全量检查一遍”**。
React 的响应式核心是 `setState` 触发的全局重绘逻辑。在 React 16 之前，Stack Reconciler 是同步递归比对的，一旦组件树庞大，就会阻塞浏览器主线程导致掉帧。
因此，React 引入了 Fiber 架构，将整个组件树链表化。状态更新时，React 把 Diff 过程切分为一个个微小的任务单元（Work Unit），利用浏览器的空闲时间（`requestIdleCallback` 思想）进行比对（Render Phase），找出差异后再统一提交更新真实 DOM（Commit Phase）。

```javascript
// 极简伪代码：Vue3 的 Proxy 响应式核心底座
const targetMap = new WeakMap(); // 存储全量依赖：target -> key -> Set(Effect)
let activeEffect = null; // 当前正在执行的副作用

function track(target, key) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));
  let dep = depsMap.get(key);
  if (!dep) depsMap.set(key, (dep = new Set()));
  dep.add(activeEffect); // 收集当前依赖
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  if (dep) dep.forEach(effect => effect()); // 触发所有依赖执行
}

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key); // 依赖收集
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key); // 派发更新
      return result;
    }
  });
}
```

## 🔖 三、 认知反转与横向对比 (Mental Shift & Comparison)
*十年老炮视角的重新审视：原来所谓的好用，都在暗中标好了价格。*

* **认知刷新**：以前总觉得 React 性能牛逼，后来才发现 React 默认的重渲染策略极其“笨重”（父组件更新，子组件不管有无变化统统执行一遍 Render）。如果不手动加 `React.memo` / `useMemo` / `useCallback`，性能其实是不如 Vue 的。Vue 的细粒度追踪让它天生具备了卓越的默认性能。
* **React vs Vue 的终极 Trade-off**：
  * **React 的妥协**：为了保持“UI 就是状态的纯函数（`UI = f(state)`）”这种极致的不可变（Immutable）数学美感，React 放弃了对数据变化的细粒度追踪。代价就是开发者必须自己去管理渲染边界（到处写 Memo）。Hooks 的闭包陷阱（Stale Closure）本质上也是由于不可变数据流导致每次渲染都产生一个全新作用域带来的副作用。
  * **Vue 的妥协**：为了让开发者爽（可变数据流，直接赋值 `obj.a = 1` 就能更新视图），Vue 在底层扛下了所有脏活累活。但在极其复杂的高频状态同步（如同时管理几千个强关联的可变状态）时，Vue 庞大的响应式追踪图谱（Dep/Watcher/Effect 对象）本身就会吃掉可观的内存，反而成了性能瓶颈。

## 📝 四、 业务投影与延伸思考 (Extension)
*回到业务：底层机制如何指导我们的架构设计？*

* **业务指导 1（巨量数据长列表）**：在 Vue 中展示几万条纯展示用的静态表格数据时，绝对不能直接把它塞给 `ref` 或赋给 Vue2 的 `data`！这会让 Vue 徒劳地去递归代理几万个对象，直接卡死浏览器主线程。必须用 `Object.freeze()` (Vue2) 或者 `shallowRef` / `markRaw` (Vue3) 斩断响应式追踪。
* **业务指导 2（React 性能防御）**：在 React 中设计全局 Context 状态库时，绝不能把所有业务状态糅合在一个巨大的 Context Provider 里。任何一个子节点的更新都会导致订阅了该 Context 的所有组件集体 Render。状态必须按业务领域横向拆分。
* **延伸探索**：既然响应式追踪有这么大的包袱，那最近火热的 **SolidJS** 甚至是 Vue 团队的 **Vapor Mode**（无虚拟 DOM，直接编译成原生 DOM 操作代码）究竟是怎么做到比 Vue3 还要快的？这值得在后续的《前沿探索》板块进行重点剖析。

## 🎯 五、 行动清单 (Actionable Takeaways)
* [ ] 审查当前团队项目（尤其是复杂长列表/大表单组件），找出无脑使用深层响应式的性能灾难点，改用 `shallowRef` 阻断追踪。
* [ ] 复盘 React 老代码中的大量 `useEffect` 依赖地狱，重新用“响应式底层流转”的视角去重构，消灭不必要的闭包陷阱。
