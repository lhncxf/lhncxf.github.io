# 前端 Docker 镜像极致瘦身与多阶段构建 (Multi-stage build) 实战

> **使用场景**：针对现代大前端项目（Vite/React/Vue/Nest.js）在生产环境中的部署优化。通过多阶段构建解决“镜像体积臃肿”和“源码泄露风险”两大核心痛点。

## 1. 痛点与需求场景 (Context)
* **原始痛点**：
    * **体积爆炸**：传统的 Dockerfile 直接将整个 `node_modules` 丢进镜像，导致一个简单的 React 应用镜像动辄 1GB+，拉取和部署极慢。
    * **安全隐患**：镜像中残留源码、构建脚本和 `npm cache`，一旦镜像外泄，代码逻辑全无秘密。
    * **环境污染**：构建环境（Node, Build Tools）与运行环境（Nginx/Static Server）强耦合，违反最小镜像原则。
* **预期目标**：
    * 镜像体积控制在 **10MB - 30MB** 之间（SPA 应用）。
    * 镜像内只包含经过压缩、混淆的静态产物。
    * 提升 CI/CD 流水线效率，利用 Docker 层缓存加速构建。

## 2. 核心架构与设计思路 (Design & Best Practice)

### 2.1 从 GB 到 MB 的核心手法
* **分而治之 (Multi-stage)**：将构建过程拆分为 `Base` (定义环境)、`Builder` (安装依赖并编译)、`Runner` (生产运行) 三个阶段。
* **抛弃 Node 运行时**：前端静态项目（SPA）在生产环境下不需要 Node 环境。
    * **Build 阶段**：用 `node:alpine` 搞定构建。
    * **Run 阶段**：用 `nginx:alpine` 承载产物。
    * **战果**：镜像体积从 `node:latest` 的 1GB 直接压到 `nginx:alpine` 的 10MB 出头。
* **.dockerignore 优先级**：老炮的第一步不是写 Dockerfile，而是写 `.dockerignore`。
    * 必须剔除：`.git`, `node_modules`, `dist`, `*.log`, `.vscode`。
    * 理由：减少 build context 大小，加快文件传输到 Docker Daemon 的速度。

### 2.2 镜像分层缓存的“COPY . 讲究”
CI 构建慢，80% 是因为缓存没用好。Docker 是按层缓存的，如果某一层变了，后续所有层都会失效。
* **错误示范**：
  ```dockerfile
  COPY . .
  RUN npm install
  ```
  这样写，只要你改了一个 `console.log`，`npm install` 就会重新跑一遍，耗时几分钟。
* **资深写法**：
  ```dockerfile
  # 1. 只拷贝 package 定义
  COPY package.json pnpm-lock.yaml ./
  # 2. 安装依赖（此时只要 lock 文件没动，这一层永远走缓存）
  RUN pnpm install --frozen-lockfile
  # 3. 此时再拷贝剩下的源码
  COPY . .
  ```
  这几行代码的顺序，决定了你的 CI 是 30 秒还是 5 分钟。

## 3. 进阶博弈：环境变量注入 (Runtime vs Build time)
这是很多老鸟也会掉坑里的地方。前端 SPA 应用的“环境变量”本质上是构建时硬编码进 JS 的，容器运行时无法通过 `process.env` 获取。

### 三层博弈方案：
1. **构建时注入 (Build-time)**：
   * **手段**：`docker build --build-arg VITE_API_URL=xxx`。
   * **缺点**：镜像与环境绑定。测试环境镜像不能直接上生产，违反“一次构建，到处运行”原则。
2. **运行时挂载 (Runtime - Config Map)**：
   * **手段**：通过 `volumes` 挂载一个 `config.js` 到 `index.html` 前面。
   * **优点**：解耦。
   * **缺点**：需要改代码逻辑，增加请求开销或全局变量污染。
3. **老炮终极方案：运行时替换 (Entrypoint Template)**：
   * **手段**：代码中预留占位符（如 `__VITE_API_URL_PLACEHOLDER__`），在 Nginx 启动前利用 `envsubst` 批量替换静态文件中的字符串。
   * **脚本示例**：
     ```bash
     # entrypoint.sh
     sed -i "s|__API_URL__|${API_URL}|g" /usr/share/nginx/html/assets/*.js
     exec nginx -g "daemon off;"
     ```

## 4. 开箱即用：核心代码骨架 (Implementation)

### 4.1 .dockerignore
```text
node_modules
dist
.git
.vscode
*.log
```

### 4.2 Dockerfile (以 Vite 为例)
```dockerfile
# --- Stage 1: Install Dependencies ---
FROM node:20-alpine AS deps
WORKDIR /app
# 锁定版本，加速安装
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# --- Stage 2: Builder ---
FROM node:20-alpine AS builder
WORKDIR /app
# 从上个阶段拷贝依赖，避免重复安装
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# 注入构建时变量（如果有）
ARG VITE_APP_ENV=production
RUN npm run build

# --- Stage 3: Runner (极致瘦身) ---
FROM nginx:stable-alpine AS runner
WORKDIR /usr/share/nginx/html

# 1. 拷贝构建产物
COPY --from=builder /app/dist .

# 2. 拷贝自定义 nginx 配置（支持 SPA 路由）
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3. (可选) 权限收敛，非 root 运行
# USER nginx

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 5. 边界情况与避坑补充 (Edge Cases & Gotchas)
* **Alpine 兼容性**：Alpine 使用的是 `musl libc`。如果依赖中有 C++ 原生扩展（如旧版 `node-sass`），构建会崩。**方案**：换 `node:20-slim` 或预装 `g++`。
* **时区纠偏**：Alpine 默认 UTC。日志对齐北京时间需安装 `tzdata` 并设 `TZ=Asia/Shanghai`。
* **Shame on Root**：Runner 阶段尽量避免 root。生产环境的安全防御，往往就差这一个 `USER` 指令。
* **Vite/Webpack 缓存**：如果 CI 宿主机支持持久化磁盘，可以将 `node_modules/.cache` 挂载出来，二次构建快到飞起。
