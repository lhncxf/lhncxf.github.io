import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,b as n,o as e}from"./app-C7lxUTbB.js";const l={};function t(h,s){return e(),a("div",null,s[0]||(s[0]=[n(`<h1 id="node-js" tabindex="-1"><a class="header-anchor" href="#node-js"><span>Node.js</span></a></h1><h2 id="一、node-js简介" tabindex="-1"><a class="header-anchor" href="#一、node-js简介"><span>一、Node.js简介</span></a></h2><p>Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，它使得开发者可以用 JavaScript 编写服务器端代码。Node.js 设计之初是为了编写高性能的网络应用，如今已被广泛应用于 Web 应用开发、实时应用（如聊天室）、API 服务等场景。</p><h2 id="二、安装与配置" tabindex="-1"><a class="header-anchor" href="#二、安装与配置"><span>二、安装与配置</span></a></h2><ul><li><strong>安装 Node.js</strong>：可以从 <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">Node.js 官网</a> 下载适合你操作系统的安装包。安装后可以通过命令 <code>node -v</code> 和 <code>npm -v</code> 检查是否成功安装 Node.js 和 npm（Node 包管理器）。</li><li><strong>使用 nvm（Node Version Manager）</strong>：对于需要同时管理多个 Node.js 版本的情况，可以使用 nvm 来轻松切换版本。</li></ul><h2 id="三、基础概念" tabindex="-1"><a class="header-anchor" href="#三、基础概念"><span>三、基础概念</span></a></h2><ol><li><strong>模块系统</strong>：Node.js 使用 CommonJS 规范实现模块化，每个文件都是一个独立的模块。通过 <code>require()</code> 函数加载其他模块，使用 <code>module.exports</code> 或 <code>exports</code> 输出模块内容。</li><li><strong>事件驱动和异步 I/O</strong>：Node.js 是单线程但支持高并发的运行环境，其核心是事件循环，允许非阻塞 I/O 操作，非常适合处理 I/O 密集型任务。</li><li><strong>回调函数</strong>：在异步编程中广泛使用，用于处理异步操作完成后的逻辑。</li></ol><h2 id="四、快速开始" tabindex="-1"><a class="header-anchor" href="#四、快速开始"><span>四、快速开始</span></a></h2><p>创建一个简单的 HTTP 服务器：</p><div class="language-javascript line-numbers-mode" data-highlighter="shiki" data-ext="javascript" data-title="javascript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> http</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> require</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;http&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> server</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> http</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">createServer</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">((</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">req</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">res</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">=&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">    res</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">statusCode</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 200</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">    res</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">setHeader</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;Content-Type&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;text/plain&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">    res</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">end</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;Hello World</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\n</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">});</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">server</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">listen</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">3000</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, () </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">=&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">    console</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">log</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;Server running at http://localhost:3000/&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">});</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、核心模块" tabindex="-1"><a class="header-anchor" href="#五、核心模块"><span>五、核心模块</span></a></h2><ul><li><strong>fs</strong>：提供文件系统访问功能，支持同步和异步操作。</li><li><strong>path</strong>：用于处理和转换文件路径。</li><li><strong>url</strong>：解析 URL 字符串并提供便捷方法来构建 URL。</li><li><strong>stream</strong>：抽象了读取或写入数据流的概念，适用于高效处理大量数据。</li><li><strong>events</strong>：所有能发射事件的对象都是 EventEmitter 类的实例。</li></ul><h2 id="六、npm-使用" tabindex="-1"><a class="header-anchor" href="#六、npm-使用"><span>六、NPM 使用</span></a></h2><ul><li><strong>初始化项目</strong>：通过 <code>npm init</code> 创建 package.json 文件，记录项目的依赖信息。</li><li><strong>安装依赖</strong>：使用 <code>npm install &lt;package-name&gt;</code> 安装第三方包，并自动添加到 dependencies 中。</li><li><strong>脚本命令</strong>：可以在 package.json 中定义自定义脚本命令，方便执行常用操作。</li></ul><h2 id="七、express-框架" tabindex="-1"><a class="header-anchor" href="#七、express-框架"><span>七、Express 框架</span></a></h2><p>Express 是最流行的 Node.js web 应用框架之一，简化了路由、中间件等功能的实现。</p><ul><li><strong>安装 Express</strong>：<code>npm install express</code></li><li><strong>基本示例</strong>：<div class="language-javascript line-numbers-mode" data-highlighter="shiki" data-ext="javascript" data-title="javascript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> express</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> require</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;express&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> app</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> express</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">app</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">get</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;/&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, (</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">req</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">res</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">=&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> res</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">send</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;Hello World!&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">));</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> port</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> process</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">env</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">PORT</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> ||</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 3000</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">app</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">listen</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">port</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, () </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">=&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> console</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">log</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">\`App listening on port </span><span style="--shiki-light:#CA1243;--shiki-dark:#C678DD;">\${</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">port</span><span style="--shiki-light:#CA1243;--shiki-dark:#C678DD;">}</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">!\`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">));</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="八、异步控制" tabindex="-1"><a class="header-anchor" href="#八、异步控制"><span>八、异步控制</span></a></h2><ul><li><strong>Promise</strong>：提供了一种更清晰的方式来处理异步操作，避免回调地狱。</li><li><strong>async/await</strong>：ES7 引入的新语法糖，使得异步代码看起来更加直观，易于理解和维护。</li></ul><h2 id="九、数据库集成" tabindex="-1"><a class="header-anchor" href="#九、数据库集成"><span>九、数据库集成</span></a></h2><ul><li><strong>MongoDB + Mongoose</strong>：Mongoose 提供了一个直接且优雅的方式与 MongoDB 进行交互，支持模式验证、中间件等功能。</li><li><strong>MySQL/PostgreSQL + Sequelize</strong>：Sequelize 是一个 ORM（对象关系映射），支持多种 SQL 数据库，帮助开发者以面向对象的方式操作数据库。</li></ul><h2 id="十、安全注意事项" tabindex="-1"><a class="header-anchor" href="#十、安全注意事项"><span>十、安全注意事项</span></a></h2><ul><li><strong>输入验证</strong>：确保所有用户输入都经过严格验证，防止 SQL 注入、XSS 攻击等。</li><li><strong>HTTPS</strong>：为你的应用启用 HTTPS，保护数据传输的安全性。</li><li><strong>身份验证与授权</strong>：合理使用 JWT、OAuth 等技术进行用户认证和权限管理。</li></ul><h2 id="十一、测试与调试" tabindex="-1"><a class="header-anchor" href="#十一、测试与调试"><span>十一、测试与调试</span></a></h2><ul><li><strong>单元测试</strong>：Jest 或 Mocha 是常用的测试框架，可以帮助你编写和运行单元测试。</li><li><strong>日志记录</strong>：Winston 或 Bunyan 是两个流行的日志库，便于记录应用程序的日志信息，有助于故障排查。</li></ul><h2 id="十二、部署与运维" tabindex="-1"><a class="header-anchor" href="#十二、部署与运维"><span>十二、部署与运维</span></a></h2><ul><li><strong>选择合适的托管平台</strong>：Heroku、Vercel、AWS Lambda 等提供了便捷的 Node.js 部署方案。</li><li><strong>容器化</strong>：Docker 可以让你的应用程序在一个隔离的环境中运行，便于迁移和扩展。</li><li><strong>监控工具</strong>：New Relic、Datadog 等工具可用于监控应用性能，及时发现并解决问题。</li></ul><h2 id="结语" tabindex="-1"><a class="header-anchor" href="#结语"><span>结语</span></a></h2><p>Node.js 提供了一个强大的平台，让前端工程师也能参与到全栈开发中来。无论是构建 API 服务、实时应用还是传统的 Web 应用，掌握 Node.js 都将极大地提升你的技能树。希望这篇笔记能够为你提供一个全面的学习路径，助你在 Node.js 的世界里不断探索和成长。记住，实践出真知，动手做项目是深入理解 Node.js 的最佳方式。</p>`,29)]))}const k=i(l,[["render",t],["__file","index.html.vue"]]),d=JSON.parse('{"path":"/docs/program/node-js/","title":"Node.js","lang":"zh-CN","frontmatter":{"description":"Node.js 一、Node.js简介 Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，它使得开发者可以用 JavaScript 编写服务器端代码。Node.js 设计之初是为了编写高性能的网络应用，如今已被广泛应用于 Web 应用开发、实时应用（如聊天室）、API 服务等场景。 二、安装与配置 安装 Node...","head":[["meta",{"property":"og:url","content":"https://lhncxf.github.io/docs/program/node-js/"}],["meta",{"property":"og:site_name","content":"RTS Memoirs"}],["meta",{"property":"og:title","content":"Node.js"}],["meta",{"property":"og:description","content":"Node.js 一、Node.js简介 Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，它使得开发者可以用 JavaScript 编写服务器端代码。Node.js 设计之初是为了编写高性能的网络应用，如今已被广泛应用于 Web 应用开发、实时应用（如聊天室）、API 服务等场景。 二、安装与配置 安装 Node..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-02-18T07:17:34.000Z"}],["meta",{"property":"article:modified_time","content":"2025-02-18T07:17:34.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Node.js\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-02-18T07:17:34.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"LHN\\",\\"url\\":\\"https://lhncxf.github.io\\"}]}"]]},"headers":[{"level":2,"title":"一、Node.js简介","slug":"一、node-js简介","link":"#一、node-js简介","children":[]},{"level":2,"title":"二、安装与配置","slug":"二、安装与配置","link":"#二、安装与配置","children":[]},{"level":2,"title":"三、基础概念","slug":"三、基础概念","link":"#三、基础概念","children":[]},{"level":2,"title":"四、快速开始","slug":"四、快速开始","link":"#四、快速开始","children":[]},{"level":2,"title":"五、核心模块","slug":"五、核心模块","link":"#五、核心模块","children":[]},{"level":2,"title":"六、NPM 使用","slug":"六、npm-使用","link":"#六、npm-使用","children":[]},{"level":2,"title":"七、Express 框架","slug":"七、express-框架","link":"#七、express-框架","children":[]},{"level":2,"title":"八、异步控制","slug":"八、异步控制","link":"#八、异步控制","children":[]},{"level":2,"title":"九、数据库集成","slug":"九、数据库集成","link":"#九、数据库集成","children":[]},{"level":2,"title":"十、安全注意事项","slug":"十、安全注意事项","link":"#十、安全注意事项","children":[]},{"level":2,"title":"十一、测试与调试","slug":"十一、测试与调试","link":"#十一、测试与调试","children":[]},{"level":2,"title":"十二、部署与运维","slug":"十二、部署与运维","link":"#十二、部署与运维","children":[]},{"level":2,"title":"结语","slug":"结语","link":"#结语","children":[]}],"git":{"createdTime":1739863054000,"updatedTime":1739863054000,"contributors":[{"name":"Kobe.Lu","username":"Kobe.Lu","email":"kobeluhaonan@gmail.com","commits":1,"url":"https://github.com/Kobe.Lu"}]},"readingTime":{"minutes":3.71,"words":1114},"filePathRelative":"docs/program/node-js/index.md","localizedDate":"2025年2月18日","excerpt":"\\n<h2>一、Node.js简介</h2>\\n<p>Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，它使得开发者可以用 JavaScript 编写服务器端代码。Node.js 设计之初是为了编写高性能的网络应用，如今已被广泛应用于 Web 应用开发、实时应用（如聊天室）、API 服务等场景。</p>\\n<h2>二、安装与配置</h2>\\n<ul>\\n<li><strong>安装 Node.js</strong>：可以从 <a href=\\"https://nodejs.org/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">Node.js 官网</a> 下载适合你操作系统的安装包。安装后可以通过命令 <code>node -v</code> 和 <code>npm -v</code> 检查是否成功安装 Node.js 和 npm（Node 包管理器）。</li>\\n<li><strong>使用 nvm（Node Version Manager）</strong>：对于需要同时管理多个 Node.js 版本的情况，可以使用 nvm 来轻松切换版本。</li>\\n</ul>","autoDesc":true}');export{k as comp,d as data};
