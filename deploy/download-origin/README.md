# 下载源（ECS 47.92.50.208 / cn-zhangjiakou）

目标链路：

```
用户 → ESA（dl.aeoform.com，边缘缓存）→ ECS nginx（proxy_cache）→ OSS 内网端点
```

## 为什么这样分层

在这台 ECS 上实测：从 GitHub 拉资产只有约 **20 KB/s**，而到 OSS 内网端点是同区域内网。
所以 GitHub 只让 Actions 拉一次（出口快），随后：

| 段 | 作用 |
| --- | --- |
| GitHub Actions → OSS | 每个版本跑一次，下载 6 个平台安装包 |
| OSS → ECS | 走 `oss-cn-zhangjiakou-internal.aliyuncs.com`，内网流量不计外网出流量 |
| ECS nginx | `proxy_cache` 落盘，30 天，命中后不再回源 OSS |
| ESA | 边缘缓存，大部分用户不落到 ECS，规避宿主机 7 Mbps 出口瓶颈 |

## 前置条件

1. OSS Bucket 在 **cn-zhangjiakou**（与 ECS 同区域，否则没有免费内网流量）。
2. Bucket 为 **公共读**（只读即可；写入由 CI 的 RAM 子账号完成）。
3. RAM 子账号只授予该 Bucket 的 `oss:PutObject` / `oss:GetObject` / `oss:ListObjects`。
4. 域名 `dl.aeoform.com` 在 ESA 上接入，回源指向 `47.92.50.208:8080`（HTTP，Host 不限）。

## 仓库 Secrets

| Secret | 说明 |
| --- | --- |
| `OSS_BUCKET` | Bucket 名，例如 `openless-downloads` |
| `OSS_ACCESS_KEY_ID` | RAM 子账号 AccessKey |
| `OSS_ACCESS_KEY_SECRET` | RAM 子账号 Secret |

配置后手动跑一次 `Mirror release assets to OSS`，确认 `releases/<tag>/` 下出现安装包。

## ECS 现状

模板与开关脚本已经放到服务器上，尚未启用（等 bucket 名）：

```
/root/openless-dl/nginx.conf.template
/root/openless-dl/apply.sh          # apply.sh <bucket>
/var/cache/openless-dl/             # 缓存目录，8 G 上限
```

bucket 建好后执行 `bash /root/openless-dl/apply.sh <bucket>` 即完成安装、`nginx -t` 与 reload。

## ECS 安装（手工参考）

```bash
sudo install -d -m 0755 /var/cache/openless-dl
sudo install -m 0644 nginx.conf /etc/nginx/conf.d/openless-dl.conf
sudo sed -i 's/__BUCKET__/YOUR_BUCKET/' /etc/nginx/conf.d/openless-dl.conf
sudo nginx -t && sudo systemctl reload nginx
```

`nginx.conf` 监听 8080，路径为 `/releases/<tag>/<file>`，与 OSS 中的对象路径一致。
未命中 OSS 时直接返回 404（不使用 GitHub 回源，避免把 20 KB/s 的慢链路暴露给用户）。

## 前端指向

站点构建时设置：

```
NEXT_PUBLIC_DL_BASE=https://dl.aeoform.com
```

未设置时仍使用 GitHub 的 `releases/latest/download/...`，因此流水线没配好也不会把下载打断。

## 验证

```bash
# ECS 本机（应命中 OSS 内网，几十 MB 秒级）
curl -sI http://127.0.0.1:8080/releases/<tag>/<file>

# 公网（应看到 ESA 缓存命中头）
curl -sI https://dl.aeoform.com/releases/<tag>/<file>
```
