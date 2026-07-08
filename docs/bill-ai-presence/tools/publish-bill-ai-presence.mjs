#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../../..");
const defaultSourcePath = "/Users/wangpengfei/Documents/AI自创工具/bill-ai-presence/data/daily-content.json";
const sourcePath = path.resolve(process.env.BILL_AI_PRESENCE_PUBLIC_DATA || defaultSourcePath);
const publishScript = path.join(projectRoot, "docs/bill-ai-presence/tools/publish-public-data.mjs");
const verifyScript = path.join(projectRoot, "docs/bill-ai-presence/tools/verify-published.mjs");
const logPath = path.resolve(process.env.BILL_AI_PRESENCE_PUBLISH_LOG || path.join(path.dirname(sourcePath), "publish-log.jsonl"));

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: options.stdio || "pipe",
    env: {
      ...process.env,
      BILL_AI_PRESENCE_PUBLIC_DATA: sourcePath,
    },
  }).trim();
}

function extractDate(value) {
  return String(value || "").match(/\d{4}-\d{2}-\d{2}/)?.[0] || "";
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function readPublicData() {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`公开数据源不存在：${sourcePath}`);
  }
  const data = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  const updatedAt = String(data.updatedAt || "");
  const updatedDate = extractDate(updatedAt);
  const today = formatDate(new Date());
  const explicitlyCarried = updatedAt.includes("沿用最近工作日");

  if (!updatedDate) {
    throw new Error("daily-content.json 的 updatedAt 必须包含 YYYY-MM-DD 日期。");
  }
  if (updatedDate !== today && !explicitlyCarried) {
    throw new Error(`updatedAt 是 ${updatedAt}，不是今天 ${today}，且没有写明“沿用最近工作日”。`);
  }

  return {
    updatedAt,
    updatedDate,
    today,
    items: Array.isArray(data.items) ? data.items.length : 0,
  };
}

function getHeadSha() {
  return run("git", ["rev-parse", "HEAD"]);
}

function appendLog(entry) {
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.appendFileSync(logPath, `${JSON.stringify(entry)}\n`, "utf8");
}

function main() {
  const preflight = readPublicData();
  const beforeSha = getHeadSha();

  run("node", [publishScript, "--push"], { stdio: "inherit" });
  run("node", [verifyScript], { stdio: "inherit" });

  const afterSha = getHeadSha();
  const entry = {
    publishedAt: new Date().toISOString(),
    sourcePath,
    updatedAt: preflight.updatedAt,
    updatedDate: preflight.updatedDate,
    items: preflight.items,
    beforeSha,
    afterSha,
    pushed: beforeSha !== afterSha,
    verified: true,
  };
  appendLog(entry);
  console.log(JSON.stringify(entry, null, 2));
}

main();
