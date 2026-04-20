# 无障碍与包容性设计：跳出 div 包万物的同理心重构

> **使用场景**：针对 Web 产品在复杂交互下的 A11y（无障碍）落地实践。不只是为了合规，而是通过语义化重构，让产品在键盘导航、屏幕阅读器及极端环境下依然“好用”。这是从“能跑就行”的前端工匠转向“以人为本”的产品化工程师的必修课。

## 1. 痛点与需求场景 (Context)
*为什么要跳出 `div` 语义荒漠？*
* **原始痛点**：大量业务组件为了图省事，清一色使用 `div` + `onclick` 堆砌。导致视障用户使用屏幕阅读器（Screen Reader）时，整页都是“按钮、文本、分组”的混乱播报；键盘党在 Modal 弹窗里按 Tab 键会直接飘到背景层，陷入“焦点丢失”的黑洞。
* **预期目标**：构建一套具备“包容性”的交互规范。通过语义化 HTML、ARIA 规范及焦点管理，确保产品在任何辅助设备下都能逻辑自洽。

## 2. 核心架构与设计思路 (Design & Best Practice)
*无障碍不是负担，是核心功能。*
* **语义化优先（Semantic First）**：能用 `button` 绝不用 `div`。原生标签自带焦点状态、空间触发逻辑（Space/Enter）及默认的角色声明。
* **焦点闭环（Focus Trap）**：在弹窗、抽屉等覆盖式交互中，必须强制焦点在组件内部循环，防止用户意外导航到被遮罩的底层元素。
* **信息对等（ARIA as a Bridge）**：当原生标签无法满足视觉设计时（如自定义开关、进度条），利用 `aria-label`、`aria-live` 等属性补齐辅助设备所需的“上下文”。
* **边缘即核心**：为色弱用户设计的色彩对比度（WCAG 2.1 AA级），其实也提升了普通用户在强光环境下的阅读体验。

## 3. 开箱即用：核心代码骨架 (Implementation)
*以一个典型的“无障碍模态框”为例，展示焦点锁定与语义补齐。*

```javascript
/**
 * 焦点锁定逻辑 (Focus Trap) - 老炮级纯 JS 方案
 * 确保 Tab 键只在 Modal 内部循环
 */
const handleFocusTrap = (e, modalElement) => {
  const focusableElements = modalElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.key === 'Tab') {
    if (e.shiftKey) { // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else { // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
};

/**
 * 结构层：语义化与 ARIA 声明
 */
<!-- 
  role="dialog": 声明这是对话框
  aria-modal="true": 告知辅助设备屏蔽底层内容
  aria-labelledby: 指向标题 ID，让读屏器第一时间播报标题
-->
<div id="my-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">确认删除此条目？</h2>
  <p>此操作不可逆，请谨慎操作。</p>
  
  <div class="actions">
    <!-- 原生 button 自动获得焦点支持 -->
    <button type="button" class="btn-cancel">取消</button>
    <button type="button" class="btn-danger" aria-label="立即删除该条目">删除</button>
  </div>
</div>
```

## 4. 边界情况与避坑补充 (Edge Cases & Gotchas)
* **不要过度 ARIA**：第一准则是“能不用 ARIA 就不用”。原生标签的兼容性永远好于手动补齐的 ARIA 属性。
* **Tabindex 滥用**：避免使用 `tabindex="1"` 或更大的正数，这会破坏全局文档流的导航顺序。只推荐使用 `0`（加入顺序流）和 `-1`（仅脚本可聚焦）。
* **动态内容通知**：对于异步加载的错误提示，使用 `aria-live="polite"`。不要用 `assertive`，除非是足以导致程序崩溃的致命错误，否则会粗鲁地打断用户的读屏体验。
* **颜色不是唯一维度**：表单报错不能只靠红框。必须配合图标或文字说明，否则色盲用户完全无法感知错误。
