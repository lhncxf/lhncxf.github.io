# CSS

## 一、CSS基础
**什么是CSS？**
- CSS（<span class="marker-text">层叠样式表</span>）是一种用来表现HTML或XML等文件样式的计算机语言。通过CSS，可以控制网页的外观和格式，包括布局、颜色、字体等。

**如何引入CSS？**
1. **内联样式**：直接在HTML元素中使用`style`属性。
2. **内部样式表**：在HTML文档的`<head>`部分使用`<style>`标签定义样式。
3. **外部样式表**：创建一个`.css`文件，并在HTML文档中用`<link>`标签引用。

## 二、选择器

### **1. 基本选择器**
这些是最基础的选择器，用于匹配特定类型的HTML元素。

- **元素选择器（Type Selector）**  
  匹配指定的HTML标签。  
  示例：`p { color: red; }` （匹配所有 `<p>` 标签）

- **类选择器（Class Selector）**  
  匹配具有指定类名的元素。  
  示例：`.warning { color: orange; }` （匹配所有 `class="warning"` 的元素）

- **ID选择器（ID Selector）**  
  匹配具有指定ID的单个元素。  
  示例：`#header { font-size: 24px; }` （匹配 `id="header"` 的元素）

- **通配符选择器（Universal Selector）**  
  匹配文档中的所有元素。  
  示例：`* { margin: 0; padding: 0; }`

---

### **2. 属性选择器**
通过元素的属性或属性值进行匹配。

- `[attr]`  
  匹配具有指定属性的元素。  
  示例：`[type] { border: 1px solid black; }` （匹配所有具有 `type` 属性的元素）

- `[attr=value]`  
  匹配属性值完全等于指定值的元素。  
  示例：`[type="text"] { width: 200px; }`

- `[attr~="value"]`  
  匹配属性值包含指定单词（以空格分隔）的元素。  
  示例：`[class~="btn"] { background-color: blue; }`

- `[attr|="value"]`  
  匹配属性值以指定值开头且后跟连字符的元素。  
  示例：`[lang|="en"] { color: green; }`

- `[attr^="value"]`  
  匹配属性值以指定字符串开头的元素。  
  示例：`[href^="https"] { text-decoration: underline; }`

- `[attr$="value"]`  
  匹配属性值以指定字符串结尾的元素。  
  示例：`[href$=".pdf"] { color: red; }`

- `[attr*="value"]`  
  匹配属性值包含指定字符串的元素。  
  示例：`[title*="important"] { font-weight: bold; }`

---

### **3. 伪类选择器**
用于选择处于特定状态的元素。

- **链接伪类**
    - `a:link`：未访问的链接
    - `a:visited`：已访问的链接
    - `a:hover`：鼠标悬停时的链接
    - `a:active`：被激活的链接

- **动态伪类**
    - `:focus`：获得焦点的元素  
      示例：`input:focus { outline: 2px solid blue; }`
    - `:hover`：鼠标悬停的元素  
      示例：`button:hover { background-color: gray; }`

- **结构伪类**
    - `:first-child`：匹配作为其父元素的第一个子元素的元素  
      示例：`li:first-child { font-weight: bold; }`
    - `:last-child`：匹配作为其父元素的最后一个子元素的元素  
      示例：`li:last-child { color: red; }`
    - `:nth-child(n)`：匹配其父元素下的第n个子元素  
      示例：`tr:nth-child(odd) { background-color: #f2f2f2; }`
    - `:only-child`：匹配没有兄弟元素的元素  
      示例：`p:only-child { margin-top: 20px; }`

- **UI伪类**
    - `:checked`：匹配被选中的复选框或单选按钮  
      示例：`input:checked { border: 2px solid green; }`
    - `:disabled`：匹配被禁用的表单元素  
      示例：`button:disabled { opacity: 0.5; }`

---

### **4. 伪元素选择器**
用于选择元素的特定部分。

