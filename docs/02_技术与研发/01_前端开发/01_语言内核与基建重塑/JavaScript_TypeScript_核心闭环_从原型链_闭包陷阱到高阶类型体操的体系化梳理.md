# 📚 JavaScript/TypeScript 核心闭环：从原型链、闭包陷阱到高阶类型体操的体系化梳理

> **老炮导语**：这篇笔记不聊 API 怎么调，只聊底层怎么转。干了 10 年，如果还停留在“会用”层面，那跟写低代码平台的“配置员”没区别。我们要穿透语法糖，直视 V8 的执行现场和 TS 编译器的逻辑本质。

## 📌 一、 溯源：为什么 10 年后还要复盘这些？

*   **闭包 (Closure)**：不再是初级面试里的“函数返回函数”，它是 V8 内存泄漏的头号杀手，也是 React Hooks 时代绕不过去的“Stale Closure”暗礁。
*   **原型 (Prototype)**：别被 `class` 骗了，JS 永远是基于对象的。不懂原型链，你根本优化不了大规模对象的内存占用，也理解不了 V8 隐藏类（Hidden Class）的性能损耗。
*   **TS 类型体操**：不是为了秀技，是为了在封装大型通用基建（如 Form/Table 引擎）时，实现真正的“类型安全”，让接手的后辈打出 `.` 的时候，提示比文档还清晰。

## 💡 二、 核心机制解构 (Mental Model)

### 2.1 执行上下文与闭包的物理实质 (Physical Context)
闭包不是空气，它是堆内存（Heap）里的**持久化作用域块**。
*   **执行现场**：当 Context 弹出栈，如果内部 Scope 被引用，V8 会在堆上创建一个 `Closure` 对象。
*   **避坑指南**：在循环或高频回调里滥用闭包，会迅速撑爆 Old Generation。排查内存泄漏时，盯着 Chrome DevTools 里的 `Detached Elements` 和 `Closure` 节点看。

### 2.2 原型链与 V8 隐藏类 (Memory Optimization)
现代引擎为了快，把 JS 对象模拟成了 C++ 的 struct。
*   **Hidden Class (Shape)**：V8 会给对象贴标签。如果你先 `obj.a = 1; obj.b = 2`，另一个对象先 `obj.b = 2; obj.a = 1`，V8 会认为这是两个不同的 Shape，无法复用 IC（Inline Cache），导致性能下降 10 倍。
*   **最佳实践**：**对象初始化必须“一气呵成”**。禁止动态增删属性（尤其禁止 `delete`，那会让对象陷入“字典模式”）。

### 2.3 TS 类型体操：图灵完备的“元编程”
TS 的类型系统本身就是一种函数式编程语言。
*   **extends**：它是 `if` 判断。
*   **infer**：它是模式匹配（Pattern Matching）。
*   **Mapped Types**：它是对 Key 集合的 `Array.map`。
*   **老炮视角**：别写 `as any`。如果你推导不出来，说明你的接口设计本身就存在不确定性。

```typescript
// 深度 Awaited：递归剥离 Promise，这是对递归类型和 infer 的联合应用
type DeepAwaited<T> = T extends Promise<infer U> 
  ? DeepAwaited<U> 
  : T;

// 协变与逆变 (Variance)：函数参数是逆变的，返回值是协变的。
// 封装高阶组件(HOC)时，如果不懂这个，你的类型永远会报 "is not assignable to" 的诡异错误。
type SubType<T> = T extends (...args: infer P) => infer R ? [P, R] : never;
```

## 🔖 三、 认知反转 (Mental Shift)

1.  **从 Class 到 Function**：以前觉得封装得像 Java 才叫架构，现在明白，**闭包 + 组合** 才是 JS 的精髓。Class 里的 `this` 漂移和 Tree-shaking 困难是大型项目的噩梦。
2.  **TS 的真实价值**：不是防错（Lint 就能防错），而是**架构约束**。通过泛型约束，强迫开发者在写业务逻辑前，先想清楚数据的流动模型。

## 📝 四、 业务投影：老炮的避坑经验

### 4.1 React Hooks 的“地狱级”闭包陷阱
```javascript
// Stale Closure 典型现场
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count); // 永远是初始值，因为这个闭包捕获的是当时的 count 镜像
  }, 1000);
  return () => clearInterval(timer);
}, []); // 依赖项缺失是罪魁祸首
```
**解法**：用 `useRef` 做“逃逸口”。`useRef.current` 存储的是同一个对象的引用，它不属于任何一个特定的 Render 闭包。

### 4.2 泛型驱动的组件基建
如果你在写 Table 组件，不要传 `columns: any[]`。
```typescript
interface TableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T; // 强约束：列名必须是数据源里的键
    render?: (val: T[keyof T], row: T) => ReactNode;
  }>;
}
```

## 🎯 五、 行动清单 (Actionable)

*   [ ] **性能检查**：检查高频渲染组件的对象字面量，是否因属性顺序不一致触发了 V8 的 Deoptimization。
*   [ ] **类型重构**：找到项目中所有的 `Record<string, any>`，尝试用泛型和索引签名重写。
*   [ ] **闭包审计**：审计定时器、事件监听器中的变量捕获，确保没有陈旧闭包导致的数据不同步。
