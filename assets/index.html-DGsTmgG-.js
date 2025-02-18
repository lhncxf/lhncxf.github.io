import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,b as n,o as l}from"./app-C7lxUTbB.js";const t={};function e(h,i){return l(),a("div",null,i[0]||(i[0]=[n(`<h1 id="pwa" tabindex="-1"><a class="header-anchor" href="#pwa"><span>PWA</span></a></h1><h2 id="一、pwa简介" tabindex="-1"><a class="header-anchor" href="#一、pwa简介"><span>一、PWA简介</span></a></h2><p>Progressive Web Apps (PWA) 是一种新型的应用模式，它结合了 Web 应用的普遍访问性和原生应用的功能性。PWA 可以在任何现代浏览器中运行，并且可以像原生应用一样被添加到用户的主屏幕上，提供离线支持、推送通知等功能。</p><h2 id="二、pwa的关键特性" tabindex="-1"><a class="header-anchor" href="#二、pwa的关键特性"><span>二、PWA的关键特性</span></a></h2><ol><li><strong>渐进增强</strong>：适用于所有用户，无论他们使用的是哪种浏览器或设备。</li><li><strong>响应式设计</strong>：适应各种屏幕尺寸和方向。</li><li><strong>独立于网络连接</strong>：即使在网络不稳定或无网络的情况下也能工作。</li><li><strong>类似应用的交互体验</strong>：提供快速加载和流畅的导航，无需刷新页面。</li><li><strong>安全传输</strong>：通过 HTTPS 提供服务，确保数据的安全性。</li><li><strong>发现及安装简便</strong>：可以通过 URL 直接访问，也可以像原生应用一样安装到桌面。</li><li><strong>推送通知</strong>：即使用户没有打开网站，也可以接收更新信息。</li></ol><h2 id="三、技术基础" tabindex="-1"><a class="header-anchor" href="#三、技术基础"><span>三、技术基础</span></a></h2><ul><li><strong>Service Worker</strong>：是 PWA 的核心技术之一，充当客户端和服务器之间的代理，允许缓存资源和服务端推送消息。</li><li><strong>Web App Manifest</strong>：定义了应用的基本信息，如名称、图标、主题颜色等，使得应用可以从浏览器启动并显示为一个独立的应用程序。</li><li><strong>HTTPS</strong>：为了保证安全性，PWA 必须通过 HTTPS 协议提供服务。</li></ul><h2 id="四、快速开始" tabindex="-1"><a class="header-anchor" href="#四、快速开始"><span>四、快速开始</span></a></h2><ol><li><p><strong>创建一个简单的 Service Worker</strong>：</p><div class="language-javascript line-numbers-mode" data-highlighter="shiki" data-ext="javascript" data-title="javascript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">// sw.js</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">addEventListener</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;install&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">event</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> =&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">    console</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">log</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;Service Worker 安装&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">});</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">addEventListener</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;activate&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">event</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> =&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">    console</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">log</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;Service Worker 激活&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">});</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">addEventListener</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;fetch&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">event</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> =&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">    console</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">log</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">\`请求拦截: </span><span style="--shiki-light:#CA1243;--shiki-dark:#C678DD;">\${</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">event</span><span style="--shiki-light:#50A14F;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">request</span><span style="--shiki-light:#50A14F;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">url</span><span style="--shiki-light:#CA1243;--shiki-dark:#C678DD;">}</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">\`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">});</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>注册 Service Worker</strong>：</p><div class="language-javascript line-numbers-mode" data-highlighter="shiki" data-ext="javascript" data-title="javascript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;serviceWorker&#39;</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> in</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> navigator</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">    window</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">addEventListener</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;load&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, () </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">=&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">        navigator</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">serviceWorker</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">register</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;/sw.js&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">).</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">then</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">registration</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> =&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">            console</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">log</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;Service Worker 注册成功:&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">registration</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        }).</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">catch</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">error</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> =&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">            console</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">error</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;Service Worker 注册失败:&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">error</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        });</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    });</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>配置 Web App Manifest</strong>：<br> 创建一个 manifest.json 文件，内容如下：</p><div class="language-json line-numbers-mode" data-highlighter="shiki" data-ext="json" data-title="json" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">{</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">  &quot;name&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;My Awesome App&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">  &quot;short_name&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;AwesomeApp&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">  &quot;start_url&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;/index.html&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">  &quot;display&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;standalone&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">  &quot;background_color&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;#ffffff&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">  &quot;theme_color&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;#000000&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">  &quot;icons&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: [</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">      &quot;src&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;icon/lowres.webp&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">      &quot;sizes&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;64x64&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">      &quot;type&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;image/webp&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    },</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">      &quot;src&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;icon/lowres.png&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">      &quot;sizes&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;64x64&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  ]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 HTML 中引用该文件：</p><div class="language-html line-numbers-mode" data-highlighter="shiki" data-ext="html" data-title="html" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">link</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> rel</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;manifest&quot;</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> href</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;/manifest.json&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li></ol><h2 id="五、缓存策略" tabindex="-1"><a class="header-anchor" href="#五、缓存策略"><span>五、缓存策略</span></a></h2><ul><li><strong>Cache API</strong>：与 Service Worker 结合使用，用于存储和检索网络请求的响应。</li><li><strong>常见缓存策略</strong>： <ul><li><strong>Cache Only</strong>：仅从缓存读取数据，不发起网络请求。</li><li><strong>Network Only</strong>：始终从网络获取最新数据。</li><li><strong>Cache with Network Fallback</strong>：首先尝试从缓存读取，如果未命中则发起网络请求。</li><li><strong>Stale While Revalidate</strong>：先返回缓存的数据，同时异步地更新缓存。</li></ul></li></ul><h2 id="六、推送通知" tabindex="-1"><a class="header-anchor" href="#六、推送通知"><span>六、推送通知</span></a></h2><ol><li><p><strong>设置权限</strong>：</p><div class="language-javascript line-numbers-mode" data-highlighter="shiki" data-ext="javascript" data-title="javascript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">Notification</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">requestPermission</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">then</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">permission</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> =&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">permission</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> ===</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;granted&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">        console</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">log</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;用户已授权通知&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    } </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">else</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">        console</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">log</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;用户拒绝了通知&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">});</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>发送通知</strong>：</p><div class="language-javascript line-numbers-mode" data-highlighter="shiki" data-ext="javascript" data-title="javascript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> notification</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> Notification</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;标题&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, { </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">body</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;这是通知的内容&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> });</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li></ol><h2 id="七、调试与测试" tabindex="-1"><a class="header-anchor" href="#七、调试与测试"><span>七、调试与测试</span></a></h2><ul><li><strong>Chrome DevTools</strong>：提供了丰富的工具来调试 PWA，包括查看 Service Worker 状态、检查缓存、模拟不同网络条件等。</li><li><strong>Lighthouse</strong>：Google 提供的一个自动化工具，可以生成关于 PWA 性能、可访问性等方面的审计报告。</li></ul><h2 id="八、案例分析" tabindex="-1"><a class="header-anchor" href="#八、案例分析"><span>八、案例分析</span></a></h2><ul><li><strong>Twitter Lite</strong>：作为一款成功的 PWA 实例，展示了如何利用 PWA 技术提升用户体验，特别是在移动网络环境下。</li><li><strong>Flipkart</strong>：印度最大的电子商务平台之一，通过实施 PWA 显著提高了转化率和用户留存率。</li></ul><h2 id="九、进阶话题" tabindex="-1"><a class="header-anchor" href="#九、进阶话题"><span>九、进阶话题</span></a></h2><ul><li><strong>性能优化</strong>：确保 PWA 的首次加载速度足够快，减少不必要的资源加载。</li><li><strong>跨平台兼容性</strong>：尽管大多数现代浏览器都支持 PWA，但仍然需要考虑不同浏览器间的差异。</li><li><strong>持续集成与部署</strong>：自动化构建和部署流程，简化开发过程中的维护工作。</li></ul><h2 id="十、总结" tabindex="-1"><a class="header-anchor" href="#十、总结"><span>十、总结</span></a></h2><p>PWA 提供了一种全新的方式来交付 Web 应用，结合了 Web 和原生应用的优点，为用户提供更佳的体验。对于前端工程师来说，掌握 PWA 不仅能够拓宽你的技能树，还能帮助你构建更加高效和用户友好的应用程序。希望这篇笔记能够为你提供一个全面的学习路径，助你在 PWA 的世界里不断探索和成长。记住，实践出真知，动手做项目是深入理解 PWA 的最佳途径。</p>`,21)]))}const r=s(t,[["render",e],["__file","index.html.vue"]]),d=JSON.parse('{"path":"/docs/program/pwa/","title":"PWA","lang":"zh-CN","frontmatter":{"description":"PWA 一、PWA简介 Progressive Web Apps (PWA) 是一种新型的应用模式，它结合了 Web 应用的普遍访问性和原生应用的功能性。PWA 可以在任何现代浏览器中运行，并且可以像原生应用一样被添加到用户的主屏幕上，提供离线支持、推送通知等功能。 二、PWA的关键特性 渐进增强：适用于所有用户，无论他们使用的是哪种浏览器或设备。 响...","head":[["meta",{"property":"og:url","content":"https://lhncxf.github.io/docs/program/pwa/"}],["meta",{"property":"og:site_name","content":"RTS Memoirs"}],["meta",{"property":"og:title","content":"PWA"}],["meta",{"property":"og:description","content":"PWA 一、PWA简介 Progressive Web Apps (PWA) 是一种新型的应用模式，它结合了 Web 应用的普遍访问性和原生应用的功能性。PWA 可以在任何现代浏览器中运行，并且可以像原生应用一样被添加到用户的主屏幕上，提供离线支持、推送通知等功能。 二、PWA的关键特性 渐进增强：适用于所有用户，无论他们使用的是哪种浏览器或设备。 响..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-02-18T07:17:34.000Z"}],["meta",{"property":"article:modified_time","content":"2025-02-18T07:17:34.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"PWA\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-02-18T07:17:34.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"LHN\\",\\"url\\":\\"https://lhncxf.github.io\\"}]}"]]},"headers":[{"level":2,"title":"一、PWA简介","slug":"一、pwa简介","link":"#一、pwa简介","children":[]},{"level":2,"title":"二、PWA的关键特性","slug":"二、pwa的关键特性","link":"#二、pwa的关键特性","children":[]},{"level":2,"title":"三、技术基础","slug":"三、技术基础","link":"#三、技术基础","children":[]},{"level":2,"title":"四、快速开始","slug":"四、快速开始","link":"#四、快速开始","children":[]},{"level":2,"title":"五、缓存策略","slug":"五、缓存策略","link":"#五、缓存策略","children":[]},{"level":2,"title":"六、推送通知","slug":"六、推送通知","link":"#六、推送通知","children":[]},{"level":2,"title":"七、调试与测试","slug":"七、调试与测试","link":"#七、调试与测试","children":[]},{"level":2,"title":"八、案例分析","slug":"八、案例分析","link":"#八、案例分析","children":[]},{"level":2,"title":"九、进阶话题","slug":"九、进阶话题","link":"#九、进阶话题","children":[]},{"level":2,"title":"十、总结","slug":"十、总结","link":"#十、总结","children":[]}],"git":{"createdTime":1739863054000,"updatedTime":1739863054000,"contributors":[{"name":"Kobe.Lu","username":"Kobe.Lu","email":"kobeluhaonan@gmail.com","commits":1,"url":"https://github.com/Kobe.Lu"}]},"readingTime":{"minutes":3.59,"words":1076},"filePathRelative":"docs/program/pwa/index.md","localizedDate":"2025年2月18日","excerpt":"\\n<h2>一、PWA简介</h2>\\n<p>Progressive Web Apps (PWA) 是一种新型的应用模式，它结合了 Web 应用的普遍访问性和原生应用的功能性。PWA 可以在任何现代浏览器中运行，并且可以像原生应用一样被添加到用户的主屏幕上，提供离线支持、推送通知等功能。</p>\\n<h2>二、PWA的关键特性</h2>\\n<ol>\\n<li><strong>渐进增强</strong>：适用于所有用户，无论他们使用的是哪种浏览器或设备。</li>\\n<li><strong>响应式设计</strong>：适应各种屏幕尺寸和方向。</li>\\n<li><strong>独立于网络连接</strong>：即使在网络不稳定或无网络的情况下也能工作。</li>\\n<li><strong>类似应用的交互体验</strong>：提供快速加载和流畅的导航，无需刷新页面。</li>\\n<li><strong>安全传输</strong>：通过 HTTPS 提供服务，确保数据的安全性。</li>\\n<li><strong>发现及安装简便</strong>：可以通过 URL 直接访问，也可以像原生应用一样安装到桌面。</li>\\n<li><strong>推送通知</strong>：即使用户没有打开网站，也可以接收更新信息。</li>\\n</ol>","autoDesc":true}');export{r as comp,d as data};
