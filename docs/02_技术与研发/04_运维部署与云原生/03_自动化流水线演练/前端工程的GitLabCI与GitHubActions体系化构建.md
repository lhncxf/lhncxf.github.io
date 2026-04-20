# 前端工程的 GitLab CI 与 GitHub Actions 体系化构建

在现代前端工程化实践中，流水线不再只是简单的脚本堆砌，它是交付质量与效率的核心屏障。作为架构师，我们需要从镜像安全、构建效率、监控链路及发布可靠性四个维度构建整套体系。

## 1. 基于 Docker 多阶段构建的生产镜像

前端镜像不应包含编译工具。通过多阶段构建，我们将构建环境与运行环境完全隔离。

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
# 优先拷贝包管理文件利用 Docker 缓存层
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Stage 2: Production
FROM nginx:stable-alpine
# 移除默认配置，注入生产环境 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 仅拷贝构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**架构要点：**
- **基础镜像收敛**：统一使用 Alpine 镜像减少安全漏洞和体积。
- **配置外置**：Nginx 配置应随项目维护，处理单页应用（SPA）的路由回退逻辑。

## 2. 流水线缓存加速策略

频繁执行 `npm install` 是浪费资源。我们需要在 GitLab 和 GitHub 环境中实现精准的依赖缓存。

### GitLab CI (cache 机制)
```yaml
variables:
  PNPM_CACHE_DIR: .pnpm-store

cache:
  key:
    files:
      - pnpm-lock.yaml
  paths:
    - .pnpm-store
    - node_modules

build:
  before_script:
    - pnpm config set store-dir $PNPM_CACHE_DIR
```

### GitHub Actions (actions/cache)
```yaml
- name: Cache pnpm modules
  uses: actions/cache@v4
  with:
    path: ~/.pnpm-store
    key: ${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-
```

## 3. Sentry Sourcemap 安全分发

在生产环境中，我们必须禁止对外暴露 `.map` 文件。Sourcemap 应由流水线直接上传至 Sentry 内部，随后在构建产物中将其删除。

**执行逻辑：**
1. 编译阶段生成产物。
2. 调用 Sentry CLI 关联 Release 并上传 `dist/` 下的 map 文件。
3. `rm -rf dist/**/*.map` 清理产物。
4. 构建 Docker 镜像。

这样能确保生产环境既能精准定位报错，又不会泄露源码逻辑。

## 4. 自动化版本管理：Semantic Release

手动修改版本号是低效且易错的。我们通过 Conventional Commits 驱动 `semantic-release` 自动完成版本升级、生成 Changelog 和打 Tag。

```bash
# 流水线中的触发命令
npx semantic-release
```

通过配置 `.releaserc`，可以实现根据 commit 类型（feat/fix/perf）自动判断增加主版本、次版本还是补丁版本。

## 5. “构建一次，多次部署”与无编译回滚

镜像一旦生成就不应再次编译。生产环境的故障回滚应当是“镜像版本切换”，而非重走一遍构建流水线。

**方案设计：**
- **Image Tag 唯一化**：使用 commit SHA 或语义化版本作为镜像标签，而非使用 `latest`。
- **环境变量注入**：利用 Nginx 的 `envsubst` 或在运行时将配置注入全局变量，确保同一份镜像能通过环境变量适配预发与生产环境。
- **回滚操作**：在 K8s 或部署平台上，直接修改 Deployment 的镜像 Tag 即可实现秒级回滚。

## 总结

体系化的 CI/CD 应该做到：依赖有缓存，镜像够纯净，版本能自增，报错可追踪，回滚秒级至。这才是前端架构师在运维侧的核心价值。