- `::before` 和 `::after`  
  在元素内容前后插入生成的内容。  
  示例：
  ```css
  p::before {
    content: "注意：";
    color: red;
  }
  ```

- `::first-line`  
  匹配段落的第一行文本。  
  示例：
  ```css
  p::first-line {
    font-weight: bold;
  }
  ```

- `::first-letter`  
  匹配段落的第一个字母。  
  示例：
  ```css
  p::first-letter {
    font-size: 2em;
  }
  ```

- `::selection`  
  匹配用户选中的文本。  
  示例：
  ```css
  ::selection {
    background-color: yellow;
  }
  ```

---

### **5. 组合选择器**
通过组合多个选择器来实现更精确的选择。

- **后代选择器**  
  匹配某个元素内的所有后代元素。  
  示例：`div p { color: blue; }` （匹配 `<div>` 内的所有 `<p>` 元素）

- **子选择器**  
  匹配直接子元素。  
  示例：`ul > li { font-weight: bold; }` （匹配 `<ul>` 的直接子 `<li>` 元素）

- **相邻兄弟选择器**  
  匹配紧接在另一个元素后的兄弟元素。  
  示例：`h1 + p { margin-top: 0; }` （匹配紧跟在 `<h1>` 后的 `<p>` 元素）

- **通用兄弟选择器**  
  匹配某个元素之后的所有兄弟元素。  
  示例：`h1 ~ p { color: gray; }` （匹配 `<h1>` 后的所有 `<p>` 元素）

---

### **6. 优先级规则**
CSS选择器有不同的优先级，具体规则如下（从高到低）：
1. **内联样式**
2. **ID选择器**
3. **类选择器、属性选择器和伪类选择器**
4. **元素选择器和伪元素选择器**
5. **通配符选择器**

当优先级相同时，后者会覆盖前者。

## 三、盒模型

### **1. CSS盒模型概述**
在CSS中，每个HTML元素都被视为一个矩形的盒子（Box），这个盒子由内容区域（content）、内边距（padding）、边框（border）和外边距（margin）组成。盒模型是CSS布局的核心概念。

### **2. 盒模型的组成部分**

#### **(1) 内容区域（Content）**
- 内容区域是盒子的核心部分，用于放置文本、图片或其他内容。
- 它的大小由 `width` 和 `height` 属性定义。

#### **(2) 内边距（Padding）**
- 内边距位于内容区域和边框之间，用于控制内容与边框之间的间距。
- 可以通过 `padding` 或 `padding-top`、`padding-right`、`padding-bottom`、`padding-left` 等属性设置。

#### **(3) 边框（Border）**
- 边框围绕内容区域和内边距，用于定义盒子的边界。
- 可以通过 `border` 或 `border-width`、`border-style`、`border-color` 等属性设置。

#### **(4) 外边距（Margin）**
- 外边距位于边框之外，用于控制盒子与其他盒子之间的间距。
- 可以通过 `margin` 或 `margin-top`、`margin-right`、`margin-bottom`、`margin-left` 等属性设置。

---

### **3. 盒模型的两种类型**

#### **(1) 标准盒模型（W3C标准）**
- 在标准盒模型中，元素的宽度和高度仅包括内容区域（content），不包含内边距（padding）和边框（border）。
- 示例：
  ```css
  div {
    width: 200px;
    height: 100px;
    padding: 20px;
    border: 5px solid black;
  }
  ```
  - 实际宽度 = `200px + 2 * 20px + 2 * 5px = 250px`
  - 实际高度 = `100px + 2 * 20px + 2 * 5px = 150px`

#### **(2) IE盒模型（Quirks模式）**
- 在IE盒模型中，元素的宽度和高度包括内容区域、内边距和边框。
- 示例：
  ```css
  div {
    width: 200px;
    height: 100px;
    padding: 20px;
    border: 5px solid black;
  }
  ```
  - 实际宽度 = `200px`（包括 `content`、`padding` 和 `border`）
  - 实际高度 = `100px`（包括 `content`、`padding` 和 `border`）

