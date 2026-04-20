const fs = require('fs');
const path = require('path');

// 1. Clean MOC and AGENTS
function removeInternalFiles(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      removeInternalFiles(fullPath);
    } else {
      if (file.includes('MOC.md') || file === 'AGENTS.md') {
        fs.unlinkSync(fullPath);
        console.log('Deleted:', fullPath);
      }
    }
  });
}
removeInternalFiles('docs');

// 2. Scrub markdown content
function scrubMarkdown(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scrubMarkdown(fullPath);
    } else if (fullPath.endsWith('.md')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // Remove dead MOC links and bottom "Return" tags
      content = content.replace(/\[.*?\]\([^)]*MOC\.md\)/gi, '');
      content = content.replace(/\[返回.*?\]\(.*?\)/gi, '');
      content = content.replace(/##\s+MOC 关联.*/gi, '');
      content = content.replace(/-\s*\[.*?\]\(.*?\)\s*/g, (match) => {
          if (match.includes('MOC.md')) return '';
          return match;
      });

      // Scrub persona and adjust tone
      content = content.replace(/10年前端老炮/g, '系统架构师');
      content = content.replace(/10年资深前端老炮/g, '系统架构师');
      content = content.replace(/10年资深前端/g, '系统架构师');
      content = content.replace(/10年资深/g, '资深');
      content = content.replace(/前端老炮/g, '前端专家');
      content = content.replace(/老炮/g, '专家');
      content = content.replace(/用户画像/g, '目标定位');
      
      fs.writeFileSync(fullPath, content, 'utf-8');
    }
  });
}
scrubMarkdown('docs');

// 3. Generate Sidebar and update config.mts
function getSidebar(dir, baseLink) {
  const items = [];
  const list = fs.readdirSync(dir).filter(f => f !== '.vitepress' && !f.startsWith('.'));
  list.sort();
  
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    // Strip prefix like "01_", "02_", and replace underscores with space for display
    let text = file.replace(/^\d+[_|-]/, '').replace(/\.md$/, '').replace(/_/g, ' ');
    
    if (stat.isDirectory()) {
      const children = getSidebar(fullPath, baseLink + file + '/');
      if (children.length > 0) {
        items.push({
          text: text,
          collapsed: false,
          items: children
        });
      }
    } else if (file.endsWith('.md') && file !== 'index.md') {
      items.push({
        text: text,
        link: baseLink + file
      });
    }
  });
  return items;
}

const sidebarTech = getSidebar('docs/02_技术与研发', '/02_技术与研发/');
const sidebarProd = getSidebar('docs/03_产品与设计', '/03_产品与设计/');
const sidebarOper = getSidebar('docs/04_运营与营销', '/04_运营与营销/');

const configContent = `import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "架构与业务沉淀",
  description: "前端工程化 · 复杂业务架构 · 增长与运营",
  lastUpdated: true,
  ignoreDeadLinks: true,
  themeConfig: {
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3],
      label: '大纲目录'
    },
    nav: [
      { text: '技术与研发', link: '/02_技术与研发/' },
      { text: '产品与设计', link: '/03_产品与设计/' },
      { text: '运营与营销', link: '/04_运营与营销/' }
    ],
    sidebar: {
      '/02_技术与研发/': ${JSON.stringify(sidebarTech, null, 2)},
      '/03_产品与设计/': ${JSON.stringify(sidebarProd, null, 2)},
      '/04_运营与营销/': ${JSON.stringify(sidebarOper, null, 2)}
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/lhncxf' }
    ]
  }
})
`;
fs.writeFileSync('docs/.vitepress/config.mts', configContent);

// 4. Create category index.md files for Nav links
['02_技术与研发', '03_产品与设计', '04_运营与营销'].forEach(dir => {
  const p = path.join('docs', dir, 'index.md');
  const title = dir.replace(/^\d+_/, '').replace(/_/g, ' ');
  fs.writeFileSync(p, `# ${title}\n\n请从左侧大纲或顶部导航浏览具体文章。`);
});

// 5. Overhaul Main Home Page
const homeContent = `---
layout: home

hero:
  name: "架构与业务沉淀"
  text: "前端工程化 · 业务架构 · 增长与运营"
  tagline: "从底层技术到全链路业务架构的深度思考与实践复盘"
  actions:
    - theme: brand
      text: 深入阅读
      link: /02_技术与研发/
    - theme: alt
      text: 探索开源
      link: https://github.com/lhncxf
      
features:
  - title: 🛠️ 技术与研发
    details: 涵盖前端工程化基石、V8底层原理、微前端隔离架构、Node.js BFF设计及高并发系统构建。
    link: /02_技术与研发/
  - title: 📦 产品与设计
    details: 聚焦电商模型解构（SKU/SPU）、交互边界心理学、低代码物料协议与B端核心架构底座。
    link: /03_产品与设计/
  - title: 📈 运营与营销
    details: 探索 AARRR 增长极飞轮、埋点数据可视化、SEO与动态SSR渲染机制及数字化全景流转。
    link: /04_运营与营销/
---
`;
fs.writeFileSync('docs/index.md', homeContent);

console.log('Optimization complete!');
