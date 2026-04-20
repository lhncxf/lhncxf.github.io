# Web 网络与系统运维：HTTP演进、TCP/IP核心防坑与Linux/Nginx高频指令盘点

## 1. Context (痛点与需求场景)

全栈开发者在完成业务代码后，往往需要面对复杂的部署与运维环境。从浏览器敲下 URL 到页面渲染，这中间经历了复杂的网络协议栈流转。
常见痛点包括：
1. **网络排查能力弱**：接口超时、连接重置（Connection Reset）、跨域失败，面对 `502 Bad Gateway` 或 `504 Gateway Timeout` 时不知从何下手。
2. **协议认知停留在表面**：不清楚 HTTP/1.1 的队头阻塞、HTTP/2 的多路复用与头部压缩、HTTP/3 的 QUIC 底层原理，导致性能优化无从谈起。
3. **TCP/IP 踩坑**：高并发场景下的 `TIME_WAIT` 堆积、`CLOSE_WAIT` 溢出、TCP KeepAlive 与 HTTP Keep-Alive 的混淆。
4. **Linux/Nginx 运维不熟练**：查日志还在用下载到本地慢慢看，配置反向代理、负载均衡、HTTPS 证书一改就错。

## 2. Design & Best Practice (核心网络原理与防坑指南)

### 2.1 HTTP 协议演进史与核心突破
- **HTTP/1.1**：
  - **特点**：长连接（Keep-Alive）默认开启，Pipeline 管道化（鸡肋，很少用）。
  - **痛点**：**队头阻塞 (Head-of-line Blocking)**，同一个 TCP 连接里的请求必须串行响应；头部未经压缩，浪费带宽。
- **HTTP/2**：
  - **突破**：二进制分帧层，**多路复用 (Multiplexing)**（一个 TCP 连接并发多个请求/响应流，解决 HTTP 层面队头阻塞），**HPACK 头部压缩**，Server Push。
  - **痛点**：底层依然是 TCP。如果发生 TCP 丢包，整个 TCP 连接的滑动窗口会阻塞（**TCP 层面的队头阻塞**），影响该连接上的所有 HTTP/2 Stream。
- **HTTP/3 (QUIC)**：
  - **突破**：基于 UDP。实现了用户态的可靠传输和拥塞控制。彻底解决了 TCP 队头阻塞。支持 0-RTT 建连，网络切换（如 Wi-Fi 切换到 5G）时连接不断开（基于 Connection ID）。

### 2.2 TCP/IP 核心防坑：三次握手与四次挥手
- **TIME_WAIT 堆积**：主动关闭连接的一方会进入 `TIME_WAIT` 状态（2MSL，约60秒）。高并发短连接场景下，服务器会耗尽端口资源导致无法建立新连接。
  - **解决**：修改 `sysctl.conf`，开启 `net.ipv4.tcp_tw_reuse = 1`（复用 TIME_WAIT 套接字）或调整应用层为长连接池。
- **CLOSE_WAIT 溢出**：被动关闭方收到 FIN，回复 ACK，但没有调用 `close()` 发送自己的 FIN。通常是业务代码（Node.js/Java）中由于死锁或未正确捕获异常，导致 Socket 忘记关闭。
  - **解决**：排查代码逻辑，确保在 `finally` 块中关闭连接。
- **Keep-Alive 的混淆**：
  - HTTP Keep-Alive：复用 TCP 连接，减少握手开销。
  - TCP KeepAlive：操作系统内核层面的保活探针，用于检测死连接（如拔网线）。

## 3. Implementation (开箱即用 Linux/Nginx 高频实战库)

作为 10 年资深全栈/架构师，以下是服务器上最常用的排障与配置工具。

### 3.1 Nginx 高阶配置：反向代理、负载均衡与缓存
这套配置涵盖了安全头、Gzip 压缩、跨域处理、反向代理与强缓存。

