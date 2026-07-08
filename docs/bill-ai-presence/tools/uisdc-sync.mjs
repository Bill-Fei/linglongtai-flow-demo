#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const dataFile = process.env.BILL_AI_PRESENCE_DATA || path.join(projectRoot, "data/daily-content.json");
const uisdcUrl = process.env.UISDC_URL || "https://www.uisdc.com/";
const execFileAsync = promisify(execFile);

function formatTimestamp(date = new Date()) {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  const time = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return `${day} ${time} CST`;
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function htmlLooksBlocked(html) {
  return /SafeLine|雷池|Access Forbidden|请求存在恶意行为|cf-mitigated|challenge|slg-bg|slg-warning/i.test(html);
}

function htmlLooksUseful(html) {
  return !/UISDC_NETWORK_FAILED/i.test(html) && /uisdc|优设|AIGC|AI|设计|文章|教程/i.test(html) && !htmlLooksBlocked(html);
}

function extractTitles(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (/UISDC_NETWORK_FAILED/i.test(text)) return [];
  const candidates = Array.from(text.matchAll(/[^。！？.!?]{0,24}(AI|AIGC|Codex|Figma|动效|大屏|作品集|设计|教程)[^。！？.!?]{0,36}/g))
    .map((match) => match[0].trim())
    .filter((value) => value.length >= 8);
  return [...new Set(candidates)].slice(0, 4);
}

async function fetchUisdc() {
  let status = 0;
  let html = "";
  try {
    const response = await fetch(uisdcUrl, {
      headers: {
        "user-agent": "Mozilla/5.0 Bill-AI-Presence/1.0 design-source-check",
        accept: "text/html,application/xhtml+xml",
      },
    });
    status = response.status;
    html = await response.text();
  } catch (fetchError) {
    try {
      const { stdout } = await execFileAsync("curl", ["-L", "--max-time", "20", "--silent", "--show-error", uisdcUrl], {
        maxBuffer: 10 * 1024 * 1024,
      });
      status = 0;
      html = stdout;
    } catch (curlError) {
      status = 0;
      html = `UISDC_NETWORK_FAILED ${fetchError.message || ""} ${curlError.message || ""}`;
    }
  }
  return {
    ok: (status === 0 || (status >= 200 && status < 300)) && htmlLooksUseful(html),
    status,
    blocked: htmlLooksBlocked(html),
    titles: extractTitles(html),
  };
}

function buildUisdcItem(result, timestamp) {
  const readable = result.ok && result.titles.length;
  const sourceState = readable
    ? `首页可读，识别到 ${result.titles.length} 条 AI/设计相关文本`
    : result.blocked
      ? `首页被 WAF/SafeLine 拦截，HTTP ${result.status}`
      : `首页未返回可用正文，HTTP ${result.status}`;
  const titleBullets = readable
    ? result.titles.map((title) => `可读文本：${title}`)
    : [
      "抓取状态：优设首页被安全策略拦截，不能确认今日新文章。",
      "图片策略：不再引用 image.uisdc.com 外链，避免页面破图。",
      "处理方式：使用本地状态图，把已沉淀方向转成作品集证据链。"
    ];

  return {
    id: "uisdc",
    topic: "design",
    source: "设计风格源",
    badge: readable ? "优设 / 首页可读" : "优设 / WAF 拦截，已降级",
    title: readable ? "优设：中文 AI 设计趋势进入今日判断" : "优设：抓取受限，已转为本地证据链",
    summary: readable
      ? `本轮优设首页可读，已提取 AI/设计相关文本；页面继续只发布公开摘要，不发布登录态或私有内容。`
      : `本轮优设首页返回安全策略拦截页，不能确认 ${timestamp.slice(0, 10)} 新文章；平台已改为本地状态图和明确失败说明，不再展示优设破图。`,
    bullets: [
      `来源状态：${sourceState}。`,
      "为什么值得看：优设仍负责中文 AI 设计方法论，但必须先保证来源可信。",
      "能转成什么产出：作品集证据链、Agent UI 工作流、视觉规则。"
    ],
    images: [
      {
        src: "assets/design-sources/uisdc/uisdc-evidence-chain.svg",
        alt: "优设抓取受限：作品集证据链",
        href: "https://www.uisdc.com/",
        sourceStatus: readable ? "homepage-readable" : "blocked-local-fallback",
      },
      {
        src: "assets/design-sources/uisdc/uisdc-agent-workflow.svg",
        alt: "优设抓取受限：从文章到 Agent 工作流",
        href: "https://www.uisdc.com/",
        sourceStatus: readable ? "homepage-readable" : "blocked-local-fallback",
      },
      {
        src: "assets/design-sources/uisdc/uisdc-visual-rules.svg",
        alt: "优设抓取受限：不看破图，看规则",
        href: "https://www.uisdc.com/",
        sourceStatus: readable ? "homepage-readable" : "blocked-local-fallback",
      }
    ],
    detail: {
      why: readable
        ? "优设首页本轮可读，但平台仍只沉淀公开摘要和设计判断，避免依赖外链图片和不稳定登录态。"
        : "优设对 Bill 的价值是中文方法论和可面试表达；当自动化被 WAF 拦截时，正确做法是标明失败状态，并把既有方向转成可发布的本地规则资产。",
      points: titleBullets,
      impact: "Bill AI Presence 不再把抓取失败伪装成采集成功，页面会清楚区分来源可读、来源受限和本地降级。",
      reason: "稳定的 AI 工作台必须先保证证据可信；破图和错误成功状态会削弱作品集可信度。",
      output: "产出一页《优设来源受限时的 AI Presence 降级规则》：状态透明、图片本地化、判断可复用。",
      next: "下一步若需要真实优设内容，用浏览器登录态人工确认后再导入公开摘要，不绕过站点安全策略。",
    },
  };
}

async function main() {
  const timestamp = formatTimestamp();
  const content = await readJson(dataFile);
  const result = await fetchUisdc();
  const nextItem = buildUisdcItem(result, timestamp);
  content.items = (content.items || []).map((item) => (item.id === "uisdc" ? nextItem : item));
  content.updatedAt = `${timestamp} / 优设来源已复检；${nextItem.badge}，图片已改为本地状态图`;
  content.freshness ||= {};
  content.freshness.designSources ||= {};
  content.freshness.designSources.updatedAt = timestamp;
  content.freshness.designSources.uisdc = `${timestamp} ${result.blocked ? "优设返回 WAF/SafeLine 拦截页" : result.ok ? "优设首页可读" : `优设 HTTP ${result.status} 未返回可用正文`}；不再发布 image.uisdc.com 外链图片。`;
  await writeJson(dataFile, content);
  console.log(JSON.stringify({
    dataFile,
    timestamp,
    status: result.status,
    blocked: result.blocked,
    ok: result.ok,
    titles: result.titles,
    badge: nextItem.badge,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
