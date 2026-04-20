# 技术溯源与认知重塑 [K8s 基础拓扑认知：Pods、节点调度、前端容器化部署的高可用回滚策略]

> **使用场景**：回顾 K8s 在前端工程化部署中的核心链路，特别是高可用架构下的 Pod 调度机制与回滚策略，建立从“容器运行”到“集群编排”的资深心智模型。

## 1. 探究动机 (Why Now?)
作为 10 年前端，从早期的 Nginx 物理机部署到 Docker 容器化，再到如今的 K8s 集群编排，部署的颗粒度和复杂度发生了质变。
* **现状盲区**：以前觉得 K8s 就是个“更高级的 Docker”，只要把 Image 扔上去就行。但在处理高并发抢购或复杂微前端下发时，发现对 Pod 的生命周期、节点调度（Node Affinity）以及 Deployment 的回滚机制（RollingUpdate）缺乏深度掌控，导致在极端情况下出现过容器启动失败、请求掉坑里的尴尬。

## 2. 核心机制解构 (Mental Model)
K8s 并不是简单的“运行容器”，它是对**意图（Intent）**的声明式管理。

* **核心链路 1：Pod 是最小调度单元而非容器**
  Pod 是 K8s 的基本原子。它包裹了一个或多个容器，共享 Network Namespace（同一个 IP）和 Storage Volume。在前端视角下，这通常是一个 Nginx 业务容器 + 一个日志采集/配置刷新的 Sidecar。
* **核心链路 2：调度器（Scheduler）的打分逻辑**
  当创建一个 Pod 时，Scheduler 会根据资源申请（Resources Requests/Limits）、节点负载、亲和性（Affinity）等规则，经历“预选（Filtering）”和“优选（Scoring）”两个阶段，最终决定 Pod 落在哪台 Node 上。
* **核心链路 3：高可用回滚（RollingUpdate Strategy）**
  `maxSurge`（允许超出预设副本数的比例）和 `maxUnavailable`（升级过程中允许不可用的比例）是前端平滑发布的生命线。

```yaml
# 核心高可用回滚配置示例
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%       # 升级时先多起 1 个（4*0.25），保证总数 5 个
      maxUnavailable: 25% # 允许 1 个不可用，保证至少 3 个存活提供服务
  template:
    spec:
      containers:
      - name: frontend-app
        image: registry.com/frontend:v2
        readinessProbe:    # 关键：就绪探针，决定流量是否切入
          httpGet:
            path: /healthz
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
```

## 3. 认知反转与横向对比 (Mental Shift & Comparison)
* **认知刷新**：以前以为 `kubectl rollout undo` 是万能的。其实回滚的本质是**配置的版本镜像重放**。K8s 会保留 `revisionHistoryLimit` 数量的历史记录，回滚只是把 ReplicaSet 切回到之前的 Hash 版本。如果镜像已经被从镜像库删除了，K8s 也没辙。
* **横向对比**：
  * **蓝绿发布 (Blue-Green)**：全量切换，逻辑简单但资源翻倍，适合重大版本跨越。
  * **金丝雀/滚动更新 (Canary/Rolling)**：K8s 原生支持，节省资源，但在前端场景下要注意“新旧版本 JS/CSS 混用”导致的静态资源 404 问题，必须配合 CDN 的永久存储或 Nginx 的 try_files 策略。

## 4. 业务投影与延伸思考 (Extension)
* **业务指导 1**：在写 `requests` 和 `limits` 时，前端容器不能只看内存。Nginx 的并发处理能力受 CPU 限制，如果不设 `cpu limits`，高并发时可能拖死整台 Node；如果设太小，CPU Throttling 会导致请求延迟骤增。
* **业务指导 2：一定要配就绪探针（ReadinessProbe）**。如果不配，Pod 一启动（Container Created）流量就会打进来，但此时 Nginx 或 Node.js 可能还没初始化完，直接报 502。
* **延伸探索**：接下来需要深入研究 **Service Mesh (Istio)**。在微前端场景下，靠 K8s 原生 Service 做灰度还是太粗糙了，需要 Istio 在 Header 级别做更精细的流量染色和熔断。