#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../../..");
const sourcePath = path.resolve(
  process.env.BILL_AI_PRESENCE_PUBLIC_DATA ||
    process.argv.find((arg) => !arg.startsWith("--") && arg.endsWith(".json")) ||
    path.join(projectRoot, "docs/bill-ai-presence/data/daily-content.json"),
);
const publishedTarget = path.join(projectRoot, "docs/bill-ai-presence/data/daily-content.json");

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: options.stdio || "pipe",
  }).trim();
}

function ensurePublicDataContract(data) {
  const missing = ["updatedAt", "todayFocus", "items"].filter((field) => !(field in data));
  if (missing.length) throw new Error(`daily-content.json 缺少字段：${missing.join(", ")}`);
  if (!Array.isArray(data.items) || data.items.length === 0) throw new Error("items 必须是非空数组。");
  if (!String(data.updatedAt || "").match(/\d{4}-\d{2}-\d{2}/)) {
    throw new Error("updatedAt 必须包含 YYYY-MM-DD 日期。");
  }

  const serialized = JSON.stringify(data);
  const privateMarkers = ["FEISHU_APP_SECRET", "refresh_token", "feishu-messages.local", "feishu-calendar.local"];
  const leakedMarker = privateMarkers.find((marker) => serialized.includes(marker));
  if (leakedMarker) throw new Error(`公开数据疑似包含私有标记：${leakedMarker}`);
}

function copyIfNeeded(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  const current = fs.existsSync(to) ? fs.readFileSync(to, "utf8") : "";
  const next = fs.readFileSync(from, "utf8");
  if (current === next) return false;
  fs.writeFileSync(to, next);
  return true;
}

function main() {
  const shouldPush = process.argv.includes("--push") || process.env.BILL_AI_PRESENCE_PUSH === "1";
  const shouldCommit = shouldPush || process.argv.includes("--commit") || process.env.BILL_AI_PRESENCE_COMMIT === "1";
  const data = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  ensurePublicDataContract(data);

  const touchedPublished = copyIfNeeded(sourcePath, publishedTarget);
  const publicPaths = ["docs/bill-ai-presence/data/daily-content.json"];
  const changed = Boolean(run("git", ["status", "--short", "--", ...publicPaths]));

  console.log(JSON.stringify({
    sourcePath,
    publishedTarget,
    updatedAt: data.updatedAt,
    items: data.items.length,
    touchedPublished,
    changed,
    commit: shouldCommit,
    push: shouldPush,
  }, null, 2));

  if (!changed) return;
  if (!shouldCommit) {
    console.log("已同步但未提交。发布时加 --commit 或 --push。");
    return;
  }

  run("git", ["add", ...publicPaths], { stdio: "inherit" });
  run("git", ["commit", "-m", `Update Bill AI Presence public data ${String(data.updatedAt).slice(0, 10)}`], { stdio: "inherit" });
  if (shouldPush) run("git", ["push", "origin", "HEAD:main"], { stdio: "inherit" });
}

main();
