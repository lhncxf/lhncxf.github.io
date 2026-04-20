# 单点实战与最佳实践 [Nest.js / Express.js 架构设计：中间件洋葱模型与企业级异常拦截链路]

> **使用场景**：前端同学转型全栈，或在团队内部搭建 BFF (Backend For Frontend) 层时。如果不理解 Node.js 框架的核心生命周期（洋葱模型、拦截器、异常过滤器），就会把身份校验、日志打印、错误捕获全揉在一个 Controller 的 `try-catch` 里，导致代码极度臃肿、日志丢失、500 报错直接让进程崩溃。

## 1. 痛点与需求场景 (Context)
* **原始痛点**：
  - **无休止的 Try-Catch**：每个接口的第一行都要 `try`，最后一行都要 `catch(e) { res.status(500).send('error') }`，写了 100 遍。如果有人忘了写，一个数据库断联的 Unhandled Promise Rejection 会直接导致整个 Node.js 进程退出（`pm2` 不断重启）。
  - **日志无法串联**：一个请求进来，怎么知道 Controller 里的报错，对应的是哪个用户的哪条 Access Log？请求耗时怎么算？如果放在 Controller 最后一行算耗时，一旦中间报错抛异常，最后一行就不会执行，耗时统计就丢了。
* **预期目标**：
  - **全局异常兜底 (Global Exception Filter)**：业务代码（Controller/Service）里只管 `throw new Error()` 或 `throw new HttpException()`，绝不写恶心的 `res.status(500)`，让统一的拦截器自动格式化返回。
  - **洋葱模型串联日志 (Middleware/Interceptor)**：利用 Koa/Nest 经典的洋葱圈模型，在最外层记录 Request 开始时间，在 `await next()` 之后的归发阶段，计算总耗时，无论中间是否报错。

## 2. 核心架构与设计思路 (Design & Best Practice)
* **洋葱圈模型 (Onion Model)**：
  - 请求像穿透洋葱一样，从最外层的中间件进入（Request 阶段），层层深入到 Controller 的核心业务逻辑，然后再从 Controller 逐层返回（Response 阶段）回到最外层。
  - 这意味着最外层的日志中间件可以包住所有的内层逻辑，它的 `try { await next(); } catch { ... }` 可以捕获里面所有的异步错误。
* **Nest.js 的请求生命周期 (Lifecycle)**：
  - 客户端请求 -> Middleware (全局日志/黑名单) -> Guard (鉴权/角色判断) -> Interceptor (缓存/耗时统计) -> Pipe (参数校验/DTO转化) -> Controller (业务调度) -> Service (查库) -> Exception Filter (兜底捕获异常) -> 响应客户端。

## 3. 开箱即用：核心代码骨架 (Implementation)

以现代化、基于 TypeScript 的企业级框架 **Nest.js** 为例，展示这套工业级链路的封装。如果是 Express，原理完全一样（也是中间件 + 错误处理中间件 `(err, req, res, next)`）。

### 3.1 统一响应拦截器 (Response Interceptor)
保证所有接口无论怎么写，返回给前端的数据结构永远是 `{ code: 0, data: {...}, msg: 'success' }`。这是基于洋葱模型的“回程阶段”处理的。

```typescript
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  // 洋葱模型的入口
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const startTime = Date.now();

    // next.handle() 代表进入了更深层的 Controller，它返回一个 Observable（RxJS）
    return next.handle().pipe(
      // 这里是洋葱模型的回程阶段（Controller 正常 return 数据后触发）
      map((data) => {
        const duration = Date.now() - startTime;
        console.log(`[API] ${req.method} ${req.url} - 耗时: ${duration}ms`);
        
        // 自动装配企业级标准 JSON 结构返回前端
        return {
          code: 0,
          data: data || null,
          message: '请求成功',
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
```

### 3.2 全局异常过滤器 (Global Exception Filter)
接管整个框架抛出的所有异常（无论是 `HttpException`，还是手残写的 `obj.undefined.name` 导致的 TypeError）。

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

// 拦截所有的错误 (如果不传参数，就是拦截 Error 基类)
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 1. 判断是否是我们业务代码里主动抛出的 HTTPException (如 401 鉴权失败，400 参数错误)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 2. 提取业务错误信息，或者如果是未捕获的代码崩溃，给出兜底提示
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : '服务器内部错误，请联系管理员';

    // 3. 将堆栈和错误日志写入文件/ES/钉钉报警 (这在生产环境极度重要)
    if (status === 500) {
      console.error(`[FATAL ERROR] ${request.url}`, exception);
      // alertDingTalk(exception.stack);
    } else {
      console.warn(`[API WARN] ${status} - ${message}`);
    }

    // 4. 组装符合前端口味的报错结构，并切断请求，把 HTTP 状态码统一置为 200 (前端好处理) 
    // 或者遵循 RESTful 把 500/400 真实返回
    response.status(status).json({
      code: status,
      data: null,
      message: typeof message === 'string' ? message : (message as any).message || message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

// 最后，在 main.ts 中全局挂载这两个拦截器
// app.useGlobalInterceptors(new TransformInterceptor());
// app.useGlobalFilters(new AllExceptionsFilter());
```

### 3.3 极其清爽的 Controller 业务代码
在配置好上面的基建后，BFF 的开发人员只需要关注纯粹的业务。**不写 try-catch，不组装 res 结构**。

```typescript
import { Controller, Get, Query, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  async getUserInfo(@Query('id') id: string) {
    if (!id) {
      // 这里的报错，会被 Exception Filter 自动抓住，转成标准 JSON 给前端
      throw new UnauthorizedException('缺少用户 ID'); 
    }
    
    // 如果查库的时候数据库断了抛出了 Connection Error，同样会被 Filter 抓住兜底 500
    const user = await this.userService.findById(id); 
    
    // 这里的返回值，会被 Transform Interceptor 自动包上一层 { code: 0, data: user }
    return user; 
  }
}
```

## 4. 边界情况与避坑补充 (Edge Cases & Gotchas)
* **未捕获的 Promise 拒绝 (Unhandled Rejection) 导致进程暴毙**：在老旧的 Node 14 甚至 Express 项目中，如果你在一个异步中间件里报错了且没有传给 `next(err)`，这个报错会直接漏掉导致前端一直请求挂起转圈。而在最新的 Node v16+ 中，一个游离在生命周期外的 `UnhandledPromiseRejection`（比如一个在背景启动的无关 `setTimeout` 报错了）会**直接 Kill 掉整个 Node 进程**。**解法**：永远在 `main.ts` 最顶部加上进程级事件监听兜底报警：`process.on('unhandledRejection', (reason) => { console.error('致命漏网之鱼:', reason) })`。
* **洋葱模型里 Next 不要多次调用**：在 Express 或 Koa 的手动编写中间件时，新手极易在 `if (a) return next();` 之后忘了加 `return`，导致后面的代码又调用了一次 `res.send()`。这会报经典的 `ERR_HTTP_HEADERS_SENT`（不能在响应已发送给客户端后再设置 Header）。**解法**：养成习惯，只要调用了 `next()` 或 `res.send`，立刻 `return`。
