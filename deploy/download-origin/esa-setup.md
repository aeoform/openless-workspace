# ESA 接入清单（dl.aeoform.com）

## 1. DNS

```
dl.aeoform.com   CNAME   <ESA 分配的接入地址>      # 或 A 记录指向 ESA 边缘
```

ESA 控制台 → 站点 → 添加站点/域名 `dl.aeoform.com`（它与 `openless.top` 是两个站点，证书各自签发）。

## 2. 回源

| 项 | 值 |
| --- | --- |
| 源站地址 | `47.92.50.208` |
| 端口 | **80** |
| 协议 | HTTP |
| 回源 Host | `dl.aeoform.com`（必须是这个，nginx 用 `server_name` 匹配；用 IP 当 Host 会落到默认站） |
| 回源超时 | 连接 10s / 读取 120s（大文件） |

nginx 侧已经确认：`Host: dl.aeoform.com` → 206/200，`/etc/passwd` → 404，其他 Host 不受影响。

## 3. 缓存规则（`/releases/` 前缀，优先级最高）

| 配置项 | 值 | 原因 |
| --- | --- | --- |
| 缓存过期时间 | **365 天** | 路径里含 tag，内容不可变 |
| 忽略查询字符串 | 开 | 该路径不需要 query |
| 缓存键 | 忽略 Cookie、忽略 Authorization | 匿名下载 |
| 可缓存状态码 | 200、206 | 断点续传走 206 |
| 不缓存状态码 | 3xx、4xx、5xx | 404 不要被记住 |
| Range 回源 | 透传 / 开启分段缓存 | 否则 206 会被降级成全量回源 |
| 强制 HTTPS | 开 | 下载地址对外只有 https |
| 压缩 | 关（`/releases/`） | 二进制 |
| 回源失败重试 | 1 次，回源不可用时不返回过期缓存 | 宁可报错也不要给旧文件 |

`/` 与 `/healthz` 不需要规则。

## 4. 验证

```bash
F=v2.0.1-tauri/OpenLess_2.0.1%2Bbuild.20261016_aarch64.dmg

curl -sI "https://dl.aeoform.com/releases/$F" | grep -iE 'HTTP/|cache-control|content-length'
# 期望：200 · cache-control: public, max-age=31536000, immutable

curl -s -o /dev/null -w '%{http_code} %{speed_download}\n' \
  "https://dl.aeoform.com/releases/$F" -r 0-8388607
# 期望：206，速度接近用户带宽

curl -sI "https://dl.aeoform.com/releases/$F" -H 'Range: bytes=0-1023' -D- -o /dev/null | grep -iE 'HTTP/|content-range'
# 期望：206 + content-range

curl -s -o /dev/null -w '%{http_code}\n' "https://dl.aeoform.com/releases/nope.dmg"
# 期望：404（且不应被缓存）
```

EAS 的响应头里如果带 `X-Cache: HIT` / `Ali-Cdn-...` 之类，第二次请求应命中缓存。

## 5. 前端

`.env.production` 已经写了：

```
NEXT_PUBLIC_DL_BASE=https://dl.aeoform.com
```

构建期注入。运行时会 `HEAD` 一次 `…/releases/<tag>/SHA256SUMS` 探活：
失败则所有链接自动退回 GitHub 的 `releases/latest/download/...`，菜单底部同时给出「镜像打不开？走 GitHub」。

要临时关掉镜像，删掉该行重新构建即可。