```nginx
# nginx.conf (部分优化配置)
http {
    # 基础性能优化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;

    # Gzip 压缩，显著提升前端静态资源加载速度
    gzip on;
    gzip_min_length 1k;
    gzip_comp_level 5; # 推荐 4-6，太高消耗 CPU
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # 代理缓存配置
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m use_temp_path=off;

    upstream backend_cluster {
        # 轮询 (默认) / weight (权重) / ip_hash (会话保持)
        server 10.0.0.1:3000 weight=3;
        server 10.0.0.2:3000 weight=1 max_fails=3 fail_timeout=30s;
    }

    server {
        listen 443 ssl http2;
        server_name api.example.com;

        ssl_certificate /etc/nginx/certs/fullchain.cer;
        ssl_certificate_key /etc/nginx/certs/example.key;
        ssl_protocols TLSv1.2 TLSv1.3; # 淘汰老旧协议

        # 全局安全头防范 XSS / Clickjacking
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";

        location /api/ {
            # 处理 CORS 跨域请求
            if ($request_method = 'OPTIONS') {
                add_header 'Access-Control-Allow-Origin' '$http_origin';
                add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
                add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
                add_header 'Access-Control-Max-Age' 1728000;
                add_header 'Content-Type' 'text/plain charset=UTF-8';
                add_header 'Content-Length' 0;
                return 204;
            }

            # 透传真实的客户端 IP
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # 代理到后端 Node.js/Java 集群
            proxy_pass http://backend_cluster;
        }

        location /static/ {
            # 强缓存配置，配合前端打包的文件指纹
            alias /var/www/html/static/;
            expires 365d;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### 3.2 Linux 极速排错高频指令

日常运维不需要死记硬背所有命令，只需掌握能快速定位“在哪死机”、“谁占了端口”、“日志报什么错”的指令：

| 排错场景 | 核心命令 & 示例用法 | 架构师视角解读 |
| :--- | :--- | :--- |
| **看日志报错** | `tail -f /var/log/nginx/error.log \| grep -i "timeout"` | 实时追踪并过滤关键字。比下载下来看快 100 倍。 |
| **搜日志上下文** | `grep -C 5 "NullPointerException" app.log` | `-C 5` 表示打印匹配行的前后各 5 行，找寻报错上下文必备。 |
| **查端口被谁占用** | `netstat -tlnp \| grep 8080` 或 `lsof -i :8080` | 发现 8080 端口被占导致 Node.js 启不来时的第一步。 |
| **查并发连接数** | `netstat -n \| awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'` | 统计 `ESTABLISHED`, `TIME_WAIT`, `CLOSE_WAIT` 的数量，排查连接池打满。 |
| **查 CPU/内存** | `top` (按大写 `P` 按 CPU 排序，按 `M` 按内存排序)，或 `htop` | 定位哪个进程导致了 OOM (Out Of Memory) 或 CPU 100%。 |
| **测网络连通性** | `curl -Iv https://api.github.com` | 查看 HTTP 响应头、SSL 证书握手详情，判断网络墙或 DNS 解析问题。 |
| **测试端口是否通** | `telnet 10.0.0.1 3306` 或 `nc -zv 10.0.0.1 3306` | 排查云服务器安全组/防火墙是否放行了 MySQL 端口（Ping 通不代表端口通）。 |
| **查找大文件** | `find / -type f -size +500M` 或 `du -sh * \| sort -rh` | 磁盘报警 100% 时，迅速定位积压的日志或核心转储 (core dump) 文件。 |

## 4. Edge Cases & Gotchas (边界情况与避坑补充)

1. **502 Bad Gateway 与 504 Gateway Timeout 的区别**：
   - `502`：Nginx 找到了后端服务（如 Node.js 进程死掉，或无法连接到 127.0.0.1:3000），连接被拒绝。
   - `504`：Nginx 连上了后端服务，但后端处理太慢（如慢查询、死锁），超过了 Nginx 的 `proxy_read_timeout`（默认 60s）。
2. **WebSocket 代理断开**：Nginx 代理 WebSocket 时，除了要加上 `proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "Upgrade";`，还需注意 `proxy_read_timeout` 默认为 60s。如果 60s 内 WebSocket 没有数据传输，Nginx 会主动切断连接。必须在前端代码中实现心跳（Ping/Pong），或者调大超时时间。
3. **DNS 缓存坑**：Nginx 中的 `proxy_pass http://api.xxx.com;` 如果写死域名，Nginx 仅在启动时解析一次 IP。如果该域名后端 IP 变动，Nginx 仍会请求旧 IP 导致 502。解决方案是使用 `resolver 114.114.114.114 valid=30s;` 并将 URL 赋值给变量。
4. **TIME_WAIT 是正常的机制，不是报错**：TIME_WAIT 的存在是为了确保 TCP 连接的可靠关闭，以及防止延迟的数据包在新的连接中被混淆。只有在堆积到数万、耗尽可用端口时才需要干预。
