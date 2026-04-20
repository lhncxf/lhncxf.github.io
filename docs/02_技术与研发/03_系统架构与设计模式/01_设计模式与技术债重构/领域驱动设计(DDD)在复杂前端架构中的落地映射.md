# 技术溯源与认知重塑 [领域驱动设计(DDD)在复杂前端架构中的落地映射]

> **使用场景**：针对企业级复杂 SPA (如大型低代码平台、ERP 系统、专业工具类应用)，解决前端业务逻辑泥潭问题。将后端成熟的 DDD 思想脱水、重塑，映射到前端的状态管理、Hooks 及工程化架构中。

## 1. 探究动机 (Why Now?)
* **现状盲区**：过去我们谈前端架构，大多停留在“组件拆分”和“数据流向” (如 MVC, MVVM) 层面。但在超大型项目中，UI 逻辑和业务逻辑往往高度耦合。
* **痛点爆发**：
    * **Store 膨胀**：全局状态成了“大杂烩”，一个 Action 跨越了多个业务边界，修改 A 功能意外跑崩了 B 功能。
    * **逻辑碎片化**：业务规则散落在各个组件的 `useEffect` 或计算属性里，想改一个折扣逻辑得搜遍全工程。
    * **模型缺失**：前端只有“透传”后端 API 的 DTO (Data Transfer Object)，缺乏对业务实体的深层抽象，导致前端成了纯粹的“翻译官”而非“逻辑层”。

## 2. 核心机制解构 (Mental Model)

在前端落地 DDD，核心不在于生搬硬套聚合根 (Aggregate Root) 的类实现，而在于**逻辑的物理隔离与职责映射**。

### 核心映射链路

| DDD 概念 | 前端架构映射 | 核心职责 |
| :--- | :--- | :--- |
| **实体 (Entity)** | **业务模型类/TS 接口** | 具有唯一标识，包含核心业务逻辑（如校验、计算）。 |
| **值对象 (Value Object)** | **不可变数据/格式化工具** | 无标识，描述属性（如 Money, Address），利用解构与 Spread 保证不可变。 |
| **聚合 (Aggregate)** | **状态切片 (State Slices/Modules)** | 以聚合根为中心的逻辑单元，确保数据修改的原子性。 |
| **领域服务 (Domain Service)** | **自定义 Hooks (useBusiness)** | 无法归属于单一实体的跨实体逻辑（如：计算购物车总价）。 |
| **仓储 (Repository)** | **API 网关/适配器层 (Services)** | 隔离后端接口细节，负责数据的 Fetching 与数据模型转换 (DTO -> Entity)。 |

### 核心代码模型 (以订单系统为例)

```typescript
// 1. Entity: 订单实体，封装自身状态流转
export class OrderEntity {
  constructor(private readonly raw: IOrderDTO) {}
  
  // 业务逻辑内聚：判断是否可退款
  get canRefund(): boolean {
    return this.raw.status === 'PAID' && this.raw.payTime > Date.now() - 86400000;
  }
}

// 2. Repository: 隔离 API，返回业务实体而非原始 JSON
export const OrderRepository = {
  async getDetail(id: string): Promise<OrderEntity> {
    const dto = await http.get(`/api/orders/${id}`);
    return new OrderEntity(dto); // 转换点
  }
};

// 3. Domain Service (Hooks): 驱动 UI 的业务单元
export function useOrderWorkflow(orderId: string) {
  const [order, setOrder] = useState<OrderEntity | null>(null);
  
  // 跨实体的复杂交互逻辑逻辑写在这里
  const handleRefund = async () => {
    if (order?.canRefund) {
      await api.post('/refund', { id: orderId });
      // 更新逻辑...
    }
  };

  return { order, handleRefund };
}
```

## 3. 认知反转与横向对比 (Mental Shift & Comparison)
* **认知刷新**：
    * **从“数据驱动”转向“模型驱动”**：以前习惯拿到 JSON 直接 `dispatch` 到 Store；现在要求必须经过 Repository 转换成 Entity。Entity 上的 Getter 就是最天然的“计算属性”，比写在组件里强一百倍。
    * **Store 不是数据库**：以前把 Redux/Pinia 当缓存库使， DDD 提醒我们，Store 应该是**活跃业务聚合的内存镜像**。不活跃的数据不该常驻，更不该结构扁平化到失去语义。
* **横向对比 (Clean Architecture vs DDD in FE)**：
    * **Clean Architecture** 强调依赖倒置和分层（最内层是领域），适合极其复杂的逻辑隔离。
    * **DDD 映射** 更关注**业务边界 (Bounded Context)**。在前端，这通常意味着按业务模块拆分 `src/modules/`，每个模块内部拥有独立的 `model`, `service`, `ui` 文件夹，实现物理上的限界上下文。

## 4. 业务投影与延伸思考 (Extension)
* **业务指导 1 (防腐层 Anti-Corruption Layer)**：
    当后端接口设计得极其恶心（字段名混乱、嵌套极深）时，Repository 层就是最好的防腐层。在映射回 Entity 时完成字段重命名和结构清洗，确保 UI 组件看到的永远是干净的业务语义。
* **业务指导 2 (不可变性与值对象)**：
    利用 TS 的 `readonly` 和 `Record` 模拟值对象。在处理如“颜色选择器”、“坐标信息”等逻辑时，坚持“替换而非修改”，能极大降低 React 数据流调试难度。
* **延伸探索**：
    * **领域事件 (Domain Events)**：在前端如何利用 EventBus 或 Redux Middleware 实现跨模块通信（如：支付成功后，通知库存模块刷新）？
    * **战术选型**：在低代码这种“元数据驱动”的场景下，DDD 如何处理动态生成的实体模型？
