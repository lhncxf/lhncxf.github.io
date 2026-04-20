# 单点实战与最佳实践 [强解耦的高性能全局 EventBus 发布订阅管理器实现]

> **使用场景**：跨组件、跨页面（非父子/非层级关系）的高效通信，特别适用于微前端基建、复杂的 Web/Electron 桌面级应用、以及规避状态管理库（如 Vuex/Pinia/Redux）滥用导致的代码高耦合场景。

## 1. 痛点与需求场景 (Context)
* **原始痛点**：
  - **状态管理库滥用**：为了两个边缘组件的临时通信，强行把状态塞进 Pinia/Redux，导致 Store 变得庞大、混乱，且破坏了组件的独立性。
  - **内存泄漏重灾区**：使用原生的 `window.addEventListener` 或粗糙的全局变量发布订阅，极其容易忘记 `off`，导致组件销毁后回调依然执行（甚至成倍叠加执行），引发 OOM 和幽灵 Bug。
  - **类型丢失**：传统的 `mitt` 或自己手写的 EventBus 往往是 `any` 满天飞，在 TypeScript 工程中无法享受到强类型的事件名和参数推导，重构时形同裸奔。
* **预期目标**：
  - **强类型约束**：基于 TS 泛型，实现事件名和 Payload 类型的严格映射。
  - **自动内存管理**：提供机制能自动收集组件内注册的事件，随组件生命周期销毁时一键清理。
  - **扩展性**：支持 `once`（只执行一次）、支持异步事件等待、支持命名空间隔离。

## 2. 核心架构与设计思路 (Design & Best Practice)
* **设计模式**：标准的“发布-订阅（Publish-Subscribe）”模式，注意它与“观察者模式”的区别。发布订阅模式拥有一个中间的“调度中心（Broker）”，发布者和订阅者完全解耦，互不感知。
* **数据结构**：使用 `Map<string, Set<Function>>` 或纯对象来存储事件队列。使用 `Set` 可以天然去重，防止同一个回调函数被重复绑定。
* **TypeScript 类型体操**：利用 `Record<string, any>` 定义事件地图（EventMap），通过 `keyof EventMap` 约束事件名称，通过 `EventMap[Key]` 约束回调参数。

## 3. 开箱即用：核心代码骨架 (Implementation)

这是一个支持强类型、一次性监听、自动去重的高阶 TypeScript EventBus 实现。

```typescript
// types.ts
// 预先定义全局事件地图 (扩展时只需在这里加类型)
export type AppEventMap = {
  'USER_LOGIN': { userId: string; token: string };
  'THEME_CHANGE': 'dark' | 'light';
  'GLOBAL_ERROR': { code: number; message: string };
};

// EventBus.ts
type Handler<T = any> = (payload: T) => void;

class EventBus<EventMap extends Record<string, any>> {
  private handlers: Map<keyof EventMap, Set<Handler>> = new Map();

  // 订阅事件
  public on<K extends keyof EventMap>(event: K, handler: Handler<EventMap[K]>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler as Handler);
  }

  // 仅订阅一次
  public once<K extends keyof EventMap>(event: K, handler: Handler<EventMap[K]>): void {
    const onceHandler: Handler<EventMap[K]> = (payload) => {
      handler(payload);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }

  // 发布事件
  public emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      // 拷贝一份，防止在执行过程中如果有人 off 导致 Set 迭代器跳跃或抛错
      const handlersCopy = new Set(eventHandlers);
      handlersCopy.forEach((handler) => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`[EventBus Error] emit "${String(event)}" failed:`, error);
        }
      });
    }
  }

  // 卸载指定回调
  public off<K extends keyof EventMap>(event: K, handler?: Handler<EventMap[K]>): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      if (handler) {
        eventHandlers.delete(handler as Handler);
        // 垃圾回收优化：如果 Set 为空，直接干掉这个 key
        if (eventHandlers.size === 0) {
          this.handlers.delete(event);
        }
      } else {
        // 不传 handler 则清空该事件的所有订阅
        this.handlers.delete(event);
      }
    }
  }

  // 清空所有事件 (一般用于应用退出或硬重启)
  public clear(): void {
    this.handlers.clear();
  }
}

// 导出一个全局单例
export const globalBus = new EventBus<AppEventMap>();
```

### 配合 Vue3/React 解决忘记销毁的 Hooks 封装

**Vue3 版本 (`useEventBus.ts`)**:
```typescript
import { onUnmounted } from 'vue';
import { globalBus, AppEventMap } from './EventBus';

export function useEventBus() {
  // 收集当前组件注册的所有清理函数
  const cleanups: Array<() => void> = [];

  const on = <K extends keyof AppEventMap>(event: K, handler: (payload: AppEventMap[K]) => void) => {
    globalBus.on(event, handler);
    cleanups.push(() => globalBus.off(event, handler));
  };

  // 组件销毁时，自动清理
  onUnmounted(() => {
    cleanups.forEach(fn => fn());
  });

  return { on, emit: globalBus.emit.bind(globalBus) };
}
```

**React 版本 (`useEventBus.ts`)**:
```typescript
import { useEffect, useRef } from 'react';
import { globalBus, AppEventMap } from './EventBus';

export function useEventSubscribe<K extends keyof AppEventMap>(
  event: K, 
  handler: (payload: AppEventMap[K]) => void
) {
  // 使用 ref 保证闭包里拿到最新的 handler
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const callback = (payload: AppEventMap[K]) => handlerRef.current(payload);
    globalBus.on(event, callback);
    return () => {
      globalBus.off(event, callback);
    };
  }, [event]); // event 如果是静态常量，这里只跑一次
}
```

## 4. 边界情况与避坑补充 (Edge Cases & Gotchas)
* **执行错误隔离**：在 `emit` 遍历调用 handler 时，如果其中一个 handler 报错抛出异常（`throw Error`），会导致后续的 handler 都不执行。**最佳实践是在 `emit` 内部包一层 `try-catch`**，防止一颗老鼠屎坏了一锅粥。
* **异步并发陷阱**：EventBus 默认是**同步触发**的。如果你的订阅者里有大量的异步逻辑，且发布频率极高（例如滚动、拖拽），可能会造成调用栈拥堵。应在业务端搭配防抖（Debounce）或节流（Throttle）使用。
* **跨窗体通信**：这个 EventBus 只能在一个 JS 运行上下文中生效。如果是 Electron 多窗口、同源多 Tab 页面跨页通信，此方案无效，需要降级到基于 `BroadcastChannel`、`localStorage` 或 Electron 的 `ipcRenderer` 桥接封装。