---

### **4. 切换盒模型**
可以通过 `box-sizing` 属性切换盒模型的计算方式。

- **`box-sizing: content-box;`**  
  使用标准盒模型（默认值）。  
  示例：
  ```css
  div {
    box-sizing: content-box;
    width: 200px;
    padding: 20px;
    border: 5px solid black;
  }
  ```

- **`box-sizing: border-box;`**  
  使用IE盒模型，宽度和高度包括内容区域、内边距和边框。  
  示例：
  ```css
  div {
    box-sizing: border-box;
    width: 200px;
    padding: 20px;
    border: 5px solid black;
  }
  ```
  - 此时，`content` 的实际宽度为 `200px - (2 * 20px + 2 * 5px) = 150px`

---

### **5. 盒模型的布局规则**

#### **(1) 垂直方向上的边距折叠（Margin Collapse）**
- 当两个垂直外边距相遇时，它们会合并为一个外边距，取两者中的较大值。
- 示例：
  ```css
  div {
    margin-top: 20px;
    margin-bottom: 30px;
  }
  ```
  - 如果两个相邻的 `div` 元素的 `margin-bottom` 和 `margin-top` 相遇，则最终的外边距为较大的那个值（30px）。

#### **(2) 水平方向上的外边距不会折叠**
- 水平方向上的外边距始终相加，不会发生折叠。

#### **(3) 浮动和绝对定位的影响**
- 当元素浮动或使用绝对定位时，盒模型的外边距不会与其他元素的外边距发生折叠。

---

### **6. 盒模型的应用场景**

#### **(1) 使用 `box-sizing: border-box;` 的优势**
- 在设计固定宽度的布局时，`box-sizing: border-box;` 更加直观，因为它将 `padding` 和 `border` 包含在 `width` 和 `height` 中。
- 示例：
  ```css
  * {
    box-sizing: border-box;
  }
  ```

#### **(2) 解决盒模型问题**
- 避免因不同浏览器对盒模型的解析差异导致的布局问题，通常通过设置 `box-sizing` 来统一盒模型。

---

以上是CSS盒模型的主要内容总结，希望对你有所帮助！如果需要进一步补充，请告诉我。

## 四、布局
- **浮动（float）**：允许元素向左或向右移动，直到它的外边缘碰到包含块或另一个浮动元素的边缘。
- **定位（position）**：有static、relative、absolute、fixed四种值，决定了元素如何定位。
- **Flexbox**：一种一维布局方法，提供了更有效的布局方式，特别是对于响应式设计。
- **Grid**：二维布局系统，能够更加精确地控制行与列的布局。

## 五、高级特性
- **媒体查询**：使页面可以根据设备的特性（如宽度、高度、分辨率等）应用不同的样式，实现响应式设计。
- **变量（自定义属性）**：使用`--variable-name`定义，`var(--variable-name)`调用，可以在整个文档中复用样式值。
- **动画与过渡**：通过`@keyframes`规则定义动画序列，使用`transition`属性平滑地改变属性值。

## 六、优化与最佳实践
- **性能优化**：减少CSS文件大小，合并多个CSS文件为一个，避免使用过时的CSS hacks。
- **代码组织**：采用BEM(Block Element Modifier)命名法或SMACSS等方法论保持代码清晰可维护。
- **浏览器兼容性**：了解并处理不同浏览器之间的差异，必要时使用Autoprefixer自动添加厂商前缀。

## 结语
CSS不仅是前端开发的重要组成部分，也是创造美观、功能性强且用户友好的网站的关键因素之一。随着Web技术的发展，新的特性和工具不断涌现，作为前端工程师，持续学习和适应这些变化是非常重要的。希望这篇笔记能为你提供一个全面的学习路径，帮助你在CSS的世界里走得更远。
