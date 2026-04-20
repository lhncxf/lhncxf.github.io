# 单点实战与最佳实践：如何优雅地自研前端脚手架 (CLI) 与模板自动化分发

> **使用场景**：在企业级多项目并行场景下，统一各业务线的技术栈（Vue/React）、代码规范（ESLint/Prettier）、CI/CD 流水线以及基础工具库。通过自研 CLI，将原本“复制粘贴”的初始化过程自动化，确保项目从出生就具备高度的一致性和规范性。

## 1. 痛点与需求场景 (Context)
*为什么要折腾自研脚手架？直接用 Vue CLI 或 Create React App 不香吗？*
* **原始痛点**：
    * **官方工具太“素”**：Vue CLI 生成的项目只是毛坯房。在公司内部，我们还需要手动集成统一的 Axios 封装、权限中心 SDK、Sentry 监控、埋点逻辑、甚至特定的 Dockerfile。
    * **同步成本极高**：一旦脚手架模板更新（比如升级了 Vite 版本或优化了打包体积），老项目难以同步，新项目如果还是靠“拷贝老代码”，会把老坑也带进来。
    * **分发链路断层**：不同业务组（如中后台、大屏可视化、H5 活动页）的模板散落在不同的 Git 仓库，新人入职根本找不到最新的“标准模版”。
* **预期目标**：
    * **一行命令初始化**：`my-cli create my-project` 直接拉取最新、已预配置好的企业级模板。
    * **插件化扩展**：脚手架不仅能创建项目，还能在项目运行中“插入”代码片段（如增加一个标准的 Curd 页面模板）。
    * **版本动态拉取**：模板不内置在 CLI 包里，而是通过 Git Tag 或 NPM 私服动态获取，保证模板始终是最新的。

## 2. 核心架构与设计思路 (Design & Best Practice)
*作为 10 年前端，别一上来就写逻辑。先定架构，CLI 的本质是“交互 + 模板下载 + 渲染 + 注入”。*
* **分层设计**：
    * **Command 层**：使用 `commander.js` 处理命令行输入。
    * **UI/交互层**：使用 `inquirer.js` 或 `enquirer` 做提问（技术栈选型、项目名）。
    * **下载层**：利用 `download-git-repo` 直接从私有 GitLab 或 GitHub 拉取指定 Tag 的代码。
    * **渲染引擎**：使用 `handlebars` 处理模板中的占位符（如项目名、作者、动态依赖）。
* **模板解耦策略**：
    * **不要将模板写死在 CLI 源码里**。将模板单独维护在 Git 仓库中。CLI 只负责通过 Git API 或者是 NPM 包的形式去拉取。这样做的好处是：更新模板不需要用户升级 CLI。
* **最佳实践提示**：
    * **缓存机制**：下载过的模板存放在 `~/.my_cli_templates` 下，下次创建同类项目先对比远程版本，无更新则直接取缓存，提升体验。

## 3. 开箱即用：核心代码骨架 (Implementation)
*基于 Node.js 的 CLI 核心逻辑缩减版，突出重点逻辑。*

```javascript
#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const download = require('download-git-repo');
const ora = require('ora');
const path = require('path');
const fs = require('fs-extra');
const handlebars = require('handlebars');

program
  .version('1.0.0')
  .command('create <name>')
  .description('初始化企业级前端项目模板')
  .action(async (name) => {
    // 1. 交互询问
    const { templateType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'templateType',
        message: '请选择业务模板类型：',
        choices: [
          { name: 'Vue3 企业级中后台 (Vite + Pinia)', value: 'vue3-admin' },
          { name: 'React 移动端 H5 (Next.js)', value: 'react-h5' },
        ],
      },
    ]);

    const targetDir = path.join(process.cwd(), name);
    if (fs.existsSync(targetDir)) {
      console.error('错误：目录已存在！');
      return;
    }

    // 2. 动态下载 (这里配置私有 Git 地址)
    const spinner = ora('正在从远端拉取最新标准模板...').start();
    const gitRepo = `direct:https://gitlab.your-company.com/fe-arch/templates#${templateType}`;

    download(gitRepo, targetDir, { clone: true }, async (err) => {
      if (err) {
        spinner.fail('下载失败：' + err.message);
        return;
      }
      spinner.succeed('模板下载成功');

      // 3. 模板渲染 (动态修改 package.json 等)
      const pkgPath = path.join(targetDir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const content = fs.readFileSync(pkgPath, 'utf8');
        const template = handlebars.compile(content);
        const result = template({ name, author: 'FE-Team' });
        fs.writeFileSync(pkgPath, result);
      }

      console.log(`\n项目初始化成功！\n  cd ${name}\n  npm install\n  npm run dev`);
    });
  });

program.parse(process.argv);
```

## 4. 边界情况与避坑补充 (Edge Cases & Gotchas)
* **权限问题**：私有 GitLab 仓库下载需要配置 `SSH Key` 或在 CLI 中集成 `Access Token`。建议引导用户执行一次 `my-cli login` 存储 Token 到本地 `~/.myclirc`。
* **网络抖动**：`download-git-repo` 偶尔会因为网络超时挂掉。生产环境建议增加 `retry` 机制，或者改用直接调用 `git clone --depth 1` 命令，后者在处理大仓库或私有鉴权时更稳。
* **模板向后兼容**：模板中的 Handlebars 语法如果要升级，注意保持 CLI 的兼容性。或者在模板根目录放一个 `manifest.json`，由 CLI 读取该配置文件来决定执行哪些后置脚本（如自动运行 `npm install`）。
* **版本碎片化**：强制或提醒用户定期升级 CLI。可以在每次运行 `create` 时，异步检测 NPM 远端版本，弹出升级建议。
