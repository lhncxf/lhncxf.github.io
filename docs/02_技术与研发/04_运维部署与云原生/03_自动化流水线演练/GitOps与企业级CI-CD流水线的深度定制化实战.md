# GitOps 与企业级 CI-CD 流水线的深度定制化实战

> **使用场景**：适用于从传统 Jenkins 强推模式向云原生 GitOps 架构转型的企业级场景。核心解决环境漂移、发布黑盒以及前端静态资源发布后的快速回滚痛点。

## 1. 痛点与需求场景 (Context)
*为什么要折腾 GitOps？传统的 Jenkins 强推模式在 10 年专家眼中有什么硬伤？*
* **原始痛点**：
    * **环境漂移 (Environment Drift)**：手动修改了 K8s 集群配置，但 Git 仓库没更新，导致下一次发布时配置被覆盖或不一致。
    * **发布黑盒**：Jenkins 脚本写得天花乱坠，但集群当前到底跑的是哪个 Commit？没处看。
    * **回滚地狱**：前端静态资源发布后发现 Bug，如果是 Push 模式，得重新跑一遍构建流水线，时间太长；或者是手动去 OSS/CDN 切版本，容易出错。
* **预期目标**：
    * **Git 作为唯一真理源 (Single Source of Truth)**：所有配置声明式地写在 Git 里，Sync 即部署。
    * **Pull-based 逻辑**：由集群内部的 Agent (ArgoCD/Flux) 监听 Git 变化并拉取配置，安全性更高（不需要暴露 K8s API 给 CI 工具）。
    * **秒级回滚**：通过 Git 历史记录或声明式的版本号切换，实现集群状态的瞬间恢复。

## 2. 核心架构与设计思路 (Design & Best Practice)
*核心理念不是“怎么写 YAML”，而是“怎么管声明”。*
* **Push vs Pull**：
    * Jenkins (Push)：CI 系统拿到集群权限，强行 `kubectl apply`。权限边界模糊，安全风险高。
    * ArgoCD (Pull)：集群主动拉取。CI 只负责跑测试、提镜像、改 Git 中的版本号。职责解耦，天然符合云原生。
* **分层治理 (Layered Config)**：
    * 基础镜像层：私有 Registry 镜像。
    * 应用配置层：Helm Chart (通用逻辑) + Kustomize (环境差异化)。
    * 环境描述层：专门的 `deploy-repo` 存放各环境的声明式配置。
* **前端资源发布策略**：
    * 采用“底座 + 插件”或“独立 Pod”模式。
    * 静态资源（JS/CSS/Img）通过 CI 提速同步至 OSS。
    * 注入配置（HTML/Config）通过 GitOps 交付，利用容器内的 Nginx 或 Sidecar 进行版本精准控制。

## 3. 开箱即用：核心代码骨架 (Implementation)

### 3.1 声明式应用定义 (ArgoCD Application)
```yaml
# argocd-app.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: frontend-pro
  namespace: argocd
spec:
  project: default
  source:
    repoURL: 'https://git.company.com/devops/deploy-repo.git'
    targetRevision: HEAD
    path: overlays/production  # 使用 Kustomize 管理环境差异
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: prod-namespace
  syncPolicy:
    automated:
      prune: true    # 自动删除 Git 中不存在的资源
      selfHeal: true # 如果有人手动修改了集群配置，自动纠偏回 Git 状态
```

### 3.2 Kustomize 环境定制 (overlays/production/kustomization.yaml)
```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
- ../../base
images:
- name: my-frontend-app
  newName: registry.company.com/frontend/app
  newTag: v1.2.5  # CI 流水线只需执行: kustomize edit set image ...
```

### 3.3 前端快速回滚逻辑 (CI Pipeline Snippet)
```bash
# GitLab CI 示例：发布阶段不执行部署，而是修改部署仓
publish_to_gitops:
  stage: deploy
  script:
    - git clone https://deploy-token:${DEPLOY_TOKEN}@git.company.com/devops/deploy-repo.git
    - cd deploy-repo/overlays/production
    - kustomize edit set image my-frontend-app=${DOCKER_IMAGE}:${CI_COMMIT_SHORT_SHA}
    - git add .
    - git commit -m "chore(prod): update frontend image to ${CI_COMMIT_SHORT_SHA}"
    - git push origin main
```

## 4. 边界情况与避坑补充 (Edge Cases & Gotchas)
* **Secret 管理**：不要直接把明文密码写在 Git 里。
    * **避坑**：使用 **Sealed Secrets (Bitnami)** 或 **External Secrets Operator**，Git 里只存加密后的密文或 Key 引用。
* **Sync 冲突与回滚**：
    * 如果 ArgoCD 开启了 `selfHeal`，手动回滚集群 (kubectl rollout undo) 是无效的，因为它会被立刻纠偏回 Git 里的“旧状态”。
    * **正确姿势**：回滚必须通过 Git 操作（Git Revert 或修改 Tag），触发 ArgoCD 的自动同步。
* **前端静态资源孤岛**：
    * 发布后，如果 HTML 已更新但 OSS 上的 JS/CSS 还没同步完（或者 CDN 刷新延迟），会导致白屏。
    * **方案**：先发布静态资源到 OSS（路径带 Hash），确认可用后，再通过 GitOps 修改 K8s 中的 HTML/配置。
