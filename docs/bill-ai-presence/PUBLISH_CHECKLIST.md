# Bill AI Presence 发布守门清单

目标：每天早上打开页面时，不再靠猜测判断内容是否更新。

## 必须通过

1. `docs/bill-ai-presence/data/daily-content.json` 的 `updatedAt` 包含当天日期。
2. 周末、网络失败或无新晨报时，必须写明“沿用最近工作日”，不能伪装成今日晨报。
3. 公开数据不能包含飞书消息正文、邮箱正文、token、secret 或 `.local.json` 内容。
4. 页面里的数据状态必须让用户知道：数据日期、今日状态、发布是否成功。
5. 发布后运行线上校验。如果本地日期和线上日期不一致，不能认为发布成功。

## 第一阶段自动发布命令

如果公开数据已经在发布仓库：

```bash
node docs/bill-ai-presence/tools/publish-public-data.mjs --push
node docs/bill-ai-presence/tools/verify-published.mjs
```

如果公开数据来自另一个本地工作区：

```bash
BILL_AI_PRESENCE_PUBLIC_DATA="/Users/wangpengfei/Documents/AI自创工具/bill-ai-presence/data/daily-content.json" \
node docs/bill-ai-presence/tools/publish-public-data.mjs --push

node docs/bill-ai-presence/tools/verify-published.mjs
```

`publish-public-data.mjs` 只同步公开 `daily-content.json`，不会提交私有飞书文件。

## 当前边界

- GitHub Pages 是公开静态页，不能发布私人飞书消息正文。
- 飞书日程/消息正式授权未完成时，只能显示“待授权/待接入”或本地私有兜底。
- AI 产品晨报和设计源每天 12 小时级刷新足够；飞书消息应进入第二阶段私有后台。
