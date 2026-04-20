# 单点实战与最佳实践 [阿里云/腾讯云 OSS 前端直传大文件切片与断点续传极简架构]

> **使用场景**：后台管理系统、网盘类应用、视频投稿平台中，用户需要上传几百 MB 甚至上 GB 的高清视频或设计大文件。如果直接通过前端 -> Node.js/Java 后端 -> OSS 的链路，会严重吃满后端服务器的内存和带宽，导致服务雪崩。必须采用“前端获取签名 -> 前端直传 OSS -> 告知后端”的架构。

## 1. 痛点与需求场景 (Context)
* **原始痛点**：
  - **带宽打爆与 OOM**：1GB 的视频如果先上传到业务服务器，Nginx 会报 `413 Request Entity Too Large`。哪怕放开了限制，Node.js 解析 Multipart FormData 会消耗几百兆内存，且占用服务器的公网出口带宽，极易引发 OOM 宕机和接口超时。
  - **断网重传噩梦**：传统的单线程直传（PutObject），一旦传到 99% 时网络抖动断开，用户必须从 0% 重新上传，体验极差。
* **预期目标**：
  - **后端无感知 (Zero-Bandwidth)**：大文件的字节流绝对不能经过业务服务器，只走 STS（Security Token Service）临时临时凭证鉴权。
  - **切片与并发**：将 1GB 文件切成 10MB 的小块，前端使用 3-5 个并发请求同时上传（Multipart Upload），极大提升上传速度。
  - **断点续传与秒传**：前端计算文件 Hash（如 MD5），如果 OSS 上已有，直接“秒传”；如果断网，只重传失败的切片。

## 2. 核心架构与设计思路 (Design & Best Practice)
* **三步走直传架构**：
  1. **鉴权阶段**：前端发起请求 `GET /api/oss/sts`，后端调用阿里云/腾讯云 SDK 获取一个有效期为 15-60 分钟的临时 AccessKey、SecretKey 和 Token，返回给前端。
  2. **上传阶段 (核心)**：前端使用官方 OSS Browser SDK（如 `ali-oss`），拿着临时凭证，配置分片大小和并发数，直接把文件流 `PUT` 到云厂的 Bucket 中。
  3. **落库阶段**：上传成功后，OSS 返回一个唯一的 URL 或 ETag。前端将这个 URL 和业务数据（如视频名称、作者）作为普通 JSON 提交给业务后端保存。

## 3. 开箱即用：核心代码骨架 (Implementation)

以阿里云 OSS (ali-oss) 为例，实现分片与断点续传的极简封装。

### 3.1 前端核心上传逻辑 (Vue/React 适用)

