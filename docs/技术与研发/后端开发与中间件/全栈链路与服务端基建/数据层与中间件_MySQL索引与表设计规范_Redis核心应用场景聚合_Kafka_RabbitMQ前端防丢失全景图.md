# 数据层与中间件：MySQL索引规范、Redis核心场景与MQ防丢失全景图

## 1. Context (痛点与需求场景)

随着前端边界不断延展（Node.js/BFF层），全栈开发者必须深入后端核心地带：数据库与消息中间件。在面对高并发、大流量的真实业务场景时，以下痛点尤为突出：

1. **MySQL 性能滑铁卢**：表结构随意设计（动辄 `SELECT *`、滥用 `TEXT`），索引凭感觉加（导致索引失效、死锁频发），数据量一过百万查询就卡顿（全表扫描）。
2. **Redis 认知局限**：只知道拿 Redis 做简单的 KV 缓存（`SET/GET`），不了解其丰富的数据结构（Hash、List、ZSet）在排行榜、限流、分布式锁等高阶场景下的妙用，甚至引发缓存穿透、击穿、雪崩。
3. **MQ (消息队列) 盲区**：为什么引入 Kafka 或 RabbitMQ？只知道能“异步解耦”，却不知道消息是如何丢失的（生产者丢、MQ宕机丢、消费者丢），以及如何保证消息的幂等性（防重复消费）。

本篇以 10 年资深架构师的视角，梳理这些核心中间件的避坑指南与最佳实践。

## 2. Design & Best Practice (核心架构与设计思路)

### 2.1 MySQL 索引与表设计规范
- **表设计铁律**：
  - **禁用物理外键**：互联网高并发场景下，外键会导致严重的锁竞争和性能开销，关联关系一律由应用层（代码）维护。
  - **禁用级联删除/更新**：同上。
  - **必须有主键**：推荐使用无业务意义的自增 ID（如雪花算法生成的 bigint）作为主键，避免页分裂（B+树机制决定）。
  - **字段类型精简**：能用 `int` 不用 `varchar`，能用 `varchar(50)` 不用 `varchar(255)`。禁用或慎用 `TEXT/BLOB`（会消耗大量的临时表空间）。
  - **强制 `NOT NULL`**：允许 NULL 会导致索引统计失效和额外的存储开销，请使用默认值（如空字符串 `""` 或 `0`）。
- **索引避坑指南（避免索引失效）**：
  - **最左前缀法则**：联合索引 `(a, b, c)`，如果查询条件只有 `b = 1` 或 `c = 1`，索引失效。
  - **隐式类型转换**：字符串类型字段，传参时不加引号（如 `WHERE name = 123`），索引失效。
  - **函数与计算**：`WHERE YEAR(create_time) = 2023` 或 `WHERE id + 1 = 10`，索引失效。
  - **模糊查询**：`WHERE name LIKE '%zhang'`（左侧有 `%`），索引失效。

### 2.2 Redis 核心应用场景聚合
- **String (字符串)**：常规缓存、计数器（点赞/阅读量，利用 `INCR` 原子性）、分布式锁（`SETNX` 或 Redisson）。
- **Hash (哈希)**：存储对象（如用户信息 `{id: 1, name: "xx", age: 20}`），比序列化为 JSON 存 String 更节省内存，且支持部分更新（`HSET`）。
- **List (列表)**：简单的消息队列（`LPUSH` + `BRPOP`）、最新动态时间线（朋友圈 Timeline）。
- **Set (集合)**：去重（如独立访客 UV 统计的粗略版）、交集并集差集（共同好友、可能认识的人）。
- **ZSet (有序集合)**：排行榜（按积分排序，`ZADD` / `ZREVRANGE`）、延迟队列（用时间戳作为 score）。
- **高阶结构**：`HyperLogLog`（海量 UV 统计，误差极小且省内存）、`Geo`（附近的人/打车距离计算）、`Bitmap`（用户签到日历）。

### 2.3 Kafka / RabbitMQ 防丢失全景图
引入 MQ 的核心目的是：**异步**、**削峰**、**解耦**。但必须解决“消息丢失”和“重复消费”的问题：
- **生产者防丢**：
  - 发送消息必须有回调确认（ACK 机制）。如 Kafka 的 `acks=all`，RabbitMQ 的 `confirm` 模式。
  - 配合本地消息表（或事务消息），如果发送失败则后台定时重试。
- **MQ 自身防丢**：
  - 开启持久化（Persistence）。RabbitMQ 需要将 Exchange、Queue、Message 都标记为持久化；Kafka 天生落盘，需配置多副本（Replica）同步机制。
