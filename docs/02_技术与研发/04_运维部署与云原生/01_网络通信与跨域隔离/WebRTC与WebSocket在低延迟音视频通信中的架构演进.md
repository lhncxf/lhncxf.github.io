# WebRTC与WebSocket在低延迟音视频通信中的架构演进

> **使用场景**：记录从传统的 WebSocket 伪直播/长连接通信向 WebRTC P2P 架构演进过程中的技术决策、底层协议差异以及在复杂网络环境下的避坑经验。重点解剖信令交换、NAT 穿透及媒体流传输的底层逻辑。

## 1. 故障现场 (Phenomenon)
在早期低延迟监控或 1 1 视频通话业务中，单纯依赖 WebSocket (WS) 或 HTTP-FLV 往往会遇到以下瓶颈：
* **现象描述**：随着通话时长增加，视频画面出现明显的累积延迟（从 1-2s 逐渐漂移至 5s+）；在弱网（丢包率 > 5%）环境下，画面卡顿频繁且难以恢复。
* **影响范围**：主要在 Web 端 H5 播放器，尤其是移动端 4G/5G 切换场景。
* **复现路径**：通过 Chrome DevTools 网络模拟 300ms 延迟及 10% 随机丢包，WS 方案因 TCP 重传机制导致缓冲区堆积，延迟瞬间爆炸。

## 2. 深度排查链路追踪 (Root Cause Analysis)

### 2.1 排查步骤 1：协议栈底层的“原罪”
WS 基于 TCP，其核心目标是“可靠传输”。但在实时音视频领域，**“及时性”远比“完整性”重要**。
* **TCP 的坑**：由于 TCP 强制有序且必须 ACK，一旦发生丢包，后续所有数据包都会在接收端缓冲区等待重传（队头阻塞），导致实时画面无法追赶。
* **结论**：音视频实时通信必须转向基于 UDP 的传输，而 WebRTC 正是这一领域的事实标准。

### 2.2 排查步骤 2：信令与媒体流的解耦分析
WebRTC 并不是用来替代 WebSocket 的，它们在架构中是协作关系。
* **WS 的角色**：作为信令服务器（Signaling），负责 SDP（会话描述协议）交换、ICE Candidates 传递。
* **WebRTC 的角色**：负责媒体面（Media Plane）的 P2P 传输、SRTP 加密及码率自适应。

### 2.3 最终定位 (Root Cause)
* **根因**：低延迟通信的演进本质上是**传输协议从 TCP 到 UDP 的跃迁**，以及**NAT 穿透 (ICE) 机制对复杂内网环境的适配**。
* **关键技术难点**：
    * **STUN/TURN**：解决内网穿透问题。STUN 负责获取公网 IP，当对称型 NAT 无法穿透时，必须降级到 TURN 服务器中转。
    * **SDP 协商**：确定编解码格式（H.264/VP8/Opus）以及传输参数。
    * **码率自适应 (GCC/BWE)**：根据网络评估实时调整编码器输出，防止带宽过载。

## 3. 最终修复方案与底层解剖 (Resolution & Core Diff)

### 核心架构演进逻辑

```javascript
// 早期 WS 伪实时模式 (Anti-pattern for Ultra-low latency)
socket.on('message', (data) => {
    // 收到数据包后入队，由解码器按顺序播放
    // 缺点：TCP 重传导致延迟累积，无法丢弃过期帧
    videoBuffer.push(data);
});

// WebRTC 模式 (Best Practice)
const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'turn:my-turn-server.com', username: '...', credential: '...' }]
});

// 1. 监听媒体流轨道
peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
};

// 2. 通过 WebSocket 交换信令 (SDP/ICE)
ws.onmessage = async (msg) => {
    const { type, sdp, candidate } = JSON.parse(msg.data);
    if (type === 'offer') {
        await peerConnection.setRemoteDescription(new RTCSessionDescription({ type, sdp }));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        ws.send(JSON.stringify(peerConnection.localDescription));
    } else if (candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
};
```

### 深入底层原理 (Why it Works)
1. **UDP vs TCP**：WebRTC 使用 UDP 传输。在弱网下，它允许丢失个别非关键帧，通过 NACK/FEC（前向纠错）机制平衡延迟与质量，彻底规避了 TCP 的队头阻塞。
2. **ICE 协商机制**：
    * **STUN (Session Traversal Utilities for NAT)**：轻量级，获取外网映射 IP，90% 的普通 NAT 环境可直连。
    * **TURN (Traversal Using Relays around NAT)**：当 P2P 彻底不通时（如某些企业防火墙），作为最后的兜底中转。
3. **码率自适应**：WebRTC 内部集成 GCC (Google Congestion Control)，通过计算 RTT 和丢包率实时反馈给编码器，动态下调/上调 Bitrate。

## 4. 全局规避策略与工程化防腐 (Prevention)
* **监控体系**：音视频不是黑盒。必须通过 `getStats()` API 实时监控 `inbound-rtp` 的丢包率、抖动（Jitter）和 RTT，建立前端质量评分系统。
* **信令可靠性**：虽然媒体流用 UDP，但信令交换（SDP）必须是可靠的。WS 掉线自动重连及消息回执（ACK）机制必不可少。
* **服务端选型**：在多人场景（SFU/MCU）下，不能仅依赖 P2P，需要引入如 Mediasoup 或 Janus 这种高性能 SFU 服务器，将 P2P 复杂度上移到服务端。
* **规范拦截**：严禁在 WebRTC 线程中执行耗时的 CPU 计算，防止影响音频采样和视频编解码的时钟同步。