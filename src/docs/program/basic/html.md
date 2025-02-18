# HTML

## 一、HTML简介
HTML（HyperText Markup Language）即超文本标记语言，是用于创建网页的标准标记语言。通过HTML可以定义页面的结构和内容，结合CSS和JavaScript实现动态交互效果。

## 二、基础语法
- **标签**：HTML文档由一系列元素组成，每个元素由开始标签`<tag>`和结束标签`</tag>`构成，中间放置内容。某些标签如`<img>`、`<br>`是自闭合的。
- **属性**：为标签提供额外信息，通常以`name="value"`的形式出现在开始标签内。
- **注释**：使用`<!-- comment -->`格式添加注释。

## 三、文档结构
一个基本的HTML文档结构如下：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>页面标题</title>
    <!-- 引入外部样式表 -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>网站头部</header>
    <nav>导航栏</nav>
    <main>主要内容区</main>
    <footer>页脚</footer>
</body>
</html>
```

## 四、常用标签
1. **文本格式化**：`<p>`, `<h1>-<h6>`, `<strong>`, `<em>`, `<mark>`, `<small>`, `<del>`, `<ins>`, `<sub>`, `<sup>`
2. **链接与媒体**：`<a>`, `<img>`, `<audio>`, `<video>`
3. **列表**：无序列表`<ul><li>...</li></ul>`，有序列表`<ol><li>...</li></ol>`
4. **表格**：`<table>`, `<tr>`, `<th>`, `<td>`
5. **表单控件**：`<form>`, `<input>`, `<textarea>`, `<button>`, `<select>`, `<option>`

## 五、语义化标签
HTML5引入了许多语义化标签，使得代码更易读且有助于SEO：
- `<article>`：独立的文章内容。
- `<section>`：文档中的一个部分。
- `<aside>`：侧边栏或其他不直接相关的内容。
- `<figure>`和`<figcaption>`：图像或多媒体及其说明。
- `<footer>`和`<header>`：页面或区域的底部和顶部。

## 六、表单处理
表单是用户与网页进行交互的主要方式之一。关键点包括：
- **输入类型**：除了常见的`text`, `password`, 还有`email`, `url`, `number`, `date`, `search`等新类型。
- **验证**：利用`required`, `pattern`, `minlength`, `maxlength`等属性实现前端验证。
- **提交数据**：通过`<form action="/submit-url" method="post">...</form>`设置提交地址和方法。

## 七、高级特性
1. **Canvas绘图**：利用`<canvas>`标签配合JavaScript绘制图形。
2. **SVG图形**：可缩放矢量图形，适合图标和复杂图形显示。
3. **Web Components**：允许开发者封装自己的组件，提升代码复用性和维护性。
4. **Accessibility (A11y)**：确保所有用户，包括那些有残疾的人，都能访问你的网站。例如使用ARIA属性增强可访问性。

## 八、最佳实践
- **保持代码整洁**：合理组织文件结构，使用有意义的命名规则。
- **响应式设计**：使用媒体查询调整布局适应不同设备屏幕大小。
- **性能优化**：减少HTTP请求次数，压缩资源文件大小，延迟加载非关键资源（Lazy Loading）。

## 结语
掌握HTML是成为前端工程师的第一步，也是构建任何Web应用的基础。随着技术的发展，新的特性和工具不断涌现，持续学习和实践对于提高技能水平至关重要。希望这篇笔记能够帮助你建立起扎实的HTML知识体系，并为你未来的开发工作打下坚实的基础。
