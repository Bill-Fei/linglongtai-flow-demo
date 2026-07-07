#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../../..");
const localDataPath = path.join(projectRoot, "docs/bill-ai-presence/data/daily-content.json");
const pageUrl = "https://bill-fei.github.io/linglongtai-flow-demo/bill-ai-presence/";
const dataUrl = `${pageUrl}data/daily-content.json`;

function extractDate(value) {
  return String(value || "").match(/\d{4}-\d{2}-\d{2}/)?.[0] || "";
}

async function fetchJson(url) {
  const response = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status} ${url}`);
  return response.json();
}

async function main() {
  const localData = JSON.parse(fs.readFileSync(localDataPath, "utf8"));
  const remoteData = await fetchJson(dataUrl);
  const localDate = extractDate(localData.updatedAt);
  const remoteDate = extractDate(remoteData.updatedAt);
  const sameUpdatedAt = localData.updatedAt === remoteData.updatedAt;
  const summary = {
    pageUrl,
    localDate,
    remoteDate,
    sameDate: Boolean(localDate && localDate === remoteDate),
    sameUpdatedAt,
    localUpdatedAt: localData.updatedAt,
    remoteUpdatedAt: remoteData.updatedAt,
  };
  console.log(JSON.stringify(summary, null, 2));
  if (!summary.sameDate || !sameUpdatedAt) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