```javascript
import OSS from 'ali-oss';

// 1. 获取后端的 STS 临时凭证 (需要你自己写个后端接口)
const getStsToken = async () => {
  const res = await fetch('/api/oss/sts').then(r => r.json());
  return res.data; // { accessKeyId, accessKeySecret, stsToken, region, bucket }
};

// 2. 初始化 OSS 客户端 (每次上传前最好重新获取，防止过期)
const initOSSClient = async () => {
  const creds = await getStsToken();
  return new OSS({
    region: creds.region, // 例如：oss-cn-hangzhou
    accessKeyId: creds.accessKeyId,
    accessKeySecret: creds.accessKeySecret,
    stsToken: creds.stsToken,
    bucket: creds.bucket,
    secure: true, // 强制 HTTPS
  });
};

// 3. 执行分片断点续传的核心函数
export const uploadBigFile = async (
  file: File, 
  objectName: string, 
  onProgress: (percent: number) => void
) => {
  const client = await initOSSClient();
  
  // 用于记录中断点（CheckPoint），存入 localStorage，断网恢复后可继续
  const checkpointKey = `oss_cp_${file.name}_${file.size}`;
  let tempCheckpoint: any = null;

  try {
    // 尝试读取本地的 checkpoint
    const savedCp = localStorage.getItem(checkpointKey);
    if (savedCp) {
      tempCheckpoint = JSON.parse(savedCp);
    }

    // 核心 API: multipartUpload
    const result = await client.multipartUpload(
      objectName, // 存到 OSS 的路径+文件名，如 'videos/2023/xxx.mp4'
      file, 
      {
        // 开启并行上传，建议 3-5 个
        parallel: 4,
        // 分片大小，推荐 1MB - 10MB 之间（必须大于 100KB）
        partSize: 2 * 1024 * 1024, // 2MB
        // 如果有断点记录，传入它就能续传
        checkpoint: tempCheckpoint,
        
        // 进度回调
        progress: (p, cp, res) => {
          // p: 0.00 到 1.00 的浮点数
          onProgress(Math.floor(p * 100));
          // 保存最新的检查点到本地，以便断网刷新后恢复
          if (cp) {
             localStorage.setItem(checkpointKey, JSON.stringify(cp));
          }
        },
        
        // HTTP 头部设置，如声明文件类型，或者设置下载时的附件名称
        headers: {
          'Content-Disposition': 'inline', 
        }
      }
    );

    // 上传 100% 成功，清除本地的断点记录
    localStorage.removeItem(checkpointKey);
    
    // 返回最终的绝对访问地址（如果 OSS 绑定了自定义域名，可以替换掉 result.name 前面的部分）
    const finalUrl = `https://${client.options.bucket}.${client.options.region}.aliyuncs.com/${result.name}`;
    return finalUrl;

  } catch (error: any) {
    console.error('上传中断或失败:', error);
    // 注意：如果是用户主动 cancel()，error.name 会是 'cancel'
    if (error.name === 'cancel') {
       console.log('用户暂停了上传');
    }
    throw error;
  }
};
```

### 3.2 进阶：如何做“秒传” (大厂必备)
秒传的本质是：不传文件，只传 Hash。
1. 前端在正式上传前，使用 `spark-md5` 配合 `FileReader.readAsArrayBuffer` 和 Web Worker，将大文件切片计算出唯一的 MD5 值（计算 1GB 文件大概需要 2-5 秒）。
2. 前端先发一个极快的小请求给后端：`POST /api/oss/check { hash: 'xxxxx' }`。
3. 后端查库：如果数据库里已经有这个 Hash 对应的文件记录，直接告诉前端“已存在该文件，秒传成功”，并把已存在的 OSS URL 返回。前端直接跳过后面的 OSS SDK `multipartUpload`，进度条瞬间 100%。

## 4. 边界情况与避坑补充 (Edge Cases & Gotchas)
* **STS 凭证过期导致的上传腰斩**：OSS SDK 在上传极大文件（如几个 G 需要传几十分钟）时，如果后端的 STS Token 只有 15 分钟有效期，会在传到一半时报 403 AccessDenied。**解法**：在 `ali-oss` 的初始化配置中，提供 `refreshSTSToken` 异步回调函数（SDK v6.x 支持），让 SDK 在快过期时自动去后端续期凭证，而不是传死值。
* **CORS 跨域神坑**：前端直接 `PUT` 阿里云的 Bucket 域名，必然会跨域。必须去阿里云控制台的 Bucket 设置 -> 数据安全 -> 跨域设置中，配置一条规则：来源设为你的业务域名（本地调试可以填 `*`），**允许的方法必须勾选 PUT, POST, GET, HEAD, DELETE，允许的 Header 设为 `*`，暴露的 Header 必须勾选 `ETag`。**
* **Bucket 权限千万不要设为公共读写**：如果 Bucket 是“公共读写”，黑客拿到你的 Bucket 名称就可以无限刷你的流量甚至注入木马，导致你一夜破产。**最佳实践是：私有读写 + STS 临时授权直传。**或者读权限配公共读，但写权限必须是私有。