- **消费者防丢**：
  - 关闭自动 ACK（Auto ACK），改为消费成功（业务逻辑走完，如写入数据库）后，**手动 ACK**。如果在处理过程中抛出异常，则拒绝确认或重试。
- **防重复消费（幂等性）**：
  - 消息必须带全局唯一 ID（如订单号）。
  - 消费者在处理前，先去 Redis（`SETNX`）或 MySQL（唯一索引）查询该 ID 是否已处理。如果处理过，直接丢弃（或返回成功）。

## 3. Implementation (最佳实践与核心选型参考)

### 3.1 Node.js 优雅连接 MySQL 与 Redis 的最佳实践

在 BFF 层，使用连接池（Connection Pool）是高并发的基础。

```javascript
// Node.js (基于 mysql2 和 ioredis) 的健壮连接配置示例
const mysql = require('mysql2/promise');
const Redis = require('ioredis');

// MySQL 连接池配置
const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,   // 最大连接数（根据服务器核数和并发调整，并非越大越好）
  queueLimit: 0,
  enableKeepAlive: true, // 保持心跳防掉线
  keepAliveInitialDelay: 0
});

// Redis 哨兵/集群高可用配置 (或单机)
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  db: 0,
  maxRetriesPerRequest: 3, // 失败重试上限，防止无限重试拖垮主线程
  retryStrategy(times) {
    // 指数退避重连策略
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

// 优雅的错误捕获与自动重连机制
redisClient.on('error', (err) => {
  console.error('🔴 Redis Connection Error:', err);
  // 这里可以接入告警系统 (如 Sentry, 钉钉机器人)
});

module.exports = { dbPool, redisClient };
```

### 3.2 解决缓存击穿、穿透与雪崩的经典方案 (架构师必问)

- **缓存穿透 (Cache Penetration)**：查询一个**根本不存在**的数据（如 `id = -1`），缓存未命中，请求直达 DB。如果黑客疯狂发起这类请求，DB 会瞬间崩溃。
  - **解决**：方案一：缓存空对象（设置短过期时间）。方案二：布隆过滤器（Bloom Filter），在请求 DB 前先判断该 ID 是否存在于布隆过滤器中。
- **缓存击穿 (Cache Breakdown)**：一个**极其热点**的 Key（如微博热搜），在它过期的瞬间，海量并发请求同时涌入，发现缓存失效，全部跑去 DB 查询重建缓存，导致 DB 瞬间压力过大。
  - **解决**：方案一：热点 Key 永不过期（或后台定时任务主动刷新）。方案二：加**互斥锁**（如 Redis `SETNX`），只允许一个线程去 DB 查数据并重建缓存，其他线程等待重试。
- **缓存雪崩 (Cache Avalanche)**：**大量**的缓存 Key 在同一时间集体过期，或者 Redis 直接宕机，导致海量请求全部涌向 DB。
  - **解决**：方案一：给不同的 Key 设置随机的过期时间（例如 `基准时间 + 随机1-5分钟`），打散过期点。方案二：Redis 高可用集群架构（主从+哨兵，或 Cluster）。方案三：服务降级、熔断与限流（如接入 Sentinel/Hystrix）。

## 4. Edge Cases & Gotchas (边界情况与避坑补充)

1. **MySQL 深度分页慢查询**：`SELECT * FROM table LIMIT 1000000, 10`。偏移量越往后，MySQL 需要扫描的数据行越多，最后抛弃前 100 万行，性能极差。
   - **避坑/优化**：**延迟关联（覆盖索引扫描）**或**游标分页**。如记录上一页最后一条的 ID：`SELECT * FROM table WHERE id > 1000000 LIMIT 10`。
2. **Redis 大 Key 阻塞主线程**：Redis 是单线程处理命令的。如果一个 Hash 或 List 存了数百万个元素（Big Key），当你执行 `HGETALL` 或删除它时，整个 Redis 实例会被阻塞数秒，导致其他业务全军覆没。
   - **避坑**：坚决拆分 Big Key（打散存入多个小 Key），或使用 `SCAN`/`HSCAN` 游标分批读取，删除时使用 `UNLINK` (异步删除) 替代 `DEL`。
3. **MQ 消息积压报警**：消费者挂了或者消费速度跟不上生产者，导致队列中堆积了百万条消息。
   - **避坑/急救**：临时开启多个消费者实例加快处理；或者写一个紧急的中转程序，快速把积压的消息转移到另外一个更大容量的新队列，然后再慢慢分配消费者去处理新队列。绝不能强行重启丢弃。
