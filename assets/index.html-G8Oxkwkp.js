import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,b as n,o as l}from"./app-C7lxUTbB.js";const t={};function h(e,i){return l(),a("div",null,i[0]||(i[0]=[n(`<h1 id="react" tabindex="-1"><a class="header-anchor" href="#react"><span>React</span></a></h1><h2 id="一、react简介" tabindex="-1"><a class="header-anchor" href="#一、react简介"><span>一、React简介</span></a></h2><p>React 是由 Facebook 开发的一个用于构建用户界面的 JavaScript 库。它专注于视图层，能够高效地更新和渲染用户界面，特别适合构建单页面应用（SPA）。React 使用 JSX（JavaScript XML）语法扩展，使编写组件更加直观。</p><h2 id="二、安装与环境搭建" tabindex="-1"><a class="header-anchor" href="#二、安装与环境搭建"><span>二、安装与环境搭建</span></a></h2><ul><li><strong>使用 Create React App</strong>：这是官方推荐的创建新 React 应用的方式。<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">npx</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> create-react-app</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> my-app</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">cd</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> my-app</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">npm</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> start</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><strong>手动配置</strong>：对于有经验的开发者或者需要自定义配置的情况，可以考虑使用 Webpack 或 Parcel 等工具手动配置项目。</li></ul><h2 id="三、基础概念" tabindex="-1"><a class="header-anchor" href="#三、基础概念"><span>三、基础概念</span></a></h2><ol><li><strong>JSX</strong>：一种 JavaScript 的语法扩展，允许你在 JavaScript 中书写类似 HTML 的结构。</li><li><strong>组件</strong>：React 应用的基本构建块。分为函数组件和类组件两种形式。</li><li><strong>Props</strong>：父组件向子组件传递数据的方式。</li><li><strong>State</strong>：每个组件内部维护的状态，当状态发生变化时会触发重新渲染。</li></ol><h2 id="四、快速开始" tabindex="-1"><a class="header-anchor" href="#四、快速开始"><span>四、快速开始</span></a></h2><p>创建一个简单的组件：</p><div class="language-jsx line-numbers-mode" data-highlighter="shiki" data-ext="jsx" data-title="jsx" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">import</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> React</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> from</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;react&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">function</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> Welcome</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">props</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">  return</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">h1</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;Hello, </span><span style="--shiki-light:#CA1243;--shiki-dark:#C678DD;">{</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">props</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">name</span><span style="--shiki-light:#CA1243;--shiki-dark:#C678DD;">}</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">h1</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">export</span><span style="--shiki-light:#E45649;--shiki-dark:#C678DD;"> default</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> Welcome</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在主应用中使用该组件：</p><div class="language-jsx line-numbers-mode" data-highlighter="shiki" data-ext="jsx" data-title="jsx" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">import</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> React</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> from</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;react&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">import</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> ReactDOM</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> from</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;react-dom&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">import</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> Welcome</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> from</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;./Welcome&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">ReactDOM</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">render</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Welcome</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic;"> name</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;Sara&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> /&gt;, </span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">document</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">getElementById</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;root&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">));</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、生命周期方法-仅适用于类组件" tabindex="-1"><a class="header-anchor" href="#五、生命周期方法-仅适用于类组件"><span>五、生命周期方法（仅适用于类组件）</span></a></h2><ul><li><strong>挂载阶段</strong>：<code>constructor()</code>, <code>componentDidMount()</code></li><li><strong>更新阶段</strong>：<code>shouldComponentUpdate()</code>, <code>componentDidUpdate()</code></li><li><strong>卸载阶段</strong>：<code>componentWillUnmount()</code></li></ul><h2 id="六、hooks" tabindex="-1"><a class="header-anchor" href="#六、hooks"><span>六、Hooks</span></a></h2><p>Hooks 是 React 16.8 引入的新特性，允许你在不编写类的情况下使用 state 和其他 React 特性。</p><ul><li><strong>useState</strong>：声明状态变量。<div class="language-jsx line-numbers-mode" data-highlighter="shiki" data-ext="jsx" data-title="jsx" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">const</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;">count</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;">setCount</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">] </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> useState</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><strong>useEffect</strong>：执行副作用操作，如数据获取、订阅或手动 DOM 操作。<div class="language-jsx line-numbers-mode" data-highlighter="shiki" data-ext="jsx" data-title="jsx" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">useEffect</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(() </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">=&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">    document</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">title</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> \`You clicked </span><span style="--shiki-light:#CA1243;--shiki-dark:#C678DD;">\${</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">count</span><span style="--shiki-light:#CA1243;--shiki-dark:#C678DD;">}</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> times\`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">});</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="七、路由管理" tabindex="-1"><a class="header-anchor" href="#七、路由管理"><span>七、路由管理</span></a></h2><p>使用 React Router 来处理前端路由。</p><ul><li>安装依赖：<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">npm</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> install</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> react-router-dom</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li>基本使用：<div class="language-jsx line-numbers-mode" data-highlighter="shiki" data-ext="jsx" data-title="jsx" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">import</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> { </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">BrowserRouter</span><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;"> as</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> Router</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">Route</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">Switch</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> } </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">from</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;react-router-dom&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">import</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> Home</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> from</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;./Home&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">import</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> About</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> from</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;./About&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">function</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> App</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">() {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">  return</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Router</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      &lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Switch</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        &lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Route</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic;"> path</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;/&quot;</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic;"> exact</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic;"> component</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">{</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">Home</span><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">}</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        &lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Route</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic;"> path</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;/about&quot;</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic;"> component</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">{</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">About</span><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">}</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      &lt;/</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Switch</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;/</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Router</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  );</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="八、状态管理" tabindex="-1"><a class="header-anchor" href="#八、状态管理"><span>八、状态管理</span></a></h2><p>随着应用规模的增长，单一组件内的状态管理可能变得复杂。此时可以引入 Redux 或 MobX 这样的状态管理库。</p><ul><li><strong>Redux</strong>：通过集中式的 store 来管理所有组件的状态。 <ul><li>创建 Store</li><li>Reducers 处理动作并返回新的状态</li><li>使用 Provider 将 store 提供给 React 组件树</li></ul></li><li><strong>MobX</strong>：基于响应式编程思想的状态管理模式，更轻量级且易于上手。</li></ul><h2 id="九、表单处理" tabindex="-1"><a class="header-anchor" href="#九、表单处理"><span>九、表单处理</span></a></h2><ul><li><strong>受控组件</strong>：输入框的值由 React 控制。<div class="language-jsx line-numbers-mode" data-highlighter="shiki" data-ext="jsx" data-title="jsx" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> NameForm</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> extends</span><span style="--shiki-light:#50A14F;--shiki-dark:#E5C07B;"> React</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Component</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">  constructor</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">props</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-light-font-style:inherit;--shiki-dark:#E5C07B;--shiki-dark-font-style:italic;">    super</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">props</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">    this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">state</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">value</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">};</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">    this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">handleChange</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">handleChange</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">bind</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">    this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">handleSubmit</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">handleSubmit</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">bind</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">  handleChange</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">event</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) { </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">setState</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">({</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">value</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> event</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">target</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">value</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}); }</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">  handleSubmit</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">event</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) { </span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">alert</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;A name was submitted: &#39;</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> +</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">state</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">value</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">); }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">  render</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">() {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    return</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">form</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic;"> onSubmit</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">{</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">handleSubmit</span><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">}</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">label</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">          Name:</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">          &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">input</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic;"> type</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;text&quot;</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic;"> value</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">{</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">state</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">value</span><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">}</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic;"> onChange</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">{</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">handleChange</span><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">}</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        &lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">label</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">input</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic;"> type</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;submit&quot;</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic;"> value</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;Submit&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      &lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">form</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    );</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><strong>非受控组件</strong>：直接操作 DOM 获取表单值。</li></ul><h2 id="十、性能优化" tabindex="-1"><a class="header-anchor" href="#十、性能优化"><span>十、性能优化</span></a></h2><ul><li><strong>shouldComponentUpdate</strong>：决定是否需要重新渲染组件。</li><li><strong>React.memo</strong>：为函数组件提供类似的机制。</li><li><strong>虚拟列表</strong>：处理大量数据时避免性能瓶颈。</li></ul><h2 id="十一、测试" tabindex="-1"><a class="header-anchor" href="#十一、测试"><span>十一、测试</span></a></h2><ul><li><strong>单元测试</strong>：Jest 和 Enzyme 是常用的测试框架。<div class="language-jsx line-numbers-mode" data-highlighter="shiki" data-ext="jsx" data-title="jsx" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">import</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> React</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> from</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;react&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">import</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> { </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">shallow</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> } </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">from</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;enzyme&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">import</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> App</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> from</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;./App&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">it</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;renders without crashing&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, () </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">=&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">  shallow</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">App</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> /&gt;);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">});</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="十二、部署" tabindex="-1"><a class="header-anchor" href="#十二、部署"><span>十二、部署</span></a></h2><ul><li><strong>生产构建</strong>：使用 <code>npm run build</code> 创建优化后的生产版本。</li><li><strong>托管服务</strong>：可以选择 Netlify、Vercel 或 GitHub Pages 等平台进行部署。</li></ul><h2 id="结语" tabindex="-1"><a class="header-anchor" href="#结语"><span>结语</span></a></h2><p>React 提供了一个灵活而强大的方式来构建动态用户界面。无论是初学者还是有经验的开发者，深入理解和掌握 React 都将极大地提升你的开发效率和产品质量。希望这篇笔记能为你提供一个全面的学习路径，助你在 React 的世界里不断探索和成长。记住，实践是掌握任何技术的关键，尝试将所学知识应用于实际项目中吧！</p>`,33)]))}const r=s(t,[["render",h],["__file","index.html.vue"]]),d=JSON.parse('{"path":"/docs/program/frameworks/react/","title":"React","lang":"zh-CN","frontmatter":{"description":"React 一、React简介 React 是由 Facebook 开发的一个用于构建用户界面的 JavaScript 库。它专注于视图层，能够高效地更新和渲染用户界面，特别适合构建单页面应用（SPA）。React 使用 JSX（JavaScript XML）语法扩展，使编写组件更加直观。 二、安装与环境搭建 使用 Create React App：这...","head":[["meta",{"property":"og:url","content":"https://lhncxf.github.io/docs/program/frameworks/react/"}],["meta",{"property":"og:site_name","content":"RTS Memoirs"}],["meta",{"property":"og:title","content":"React"}],["meta",{"property":"og:description","content":"React 一、React简介 React 是由 Facebook 开发的一个用于构建用户界面的 JavaScript 库。它专注于视图层，能够高效地更新和渲染用户界面，特别适合构建单页面应用（SPA）。React 使用 JSX（JavaScript XML）语法扩展，使编写组件更加直观。 二、安装与环境搭建 使用 Create React App：这..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-02-18T07:17:34.000Z"}],["meta",{"property":"article:modified_time","content":"2025-02-18T07:17:34.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"React\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-02-18T07:17:34.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"LHN\\",\\"url\\":\\"https://lhncxf.github.io\\"}]}"]]},"headers":[{"level":2,"title":"一、React简介","slug":"一、react简介","link":"#一、react简介","children":[]},{"level":2,"title":"二、安装与环境搭建","slug":"二、安装与环境搭建","link":"#二、安装与环境搭建","children":[]},{"level":2,"title":"三、基础概念","slug":"三、基础概念","link":"#三、基础概念","children":[]},{"level":2,"title":"四、快速开始","slug":"四、快速开始","link":"#四、快速开始","children":[]},{"level":2,"title":"五、生命周期方法（仅适用于类组件）","slug":"五、生命周期方法-仅适用于类组件","link":"#五、生命周期方法-仅适用于类组件","children":[]},{"level":2,"title":"六、Hooks","slug":"六、hooks","link":"#六、hooks","children":[]},{"level":2,"title":"七、路由管理","slug":"七、路由管理","link":"#七、路由管理","children":[]},{"level":2,"title":"八、状态管理","slug":"八、状态管理","link":"#八、状态管理","children":[]},{"level":2,"title":"九、表单处理","slug":"九、表单处理","link":"#九、表单处理","children":[]},{"level":2,"title":"十、性能优化","slug":"十、性能优化","link":"#十、性能优化","children":[]},{"level":2,"title":"十一、测试","slug":"十一、测试","link":"#十一、测试","children":[]},{"level":2,"title":"十二、部署","slug":"十二、部署","link":"#十二、部署","children":[]},{"level":2,"title":"结语","slug":"结语","link":"#结语","children":[]}],"git":{"createdTime":1739863054000,"updatedTime":1739863054000,"contributors":[{"name":"Kobe.Lu","username":"Kobe.Lu","email":"kobeluhaonan@gmail.com","commits":1,"url":"https://github.com/Kobe.Lu"}]},"readingTime":{"minutes":3.2,"words":960},"filePathRelative":"docs/program/frameworks/react/index.md","localizedDate":"2025年2月18日","excerpt":"\\n<h2>一、React简介</h2>\\n<p>React 是由 Facebook 开发的一个用于构建用户界面的 JavaScript 库。它专注于视图层，能够高效地更新和渲染用户界面，特别适合构建单页面应用（SPA）。React 使用 JSX（JavaScript XML）语法扩展，使编写组件更加直观。</p>\\n<h2>二、安装与环境搭建</h2>\\n<ul>\\n<li><strong>使用 Create React App</strong>：这是官方推荐的创建新 React 应用的方式。<div class=\\"language-bash line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"bash\\" data-title=\\"bash\\" style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code><span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">npx</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> create-react-app</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> my-app</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#0184BC;--shiki-dark:#56B6C2\\">cd</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> my-app</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">npm</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> start</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div></li>\\n<li><strong>手动配置</strong>：对于有经验的开发者或者需要自定义配置的情况，可以考虑使用 Webpack 或 Parcel 等工具手动配置项目。</li>\\n</ul>","autoDesc":true}');export{r as comp,d as data};
