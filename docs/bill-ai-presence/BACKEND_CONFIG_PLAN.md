# Bill AI Presence 后台配置方案

目标不是把 GitHub Pages 变复杂，而是把不同刷新频率、不同隐私级别的数据分层处理。

## 当前阶段：静态公开发布

适合继续走 GitHub Pages 的内容：

- AI 产品晨报
- 设计源公开摘要
- 作品集素材
- 不含私人消息正文的状态说明
- 数据源可用性状态

第一阶段链路：

```text
自动化生成公开 daily-content.json
  -> 校验公开数据合同
  -> 同步到 docs/bill-ai-presence
  -> 提交并推送 GitHub
  -> GitHub Pages 发布
  -> 线上校验 updatedAt
```

## 第二阶段：后台配置中心

当下面任一条件成立，就不应该再靠每次发布 GitHub Pages：

- 刷新频率高于 1 小时一次。
- 内容包含飞书消息、日历详情、邮箱、个人任务。
- 需要在页面里开关数据源、调整频率、查看失败原因。
- 需要保存用户反馈、已读状态、产出队列或私有任务。

建议架构：

```text
GitHub Pages 前端
  -> Public Content API
  -> Private Workspace API
  -> Source Config API
  -> Worker / Scheduler
  -> 数据库 + 私有密钥存储
```

### Public Content API

用途：替代静态 `daily-content.json`。

接口：

- `GET /api/public/daily-content`
- `GET /api/public/source-health`

只返回可公开展示内容，不返回飞书消息正文、邮箱正文、token 或私有日程详情。

### Private Workspace API

用途：处理个人数据。

接口：

- `GET /api/private/calendar/today`
- `GET /api/private/messages/recent`
- `POST /api/private/output-tasks`
- `PATCH /api/private/output-tasks/:id`

需要登录或本地访问控制。GitHub Pages 可以只显示“有私有数据可用”，具体内容由私有 API 返回。

### Source Config API

用途：让后台可配置，而不是改代码。

配置项：

- 来源开关：优设 / Pinterest / Dribbble / 飞书 / 邮箱
- 刷新频率：手动 / 每小时 / 每天 / 工作日
- 可见级别：公开 / 私有 / 仅状态
- 失败策略：沿用旧数据 / 隐藏 / 标记不可用
- 输出目标：页面 / Obsidian / 作品集草稿 / 今日任务

接口：

- `GET /api/admin/sources`
- `PATCH /api/admin/sources/:id`
- `POST /api/admin/sources/:id/run`
- `GET /api/admin/runs`

### Worker / Scheduler

用途：定时执行采集和转换。

任务：

- 工作日 09:00 生成 AI 产品晨报。
- 每天 09:15 轻量巡检设计源。
- 每 10 分钟处理本地或私有飞书消息摘要。
- 失败时写入 source-health，不无限重试。

## 推荐落地顺序

1. 保持第一阶段自动发布公开 JSON。
2. 前端读取路径抽象成 `CONTENT_ENDPOINT`，默认仍是 `data/daily-content.json`。
3. 建一个最小私有 API，只服务本机或受保护域名。
4. 接入飞书消息和日程到私有 API。
5. 做后台配置页：来源、频率、失败记录、手动运行。
6. 当后台稳定后，GitHub Pages 只发布前端壳，不再发布每日数据。
