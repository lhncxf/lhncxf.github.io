# Nest.js

## 一、Nest.js简介
Nest.js 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的框架。它使用现代 JavaScript，并结合了 OOP（面向对象编程）、FP（函数式编程）和 FRP（函数响应式编程）的最佳实践。Nest.js 提供了一个强大的 CLI 工具来帮助开发者快速创建项目结构，同时支持 TypeScript 和 JavaScript。

## 二、安装与环境搭建
- **全局安装 Nest CLI**：首先需要确保你已经安装了 Node.js 和 npm。然后通过以下命令全局安装 Nest CLI。
    ```bash
    npm install -g @nestjs/cli
    ```
- **创建新项目**：使用 Nest CLI 创建一个新的项目。
    ```bash
    nest new project-name
    ```
- **运行项目**：进入项目目录并启动开发服务器。
    ```bash
    cd project-name
    npm run start
    ```

## 三、基础概念
1. **模块 (Modules)**：Nest.js 应用由多个模块组成，每个模块都是一个带有 `@Module()` 装饰器的类。模块定义了控制器、提供者和其他模块之间的关系。
2. **控制器 (Controllers)**：负责处理传入的请求并返回响应给客户端。它们通过路由机制将请求映射到相应的处理器方法上。
3. **提供者 (Providers)**：是注入到控制器或其他提供者的依赖项。最常见的提供者是服务（Service），用于执行特定业务逻辑。
4. **装饰器 (Decorators)**：用于元数据附加，如 `@Controller()`, `@Injectable()`, `@Get()`, `@Post()` 等。

## 四、快速开始
创建一个简单的控制器：
```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```
在模块中声明该控制器：
```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';

@Module({
  controllers: [CatsController],
})
export class AppModule {}
```

## 五、服务与依赖注入
创建服务以分离业务逻辑：
```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```
并在控制器中注入服务：
```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  findAll(): Cat[] {
    return this.catsService.findAll();
  }
}
```

## 六、中间件
中间件可以用来处理请求之前或之后的操作。例如日志记录、身份验证等。
```typescript
import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

## 七、异常过滤器
为了统一处理应用中的异常，可以创建自定义异常过滤器。
```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
```

## 八、GraphQL 支持
Nest.js 对 GraphQL 有很好的支持，可以通过 `@nestjs/graphql` 模块轻松集成 GraphQL API。
```typescript
import { Resolver, Query } from '@nestjs/graphql';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Resolver('Cat')
export class CatsResolver {
  constructor(private readonly catsService: CatsService) {}

  @Query('cats')
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

## 九、测试
- **单元测试**：使用 Jest 进行单元测试。
    ```typescript
    describe('AppController', () => {
      let appController: AppController;

      beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
          controllers: [AppController],
          providers: [AppService],
        }).compile();

        appController = app.get<AppController>(AppController);
      });

      describe('root', () => {
        it('should return "Hello World!"', () => {
          expect(appController.getHello()).toBe('Hello World!');
        });
      });
    });
    ```
- **集成测试**：模拟 HTTP 请求进行集成测试。

## 十、部署与运维
- **选择合适的托管平台**：Heroku、DigitalOcean、AWS 等提供了便捷的 Node.js 部署方案。
- **容器化**：Docker 可以让你的应用程序在一个隔离的环境中运行，便于迁移和扩展。
- **监控工具**：New Relic、Datadog 等工具可用于监控应用性能，及时发现并解决问题。

## 结语
Nest.js 为构建稳健、可靠的后端服务提供了一套全面的解决方案。对于前端工程师来说，掌握 Nest.js 不仅拓宽了技术栈，也为全栈开发打下了坚实的基础。希望这篇笔记能够为你提供一个全面的学习路径，助你在 Nest.js 的世界里不断进步。记住，实际操作和项目经验是掌握任何新技术的关键，所以不要犹豫，开始你的第一个 Nest.js 项目吧！
