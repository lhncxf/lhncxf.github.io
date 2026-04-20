# BFF 层 (Node.js) 架构设计与业务聚合实战

> **使用场景**：记录在复杂业务场景下，如何利用 Node.js 构建高性能、可扩展的 BFF（Backend For Frontend）层。重点在于多端适配、接口聚合、性能优化以及企业级稳定性保障。

## 1. 痛点与需求场景 (Context)
*在前端接管微服务网关的路上，为什么简单的转发已经不够用了？*

*   **原始痛点**：
    *   **接口碎片化**：一个首屏需要调 10+ 个微服务接口（用户、商品、库存、活动、风控...），前端网络往返（RTT）导致白屏时间过长。
    *   **字段冗余与不匹配**：后端 Java/Go 微服务返回的 JSON 结构庞大且“充满了后端思维”，甚至存在 `Long` 类型超长导致前端 JS 精度丢失，或者时间戳格式各端不统一。
    *   **业务逻辑散落**：逻辑写在前端太重（影响性能），写在后端太死（响应业务变动慢）。
*   **预期目标**：
    *   **一站式聚合**：前端发起 1 个请求，BFF 并行聚合 N 个服务，返回精准的 View Model。
    *   **多端适配（Backends for Frontends）**：App 需要精简数据，PC 需要详细数据，H5 需要转换格式，BFF 动态按需裁剪。
    *   **性能保障**：利用 Node.js 非阻塞 I/O 的天生优势，支撑高并发的 IO 密集型聚合逻辑。

## 2. 核心架构与设计思路 (Design & Best Practice)
*10 年经验总结：BFF 不是简单的 Proxy，而是一个“数据工厂”。*

*   **思路解析：模块化与面向切面 (AOP)**
    *   **选用 NestJS 作为底座**：借助其 IoC（控制反转）和 DI（依赖注入）解决服务间错综复杂的调用关系，避免 `require` 地狱。
    *   **请求分层处理**：
        1.  **Gateway 层**：统一鉴权 (Guards)、限流、CORS。
        2.  **Aggregation 层 (Service)**：并发发起请求。利用 `Promise.allSettled` 而非 `Promise.all`，确保部分微服务挂掉时，非核心业务能优雅降级。
        3.  **Transformation 层 (Interceptor/Pipe)**：对数据进行清洗、格式化、DTO 校验。
    *   **内存级缓存策略**：对于不常变动的基础配置、字典数据，在 BFF 层做短时 Redis 缓存或本地内存缓存 (LRU)，极大降低对后端微服务的压力。

## 3. 开箱即用：核心代码骨架 (Implementation)
*基于 NestJS 的业务聚合 Service 示例，体现“老炮”的严谨性。*

```typescript
// 业务聚合 Service：商品详情页聚合
@Injectable()
export class ProductBffService {
  constructor(
    private readonly itemService: ItemService,
    private readonly stockService: StockService,
    private readonly marketingService: MarketingService,
  ) {}

  async getProductDetail(productId: string, userId: string) {
    // 核心思路：并发聚合，各司其职
    // 使用 allSettled 防止单个非核心服务异常导致整个接口挂掉
    const [itemRes, stockRes, promoRes] = await Promise.allSettled([
      this.itemService.fetchBasicInfo(productId),
      this.stockService.checkInventory(productId),
      this.marketingService.getUserCoupon(userId, productId),
    ]);

    // 严谨的数据组装与容错
    return {
      id: productId,
      title: itemRes.status === 'fulfilled' ? itemRes.value.title : '商品信息暂不可用',
      price: itemRes.status === 'fulfilled' ? this.formatPrice(itemRes.value.rawPrice) : 0,
      stockStatus: stockRes.status === 'fulfilled' ? stockRes.value.hasStock : false,
      coupon: promoRes.status === 'fulfilled' ? promoRes.value : null,
      timestamp: Date.now(),
    };
  }

  // 统一的精度处理/格式转换
  private formatPrice(price: number): string {
    return (price / 100).toFixed(2);
  }
}
```

## 4. 边界情况与避坑补充 (Edge Cases & Gotchas)
*架构越灵活，坑越多。*

*   **并发量雪崩（Thundering Herd）**：
    *   **风险**：BFF 聚合了 10 个接口，如果 1000 个前端请求进来，BFF 会向后端发起 10000 个请求。后端微服务连接池瞬间被打爆。
    *   **老炮方案**：必须在 BFF 的 HttpModule 中配置**连接池限制**和**全局超时控制**。同时，对于核心接口强制接入 **熔断机制 (Circuit Breaker)**。
*   **Node.js 内存泄漏**：
    *   **风险**：在 BFF 层做大量的数据转换、生成大对象且没及时释放。
    *   **避坑**：不要在 Service 中持有业务请求相关的状态（保持单例无状态）。监控 `heapUsed`，严禁在全局作用域缓存大 JSON。
*   **异常屏蔽**：
    *   **方案**：后端微服务返回的原始错误信息（如：`SQL syntax error...`）绝不能透传给前端。利用 `Exception Filter` 统一拦截，转换成友好的业务错误码。
