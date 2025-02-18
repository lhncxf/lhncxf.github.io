# Docker

## 一、Docker简介
Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 或 Windows 机器上，也可以实现虚拟化。Docker 使用 Go 语言编写，并遵循 Apache 2.0 协议开源。

## 二、安装 Docker
- **Linux**: 可以通过官方提供的脚本或包管理器（如apt, yum）进行安装。
- **macOS 和 Windows**: 下载 Docker Desktop 应用程序，安装过程简单直观，适合初学者快速上手。

## 三、基本概念
1. **镜像 (Image)**：只读模板，用于创建 Docker 容器。例如，一个 Ubuntu 镜像包含了运行 Ubuntu 所需的所有文件系统内容。
2. **容器 (Container)**：独立运行的一个或一组应用及其环境。容器是镜像的运行实例。
3. **仓库 (Repository)**：集中存放镜像的地方，分为公开仓库（如 Docker Hub）和私有仓库。

## 四、常用命令
- `docker pull [OPTIONS] NAME[:TAG|@DIGEST]`: 从仓库拉取镜像。
- `docker images`: 列出本地所有镜像。
- `docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`: 创建一个新的容器并运行一个命令。
- `docker ps -a`: 显示所有容器，包括正在运行和停止的。
- `docker exec -it [CONTAINER ID/NAME] /bin/bash`: 进入一个正在运行的容器。
- `docker stop/start/restart [CONTAINER ID/NAME]`: 停止/启动/重启容器。
- `docker rm [CONTAINER ID/NAME]`: 删除容器。
- `docker rmi [IMAGE ID/NAME]`: 删除镜像。

## 五、Dockerfile与构建镜像
Dockerfile 是一个文本文件，包含了一系列指令来定义如何构建一个自定义的镜像。常见的指令有：
- `FROM`：指定基础镜像。
- `RUN`：执行命令并创建新的镜像层。
- `CMD`：提供默认的容器启动命令。
- `EXPOSE`：声明容器内服务监听的端口。
- `ADD/COPY`：复制文件到镜像中。
- `ENTRYPOINT`：配置容器以何种方式启动。

使用 `docker build -t [your_image_name] .` 命令根据 Dockerfile 构建镜像。

## 六、网络与存储
- **网络**：Docker 支持多种网络模式，默认为 bridge 模式。可以通过 `docker network` 命令管理网络。
- **存储**：Docker 提供了数据卷（Volumes）和绑定挂载（Bind mounts）两种方式来持久化数据。数据卷更适合长期保存的数据，而绑定挂载则更灵活。

## 七、进阶话题
- **Docker Compose**：用于定义和运行多容器 Docker 应用程序的服务工具。通过 YAML 文件配置应用服务。
- **Swarm 与 Kubernetes**：两者都是容器编排工具，帮助你管理多个容器的生命周期。Swarm 是 Docker 原生的支持，而 Kubernetes 则更为强大和流行。
- **CI/CD 集成**：将 Docker 整合到持续集成/持续部署流程中，自动化测试、构建和部署应用。

## 八、实践案例
- 实现静态资源服务器：通过 Docker 快速搭建 Nginx 环境，用来托管静态网站。
- 微服务架构下的应用：利用 Docker 将不同的微服务封装在各自的容器中，便于开发、测试和部署。
- 数据库迁移：使用 Docker 来简化数据库迁移过程，确保开发环境与生产环境的一致性。

## 结语
Docker 不仅是一个高性能的应用容器引擎，也是一个强大的开发和运维工具。对于前端工程师来说，掌握 Docker 能够大大提升开发效率，尤其是在团队协作和跨平台部署方面。希望这篇笔记能够帮助你快速上手 Docker 并深入理解其工作原理及应用场景。随着经验的积累，你会发现 Docker 在简化复杂任务上的巨大潜力。
