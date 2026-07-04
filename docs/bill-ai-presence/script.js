const topics = document.querySelectorAll(".topic");
const feed = document.querySelector("#feed");
let cards = document.querySelectorAll(".feed-card");
const listView = document.querySelector("#listView");
const detailView = document.querySelector("#detailView");
const toast = document.querySelector("#toast");
const pageTitle = document.querySelector("#pageTitle");
const pageKicker = document.querySelector("#pageKicker");
const pageNote = document.querySelector("#pageNote");
const syncStatus = document.querySelector("#syncStatus");
const pageDate = document.querySelector("#pageDate");
const imageModal = document.querySelector("#imageModal");
const modalClose = document.querySelector("#modalClose");
const modalImage = document.querySelector("#modalImage");
const modalHeroImage = document.querySelector("#modalHeroImage");
const modalCaption = document.querySelector("#modalCaption");
const modalSource = document.querySelector("#modalSource");
const sourceActionRow = document.querySelector("#sourceActionRow");
const modalNote = document.querySelector("#modalNote");
const modalPlatform = document.querySelector("#modalPlatform");
const modalRule = document.querySelector("#modalRule");
const modalApply = document.querySelector("#modalApply");
const modalSideInsight = document.querySelector("#modalSideInsight");
const modalFrame = document.querySelector("#modalFrame");
const sourceFrameTip = document.querySelector("#sourceFrameTip");
const summaryPanel = document.querySelector("#summaryPanel");
const summaryTitle = document.querySelector("#summaryTitle");
const summaryPoints = document.querySelector("#summaryPoints");
const clearSummary = document.querySelector("#clearSummary");
const outputDock = document.querySelector("#outputDock");
const outputList = document.querySelector("#outputList");
const clearOutput = document.querySelector("#clearOutput");
const taskResult = document.querySelector("#taskResult");
const bottomBackButton = document.querySelector("#bottomBackButton");
const feishuStatus = document.querySelector("#feishuStatus");
const feishuMessageStatus = document.querySelector("#feishuMessageStatus");
const addToOutputButton = document.querySelector("#addToOutput");
const sourceHealthList = document.querySelector("#sourceHealthList");
const runtimeStatus = document.querySelector("#runtimeStatus");
const MESSAGE_REFRESH_INTERVAL_MS = 10 * 60 * 1000;
const FULL_PAGE_REFRESH_INTERVAL_MS = 12 * 60 * 60 * 1000;
const LOCAL_CALENDAR_FILE = "data/feishu-calendar.local.json";
const LOCAL_MESSAGES_FILE = "data/feishu-messages.local.json";
const APP_VERSION = "20260704-data-freshness";

function readStoredOutputTasks() {
  try {
    const stored = JSON.parse(window.localStorage?.getItem("bill-ai-output-tasks") || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

let currentDetailId = null;
let latestItems = [];
let outputTasks = readStoredOutputTasks();
let lastListScrollY = 0;
let lastOpenedCardId = null;
let sourceState = {
  contentLoaded: false,
  localCalendarLoaded: false,
  localMessagesLoaded: false,
  localCalendarCount: 0,
  localMessagesCount: 0,
  lastContentLabel: "未读取",
  lastMessageRefreshLabel: "未刷新",
};

const topicMeta = {
  all: {
    title: "今日任务总览",
    kicker: "今日任务总结",
    note: "量化今天需要处理的待办、行业目标和设计素材；下面的信息流只作为原始材料入口。",
  },
  calendar: {
    title: "日程与纪要",
    kicker: "会议上下文",
    note: "这一组用于承接飞书日历和妙记。现在先保留结构，之后每场会议都要能沉淀目标、结论、行动项和设计风险。",
  },
  message: {
    title: "飞书消息",
    kicker: "消息收件箱",
    note: "这里用于汇总今天谁给你发了什么、来自哪个会话、是否需要回复或转成任务。消息读取需要飞书消息权限或本地导入。",
  },
  brief: {
    title: "AI 产品晨报",
    kicker: "今日晨报",
    note: "这不是资讯收藏夹，而是把每天的 AI 产品信号转成你的观点、草图、文章和作品集素材。",
  },
  design: {
    title: "设计风格源",
    kicker: "风格雷达",
    note: "今天已接入优设、Pinterest 和 Dribbble。先做轻量采集：标题、图板方向、组件关键词和可转成作品集/文章的设计任务。",
  },
  work: {
    title: "未来工作模块",
    kicker: "入职后模块",
    note: "这一组先占位，之后用于把 PRD、研发输出、验收风险和设计追问接到同一条工作流里。",
  },
};

let detailData = {
  codex: {
    type: "AI 产品晨报",
    title: "Codex 研究：Agentic AI 正在改变工作组织方式",
    why: "arXiv 论文《The Shift to Agentic AI: Evidence from Codex》分析了 Codex 使用数据：2026 年上半年活跃用户增长超过 5 倍；超过 10% 用户每周会同时管理 3 个以上 Codex agents；复杂任务请求也明显增加。",
    points: ["来源：arXiv 论文 The Shift to Agentic AI: Evidence from Codex。", "活跃用户在 2026 年上半年增长超过 5 倍。", "超过 10% 用户每周会同时管理 3 个以上 Codex agents。", "复杂任务请求增加，说明用户开始把 Agent 当作可并行管理的工作单元。"],
    impact: "未来的生产力界面会越来越像“任务编排台”，而不是单线程聊天。用户需要看到多个 Agent 的状态、意图、风险、产物和等待点。",
    reason: "这是 Agent UI 的关键命题：如何把并行智能体变成可理解、可接管、可审计的体验系统。",
    output: "创作任务：把你常用的 Codex/Cursor 工作流拆成“单 Agent”和“多 Agent 并行”两版，比较信息架构差异。",
    next: "生成创作任务：画一张多 Agent 并行工作台的信息架构草图。",
  },
  meeting: {
    type: "日程与纪要",
    title: "AI 工作台结构评审",
    why: "这条信息的价值不是会议本身，而是它会决定这个平台之后怎么真实接入数据源。飞书日历解决发生了什么，飞书妙记解决会后沉淀，AI 总结层负责把会议转成行动。",
    points: ["当前缺口：还没有接入飞书日历和妙记。", "详情页应展示：会议目标、讨论结论、行动项、风险、后续 owner。", "真正可用的关键：会议纪要不能只存档，要进入今日总结和产出队列。"],
    output: "把这次平台结构评审整理成 MVP 范围说明：第一阶段只做手动数据，第二阶段再接飞书。",
    next: "先保留为待纪要状态，等飞书接入后自动更新。",
  },
  claudeTag: {
    type: "AI 产品晨报",
    title: "Claude Tag：Slack 里的 AI 数字员工雏形",
    why: "Anthropic 发布 Claude Tag，团队可在 Slack 频道中直接 @Claude，让它读取频道上下文、记住相关信息、拆解任务、异步执行，并在需要时主动提醒。它不是单人 ChatBot，而是一个可被多人共享的频道级 AI 角色。",
    points: ["来源：Anthropic 官方新闻 Introducing Claude Tag。", "团队可在 Slack 频道中直接 @Claude。", "Claude 可以读取频道上下文、记住相关信息、拆解任务、异步执行。", "需要时可以主动提醒，形成频道级 AI 角色。"],
    impact: "AUI 的核心不再只是对话框，而是“AI 存在于组织空间里”的协作形态。设计重点会转向频道身份、记忆边界、主动打扰节奏、任务可见性和权限透明度。",
    reason: "这非常接近你关注的 AI Presence 和 AI 数字员工方向，是从“工具入口”走向“工作流成员”的典型信号。",
    output: "创作任务：画一张“频道里的 AI 数字员工”状态图，覆盖空闲、被提及、执行中、等待授权、主动提醒、完成归档。",
    next: "生成创作任务：把 Claude Tag 做成你的 AI Presence 案例卡。",
  },
  claudeAmbient: {
    type: "AI 产品晨报",
    title: "Claude Tag 的主动性：环境式交互开始进入办公场景",
    why: "Claude Tag 支持 ambient behavior：当讨论停滞、事项未解决或跨频道信息相关时，它可以主动补充信息或跟进。",
    points: ["来源：Claude Tag 官方说明中的 ambient behavior。", "AI 不只是被动响应 @ 提及，也可以在语境合适时主动跟进。", "主动性发生在协作语境内，而不是独立弹窗。", "它需要介入阈值、退场方式和可解释的触发理由。"],
    impact: "主动服务设计不能只做“提醒弹窗”。更高级的方式是把 AI 主动性嵌入协作语境，让它像环境里的轻声提示，而不是突然打断。",
    reason: "这对应你长期关注的陪伴感和连续性。未来 AUI 需要设计 AI 的介入阈值：什么时候沉默，什么时候轻触，什么时候正式接管。",
    output: "创作任务：为一个跨端 AI Companion 写 5 条主动介入规则：什么时候出现、说什么、如何退场。",
    next: "生成创作任务：把主动介入规则整理成平台的 AI 行为准则。",
  },
  qwenWorld: {
    type: "AI 产品晨报",
    title: "Qwen-AgentWorld：国内 Agent 进入环境模拟与训练层",
    why: "阿里 Qwen 团队公开 Qwen-AgentWorld，论文介绍其用语言世界模型模拟 Agent 环境，并覆盖多类真实交互轨迹，用于训练与评估通用 Agent。",
    points: ["来源：Qwen-AgentWorld GitHub。", "用语言世界模型模拟 Agent 环境。", "覆盖多类真实交互轨迹。", "用于训练与评估通用 Agent。"],
    impact: "Agent 体验将不仅依赖单次 prompt，而会依赖环境理解、状态预测、行动后果模拟。这会影响多智能体系统里的规划、反馈和失败恢复设计。",
    reason: "国内 AI 产品不只是模型追赶，也在补 Agent runtime 与评测基础设施。设计师需要开始理解 Agent 如何在环境中行动，而不是只看最终 UI。",
    output: "创作任务：写一页《多智能体工作台的信息层级》：全局目标、Agent 分工、执行状态、人工确认点、失败恢复。",
    next: "生成创作任务：把 AgentWorld 转成多智能体体验设计的背景材料。",
  },
  workflow: {
    type: "AI 产品晨报",
    title: "设计工具的下一步：从生成稿件到生成工作流",
    why: "结合 Claude Tag 与 Codex 研究，一个明显趋势是：AI 产品价值正在从“生成一个结果”转向“持续参与一个流程”。对设计师来说，Figma、Cursor、Codex、Claude Code 这类工具的竞争点，会越来越像工作台里的智能协作层。",
    points: ["AI 产品价值从生成结果转向持续参与流程。", "设计工具会越来越像智能协作层，而不是单点生成器。", "设计交付物会扩展到 Agent 角色说明、任务状态模型、记忆规则、权限策略和人工接管机制。", "这条可以作为你平台的总判断。"],
    impact: "设计交付物会从页面、组件、原型，扩展到 Agent 角色说明、任务状态模型、记忆规则、权限策略和人工接管机制。",
    reason: "这正是 AI Native 体验设计的护城河。会设计漂亮界面的人很多，会设计“AI 如何成为系统成员”的人很少。",
    output: "创作任务：写一篇《AI 产品正在从生成稿件走向生成工作流》。用 Claude Tag、Codex、AgentWorld 做三段证据。",
    next: "生成创作任务：把它作为今天最适合发布的观点草稿。",
  },
  uisdc: {
    type: "设计风格源",
    title: "优设：AI 设计趋势与中文表达入口",
    why: "今天已经从优设首页读取到真实内容。优设当前给出的设计语境很适合你：AIGC、AI工具、AI趋势、AI星踪岛、优设热榜，以及面向中文设计师的趋势表达。",
    points: ["已识别登录态：页面出现你的账号信息，不再是待登录状态。", "当前可用入口：AI星踪岛、AI趋势、优设热榜、设计灵感、热门 AI 工具。", "今日可读文章：给机器人打工了一天，我们体验上了 AI 时代最魔幻的工作。", "今日可读文章：我把关键词都分享出来了，以后别说不会做动效了。", "今日可读文章：AI 时代怎么自学？这个超实用的 SRL 学习法让你快速系统掌握。", "今日可读文章：如何用 AI 重构 IP 全流程设计？大厂实战案例来了。"],
    impact: "优设负责给你的平台补中文设计语境。它不是视觉图库，而是把 AI 设计趋势转成国内团队、面试官和作品集读者能理解的表达方式。",
    reason: "你之后要进入 AI 行业，不能只会讲海外产品新闻，也需要能把 AI Native、Agent UI、AI 工作流这些判断翻译成中文设计圈听得懂的案例和方法。",
    output: "创作任务：从优设今天的 AIGC 内容里选 2 篇，整理成《AI 时代设计师能力变化观察》：一个讲工作流变化，一个讲学习方法变化。",
    next: "下一步：每天采集优设 3 条 AI/设计文章，过滤运营内容，只保留能转成观点、案例或作品集表达的条目。",
  },
  pinterest: {
    type: "设计风格源",
    title: "Pinterest：你的视觉图板与风格聚类",
    why: "今天已经读取到你的 Pinterest 首页和个人资料入口。它当前最有价值的不是单张图，而是你已经形成的图板关键词：HMI、Apple design、Website-data、可视化数据、UI dynamic、2.5D、loading、I CON。",
    points: ["已识别个人资料入口：pengfei0843。", "当前图板方向：HMI、Apple design、Website-data、可视化数据、UI dynamic、2.5D、loading、LOGO。", "首页推荐出现：prompt 建站、UI elements、AR、Moonshot UI Collection 等方向。", "采集规则：只提炼风格标签、布局气质、组件方向，不复制图片本身。", "优先沉淀到 4 个 moodboard：AI Workspace、Agent UI、Spatial Glass、Calm Productivity。"],
    impact: "Pinterest 负责你的视觉气质层。它应该帮助判断这个平台的空间感、圆角、留白、半透明层次和动效方向，而不是变成图片瀑布流。",
    reason: "你对视觉的要求不是普通后台，而是 ChatGPT 式的克制、Apple Spatial 式的空间层次、AI Native 的存在感。Pinterest 是这个审美雷达最适合的来源。",
    output: "创作任务：把现有图板关键词重组为 4 个平台风格板，每个风格板写 5 个设计规则：布局、色彩、圆角、组件密度、动效节奏。",
    next: "下一步：进入你的图板页，优先读取 Apple design、UI dynamic、Website-data、HMI 四组，建立平台视觉规则。",
  },
  dribbble: {
    type: "设计风格源",
    title: "Dribbble：组件、动效与界面表达",
    why: "今天已经识别到 Dribbble 登录态，页面出现你的资料入口和创作入口。首页可用方向包括 dashboard、landing page、mobile app、onboarding、micro interaction、illustration 和 product design。",
    points: ["已识别登录态：页面出现你的资料入口和上传/服务相关入口。", "当前热门组件方向：仪表板、着陆页、移动应用、文件夹、电子商务、动画片、插图、入职。", "今日可观察条目：通知微交互、企业级 UI/UX、加密货币移动应用探索。", "采集规则：过滤单纯炫技图，优先保留能落到 AI 工作台里的组件、状态、动效。", "下一轮搜索关键词：Agent UI、AI dashboard、productivity、workflow、task manager、assistant UI。"],
    impact: "Dribbble 负责界面细节和微交互层。它能帮助你补 AI 输入框、任务状态、来源卡、引用、草稿、授权、完成反馈这些具体组件。",
    reason: "你现在的平台产品逻辑已经开始清楚，下一步需要的不是装饰，而是把每个真实动作做得顺：读、判断、进入详情、生成任务、回到列表、沉淀产出。",
    output: "创作任务：整理 10 个 AI 工作台组件模式：输入、Agent 状态、信息来源、引用、阅读进度、生成任务、授权、完成反馈、错误恢复、跨端继续。",
    next: "下一步：按 Agent UI / AI dashboard / productivity 三个关键词搜索并保存可落地组件。",
  },
  prd: {
    type: "未来工作模块",
    title: "PRD 理解与研发输出追踪",
    why: "等你入职后，这会是平台最实用的模块。它把产品需求和研发输出放进同一条设计决策链路里，帮助你减少遗漏和返工。",
    points: ["PRD 理解：目标、用户、流程、模糊点、设计追问。", "研发输出：接口变更、状态流、验收项、还原风险。", "AI 作用：自动生成风险清单和会议追问。"],
    output: "创作任务：先写清楚未来模块边界，不现在做重功能。PRD 模块负责理解需求，研发模块负责追踪实现，AI 总结层负责把两者连起来。",
    next: "暂不展开开发，避免首版过重。",
  },
};

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getImageFallbackTarget(image) {
  if (!image) return null;
  if (image.id === "modalImage") return image.closest(".source-preview aside");
  return image.closest(".source-image-stage, .gallery-item, .card-images figure");
}

function clearImageFallback(image) {
  const target = getImageFallbackTarget(image);
  if (!target) return;
  target.classList.remove("is-image-failed");
  target.removeAttribute("data-fallback-title");
}

function markImageFailed(image) {
  if (image.dataset.fallbackSrc && image.dataset.fallbackTried !== "true") {
    image.dataset.fallbackTried = "true";
    image.src = image.dataset.fallbackSrc;
    return;
  }
  const target = getImageFallbackTarget(image);
  if (!target) return;
  target.classList.add("is-image-failed");
  target.dataset.fallbackTitle = image.alt || "封面暂不可用";
  image.hidden = true;
}

function watchImages(root) {
  root.querySelectorAll("img").forEach((image) => {
    if (image.dataset.fallbackReady === "true") return;
    image.dataset.fallbackReady = "true";
    image.addEventListener("load", () => {
      image.hidden = false;
      clearImageFallback(image);
    });
    image.addEventListener("error", () => markImageFailed(image));
    if (image.complete && image.naturalWidth === 0) {
      markImageFailed(image);
    }
  });
}

function setPreviewImage(target, image) {
  if (!target) return;
  target.hidden = false;
  clearImageFallback(target);
  target.alt = image.alt || "设计参考图";
  if (image.originalSrc) target.dataset.fallbackSrc = image.originalSrc;
  target.dataset.fallbackTried = "false";
  target.src = image.src;
  if (target.complete && target.naturalWidth === 0) {
    markImageFailed(target);
  }
}

function getArticleInsightMarkup(image) {
  const article = image?.article;
  if (!article) {
    return `
      <section>
        <p>站内沉淀</p>
        <h3>${escapeHtml(image?.href ? "当前只保存了封面、原始链接和可转译规则。" : "当前只保存了视觉参考。")}</h3>
      </section>
    `;
  }
  const tags = (article.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  const takeaways = (article.takeaways || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  return `
    <section class="article-insight">
      <p>二级页面信息</p>
      <h3>${escapeHtml(article.articleTitle || image.alt)}</h3>
      <small>${escapeHtml(article.meta || "优设文章")}</small>
      ${tags ? `<div class="article-tags">${tags}</div>` : ""}
      <p class="article-excerpt">${escapeHtml(article.excerpt || "")}</p>
    </section>
    <section class="article-takeaways">
      <p>关键判断</p>
      <ul>${takeaways}</ul>
    </section>
    <section>
      <p>对 Bill 平台的价值</p>
      <h3>${escapeHtml(article.value || "把二级页内容转成平台可复用的设计判断。")}</h3>
    </section>
  `;
}

function getSideInsightMarkup(image) {
  const articleMarkup = getArticleInsightMarkup(image);
  return `
    ${articleMarkup}
    <section>
      <p>可转译规则</p>
      <h3>${escapeHtml(image?.rule || "把这条来源转成平台可复用的视觉和交互规则。")}</h3>
    </section>
    <section>
      <p>适合应用到</p>
      <h3>${escapeHtml(image?.apply || "来源卡、详情阅读、任务生成、AI 状态反馈。")}</h3>
    </section>
  `;
}

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function setSyncStatus(message, state = "ready") {
  if (!syncStatus) return;
  syncStatus.textContent = message;
  syncStatus.dataset.state = state;
}

function setPageDate(value) {
  if (!pageDate) return;
  const match = String(value || "").match(/\d{4}-\d{2}-\d{2}/);
  const dateText = match ? match[0].replaceAll("-", ".") : new Date().toLocaleDateString("zh-CN").replaceAll("/", ".");
  pageDate.textContent = `${dateText} / Data`;
}

function formatUpdatedAt(value) {
  if (!value) return "数据更新时间未知";
  return `数据更新：${value}`;
}

function formatClock(date = new Date()) {
  return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function getLocalStatus(items, topic) {
  return items.filter((item) => item.topic === topic && item.id?.includes("-local-"));
}

function renderSourceHealth(items = latestItems) {
  if (!sourceHealthList) return;
  const calendarItems = items.filter((item) => item.topic === "calendar");
  const messageItems = items.filter((item) => item.topic === "message");
  const briefCount = items.filter((item) => item.topic === "brief").length;
  const designCount = items.filter((item) => item.topic === "design").length;
  const calendarLocal = getLocalStatus(items, "calendar").length;
  const messageLocal = getLocalStatus(items, "message").length;
  const calendarSynced = calendarItems.some((item) => !["待授权", "待接入"].includes(item.badge) && !item.id?.includes("auth-needed"));
  const messageSynced = messageItems.some((item) => !["待授权", "待接入"].includes(item.badge) && !item.id?.includes("permission-needed"));
  const syncRiskCount = Number(!calendarSynced && !calendarLocal) + Number(!messageSynced && !messageLocal);
  const rows = [
    {
      state: calendarLocal ? "local" : calendarSynced ? "ready" : "waiting",
      value: calendarLocal || (calendarSynced ? calendarItems.length : 0),
      label: "日程待办",
      note: calendarLocal ? "私有覆盖" : calendarSynced ? "已同步" : "待授权",
    },
    {
      state: messageLocal ? "local" : messageSynced ? "ready" : "waiting",
      value: messageLocal || (messageSynced ? messageItems.length : 0),
      label: "消息待办",
      note: messageLocal ? "私有覆盖" : messageSynced ? "已同步" : "待接入",
    },
    {
      state: "ready",
      value: briefCount,
      label: "行业目标",
      note: "12 小时重读",
    },
    {
      state: "local",
      value: designCount,
      label: "设计素材",
      note: syncRiskCount ? `${syncRiskCount} 个同步风险` : "采集正常",
    },
  ];

  sourceHealthList.innerHTML = rows
    .map(
      (row) => `
        <article>
          <strong>${escapeHtml(String(row.value))}</strong>
          <span>${escapeHtml(row.label)}</span>
          <p><i class="status ${escapeHtml(row.state)}"></i>${escapeHtml(row.note)}</p>
        </article>
      `,
    )
    .join("");
  if (runtimeStatus) {
    runtimeStatus.textContent = `v${APP_VERSION} / ${sourceState.lastContentLabel}`;
  }
}

function openImagePreview(image) {
  if (!imageModal || !modalImage || !modalCaption || !modalSource || !image) return;
  const sourceUrl = image.href || image.src;
  const canPreview = Boolean(image.href && image.href !== "#");
  watchImages(imageModal);
  setPreviewImage(modalImage, image);
  setPreviewImage(modalHeroImage, image);
  modalCaption.textContent = image.alt || "设计参考图";
  modalSource.href = sourceUrl;
  modalSource.hidden = !canPreview;
  if (sourceActionRow) sourceActionRow.hidden = !canPreview;
  if (modalNote) {
    modalNote.textContent = canPreview
      ? "左侧保留平台沉淀信息；右侧直接打开这条来源的原始链接。"
      : "这张图来自已保存的缩略图流，当前没有可确认的原始详情页，所以只保留为视觉参考。";
  }
  if (modalPlatform) {
    modalPlatform.textContent = image.platform || (sourceUrl.includes("uisdc") ? "优设文章" : sourceUrl.includes("pinterest") ? "Pinterest 灵感" : sourceUrl.includes("dribbble") ? "Dribbble 组件参考" : "设计来源");
  }
  if (modalRule) {
    modalRule.textContent = image.rule || "把这张参考图转成平台可复用的视觉和交互规则。";
  }
  if (modalApply) {
    modalApply.textContent = image.apply || "来源卡、详情阅读、任务生成、AI 状态反馈。";
  }
  if (modalSideInsight) {
    modalSideInsight.innerHTML = getSideInsightMarkup(image);
  }
  if (modalFrame) {
    modalFrame.removeAttribute("src");
    modalFrame.hidden = !canPreview;
    if (canPreview) {
      modalFrame.src = sourceUrl;
    }
  }
  if (sourceFrameTip) {
    sourceFrameTip.hidden = canPreview;
    sourceFrameTip.querySelector("span").textContent = "这条来源没有可确认的原始详情页，右侧暂不加载页面。";
  }
  imageModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeImagePreview() {
  if (!imageModal || !modalImage) return;
  imageModal.setAttribute("aria-hidden", "true");
  if (modalSideInsight) modalSideInsight.innerHTML = "";
  modalImage.removeAttribute("src");
  if (modalHeroImage) {
    modalHeroImage.hidden = false;
    clearImageFallback(modalHeroImage);
    modalHeroImage.removeAttribute("src");
  }
  modalImage.hidden = false;
  clearImageFallback(modalImage);
  if (modalFrame) {
    modalFrame.removeAttribute("src");
    modalFrame.hidden = false;
  }
  document.body.classList.remove("modal-open");
}

function renderFeed(items) {
  feed.innerHTML = items
    .map((item, index) => {
      const bullets = (item.bullets || []).map((point) => `<li>${escapeHtml(point)}</li>`).join("");
      const images = item.images || [];
      const previewImages = images.slice(0, 3);
      const media = previewImages.length
        ? `
          <div class="card-images" aria-label="${escapeHtml(item.title)} 图片预览">
            ${previewImages
              .map(
                (image) => `
                  <figure>
                    <img src="${escapeHtml(image.src)}" ${image.originalSrc ? `data-fallback-src="${escapeHtml(image.originalSrc)}"` : ""} alt="${escapeHtml(image.alt)}" loading="lazy" referrerpolicy="no-referrer" />
                  </figure>
                `,
              )
              .join("")}
          </div>
        `
        : "";
      return `
        <article class="feed-card${index === 0 ? " primary" : ""}${images.length ? " has-images" : ""}" data-topic="${escapeHtml(item.topic)}" data-id="${escapeHtml(item.id)}">
          <button class="open-detail">
            ${media}
            <div class="card-meta">
              <span>${escapeHtml(item.source)}</span>
              <em>${escapeHtml(item.badge)}</em>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.summary)}</p>
            ${bullets ? `<ul>${bullets}</ul>` : ""}
          </button>
        </article>
      `;
    })
    .join("");

  cards = document.querySelectorAll(".feed-card");
  cards.forEach((card) => {
    card.querySelector(".open-detail").addEventListener("click", () => openDetail(card.dataset.id));
  });
  watchImages(feed);
}

function buildDetailRecord(item) {
  const detail = item.detail || {};
  return {
    type: item.source,
    title: item.title,
    why: detail.why || item.summary,
    points: detail.points || item.bullets || [],
    images: item.images || [],
    impact: detail.impact,
    reason: detail.reason,
    output: detail.output,
    next: detail.next,
  };
}

async function readOptionalJson(path) {
  try {
    const response = await fetch(`${path}?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    return null;
  }
}

function normalizeLocalText(value, fallback = "") {
  return String(value || fallback).replace(/\s+/g, " ").trim();
}

function safeLocalId(value, fallback) {
  return normalizeLocalText(value, fallback)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function buildLocalCalendarItem(event, index) {
  const title = normalizeLocalText(event.title || event.summary, "未命名日程");
  const time = normalizeLocalText(event.time || [event.start, event.end].filter(Boolean).join("-"), "时间待确认");
  const source = normalizeLocalText(event.source, "飞书日历");
  const location = normalizeLocalText(event.location, "未填写");
  const attendees = normalizeLocalText(event.attendees || event.attendeeText, "待同步");
  const minutes = normalizeLocalText(event.minutes || event.summaryText || event.note, "");
  const needMinutes = event.needMinutes !== false;

  return {
    id: `meeting-local-${safeLocalId(event.id || `${title}-${time}`, index)}`,
    topic: "calendar",
    source: "日程与纪要",
    badge: minutes ? "已补充" : "待纪要",
    title,
    summary: `${time} · ${minutes || "来自本地私有日程，等待飞书用户授权后自动同步。"}`,
    bullets: [
      `时间：${time}`,
      `来源：${source}`,
      location ? `地点：${location}` : "地点未填写",
    ],
    detail: {
      why: `${title} 已从本地私有日程进入平台。当前飞书开放平台应用级授权没有读到这条个人日历，所以先用本地覆盖保证今天的看板准确。`,
      points: [
        `时间：${time}`,
        `来源：${source}`,
        `地点：${location}`,
        `参与者：${attendees}`,
        minutes ? `纪要/备注：${minutes}` : "会议纪要：暂未关联飞书妙记，等待会后补充。",
        "同步状态：来自本地私有日程文件，未写入公开发布数据。",
      ],
      impact: "日程模块必须优先保证今天的工作事实准确。正式授权没打通前，本地私有日程是兜底层，避免看板误判为空。",
      reason: "你早上打开平台时，需要直接知道今天 14:00 有会，而不是看到一个错误的“暂无日程”。",
      output: needMinutes ? `会后补充《${title}》的纪要、结论和下一步动作。` : `确认《${title}》是否需要跟进。`,
      next: "下一步：补飞书用户身份授权，让平台自动读取个人日历，而不是依赖本地兜底。",
    },
  };
}

function buildLocalMessageItem(message, index) {
  const sender = normalizeLocalText(message.senderName || message.sender, "未知发送人");
  const chat = normalizeLocalText(message.chatName || message.chat, "未知会话");
  const time = normalizeLocalText(message.time, "时间未知");
  const text = normalizeLocalText(message.text || message.content || message.summary, "当前消息没有可展示文本内容。");
  const needReply = Boolean(message.needReply || message.requiresReply);

  return {
    id: `message-local-${safeLocalId(message.id || `${sender}-${time}`, index)}`,
    topic: "message",
    source: "飞书消息",
    badge: needReply ? "需回复" : "消息",
    title: `${sender}：${text.slice(0, 32)}${text.length > 32 ? "..." : ""}`,
    summary: `${time} · 来自 ${chat} · ${text}`,
    bullets: [
      `发送人：${sender}`,
      `会话：${chat}`,
      `时间：${time}`,
      needReply ? "状态：建议回复或跟进" : "状态：先归档审阅",
    ],
    detail: {
      why: `${sender} 在 ${chat} 发来消息：${text}`,
      points: [
        `发送人：${sender}`,
        `会话：${chat}`,
        `时间：${time}`,
        `消息内容：${text}`,
        needReply ? "判断：需要回复或转成跟进任务。" : "判断：暂时不需要立即回复，可作为信息审阅。",
        "同步状态：来自本地私有消息文件，未写入公开发布数据。",
      ],
      impact: "消息模块负责把飞书里的沟通信号变成可审阅、可跟进、可产出的结构，而不是只显示未读数量。",
      reason: "谁发来的、说了什么、是否需要回复，直接影响今天的任务优先级。",
      output: needReply ? `回复 ${sender}，并把这条消息转成后续跟进任务。` : `把 ${sender} 的这条消息归档到今日审阅。`,
      next: needReply ? "先回复关键问题，再决定是否加入今日产出。" : "阅读后标记为已审阅。",
    },
  };
}

function replaceTopicItems(items, topic, replacements) {
  if (!replacements.length) return items;
  const nextItems = [];
  let inserted = false;

  items.forEach((item) => {
    if (item.topic === topic) {
      if (!inserted) {
        nextItems.push(...replacements);
        inserted = true;
      }
      return;
    }
    nextItems.push(item);
  });

  if (!inserted) {
    const insertAfterTopic = topic === "message" ? "calendar" : null;
    const insertIndex = insertAfterTopic ? nextItems.map((item) => item.topic).lastIndexOf(insertAfterTopic) + 1 : 0;
    nextItems.splice(Math.max(insertIndex, 0), 0, ...replacements);
  }

  return nextItems;
}

async function mergeLocalPrivateData(data, { includeCalendar = true, includeMessages = true } = {}) {
  const nextData = {
    ...data,
    items: Array.isArray(data?.items) ? [...data.items] : [],
  };

  if (includeCalendar) {
    const localCalendar = await readOptionalJson(LOCAL_CALENDAR_FILE);
    const calendarItems = Array.isArray(localCalendar)
      ? localCalendar.map(buildLocalCalendarItem)
      : Array.isArray(localCalendar?.events)
        ? localCalendar.events.map(buildLocalCalendarItem)
        : [];
    sourceState.localCalendarLoaded = Boolean(calendarItems.length);
    sourceState.localCalendarCount = calendarItems.length;
    nextData.items = replaceTopicItems(nextData.items, "calendar", calendarItems);
  }

  if (includeMessages) {
    const localMessages = await readOptionalJson(LOCAL_MESSAGES_FILE);
    const messageItems = Array.isArray(localMessages)
      ? localMessages.map(buildLocalMessageItem)
      : Array.isArray(localMessages?.messages)
        ? localMessages.messages.map(buildLocalMessageItem)
        : [];
    sourceState.localMessagesLoaded = Boolean(messageItems.length);
    sourceState.localMessagesCount = messageItems.length;
    nextData.items = replaceTopicItems(nextData.items, "message", messageItems);
  }

  nextData.topicCounts = getTopicCounts(nextData.items);
  return nextData;
}

function applyContentData(data) {
  if (!data || !Array.isArray(data.items)) return;
  latestItems = data.items;
  if (data.todayFocus) {
    topicMeta.all.note = data.todayFocus.summary || topicMeta.all.note;
  }

  detailData = data.items.reduce((acc, item) => {
    acc[item.id] = buildDetailRecord(item);
    return acc;
  }, {});

  renderFeed(data.items);
  updateTopicCounts(data.topicCounts || getTopicCounts(data.items));
  updateFeishuStatus(data.items);
  updateFeishuMessageStatus(data.items);
  sourceState.contentLoaded = true;
  sourceState.lastContentLabel = `${formatClock()} 已读取`;
  setPageDate(data.updatedAt);
  renderSourceHealth(data.items);
  showSummary();
  setTopic(document.querySelector(".topic.is-active")?.dataset.topic || "all");
  setSyncStatus(`${formatUpdatedAt(data.updatedAt)} / ${sourceState.lastContentLabel}`, "ready");
}

function applyMessageContentData(data) {
  if (!data || !Array.isArray(data.items)) return;
  if (!latestItems.length) {
    applyContentData(data);
    return;
  }

  const messageItems = data.items.filter((item) => item.topic === "message");
  const nextItems = [];
  let insertedMessages = false;

  latestItems.forEach((item) => {
    if (item.topic === "message") {
      if (!insertedMessages) {
        nextItems.push(...messageItems);
        insertedMessages = true;
      }
      return;
    }
    nextItems.push(item);
  });

  if (!insertedMessages && messageItems.length) {
    const lastCalendarIndex = nextItems.map((item) => item.topic).lastIndexOf("calendar");
    nextItems.splice(lastCalendarIndex + 1, 0, ...messageItems);
  }

  Object.keys(detailData).forEach((id) => {
    if (latestItems.some((item) => item.id === id && item.topic === "message")) {
      delete detailData[id];
    }
  });
  messageItems.forEach((item) => {
    detailData[item.id] = buildDetailRecord(item);
  });

  latestItems = nextItems;
  renderFeed(latestItems);
  updateTopicCounts(getTopicCounts(latestItems));
  updateFeishuMessageStatus(latestItems);
  sourceState.lastMessageRefreshLabel = formatClock();
  renderSourceHealth(latestItems);
  showSummary();
  setTopic(document.querySelector(".topic.is-active")?.dataset.topic || "all");
  setSyncStatus(`飞书消息本地检查：${sourceState.lastMessageRefreshLabel}`, "ready");
}

function getTopicCounts(items) {
  return {
    all: items.length,
    calendar: items.filter((item) => item.topic === "calendar").length,
    message: items.filter((item) => item.topic === "message").length,
    brief: items.filter((item) => item.topic === "brief").length,
    design: items.filter((item) => item.topic === "design").length,
    work: items.filter((item) => item.topic === "work").length,
  };
}

function updateTopicCounts(counts) {
  document.querySelectorAll("[data-count-topic]").forEach((item) => {
    const topic = item.dataset.countTopic;
    item.textContent = counts?.[topic] ?? 0;
  });
}

function updateFeishuStatus(items) {
  if (!feishuStatus) return;
  const calendarItems = items.filter((item) => item.topic === "calendar");
  const localItems = getLocalStatus(items, "calendar");
  const synced = calendarItems.some((item) => !["待授权", "待接入"].includes(item.badge) && !item.id?.includes("auth-needed"));
  const hasMinutes = calendarItems.some((item) => item.badge?.includes("已关联"));
  if (localItems.length) {
    feishuStatus.innerHTML = `<span class="status local"></span>日程：本地私有 ${localItems.length} 条 / 正式授权待完成`;
    return;
  }
  if (!synced) {
    feishuStatus.innerHTML = '<span class="status waiting"></span>飞书日历 / 妙记待接入';
    return;
  }
  feishuStatus.innerHTML = hasMinutes
    ? '<span class="status ready"></span>飞书日历已同步 / 妙记已关联'
    : '<span class="status ready"></span>飞书日历已同步 / 妙记待关联';
}

function updateFeishuMessageStatus(items) {
  if (!feishuMessageStatus) return;
  const messageItems = items.filter((item) => item.topic === "message");
  const localItems = getLocalStatus(items, "message");
  const synced = messageItems.some((item) => item.id?.startsWith("message-") && !["待授权", "待接入"].includes(item.badge));
  if (localItems.length) {
    feishuMessageStatus.innerHTML = `<span class="status local"></span>消息：本地私有 ${localItems.length} 条 / 10 分钟检查`;
    return;
  }
  if (!messageItems.length) {
    feishuMessageStatus.innerHTML = '<span class="status waiting"></span>飞书消息：待接入';
    return;
  }
  feishuMessageStatus.innerHTML = synced
    ? `<span class="status ready"></span>飞书消息：${messageItems.length} 条`
    : '<span class="status waiting"></span>飞书消息：待接入';
}

function getReadableTopic(topic) {
  return topicMeta[topic]?.title || "今日信息";
}

function buildSummary() {
  const items = latestItems.length
    ? latestItems
    : Object.entries(detailData).map(([id, item]) => ({ id, topic: "brief", title: item.title, detail: item }));
  const briefCount = items.filter((item) => item.topic === "brief").length;
  const designCount = items.filter((item) => item.topic === "design").length;
  const calendarCount = items.filter((item) => item.topic === "calendar").length;
  const messageCount = items.filter((item) => item.topic === "message").length;
  const workCount = items.filter((item) => item.topic === "work").length;
  const focus = items.find((item) => item.topic === "brief") || items[0];
  const design = items.find((item) => item.topic === "design");
  const syncRiskCount = Number(!sourceState.localCalendarLoaded && calendarCount > 0) + Number(!sourceState.localMessagesLoaded && messageCount > 0);
  const syncRisk = syncRiskCount
    ? `飞书仍有 ${syncRiskCount} 个授权风险，今天不能把日程/消息视为完整数据。`
    : "日程和消息已有可用兜底，可以进入正常审阅。";

  return {
    title: "今天只盯 3 件事：观点产出、视觉规则、飞书同步",
    points: [
      {
        label: "行业目标",
        title: focus ? `把「${focus.title}」转成一条 Agent UI 观点` : "先补一条可沉淀的行业信号",
        note: `从 ${briefCount} 条 AI 晨报里选 1 条，产出短文、案例卡或状态模型。`,
      },
      {
        label: "设计任务",
        title: design ? `从「${design.title}」提炼 3 条视觉规则` : "等待设计源刷新后再提炼规则",
        note: `今天有 ${designCount} 组设计源，不再只看图，优先沉淀可复用的界面规则。`,
      },
      {
        label: "同步风险",
        title: syncRisk,
        note: `当前读取 ${items.length} 条信息：日程 ${calendarCount}、消息 ${messageCount}、晨报 ${briefCount}、设计源 ${designCount}、工作占位 ${workCount}。`,
      },
    ],
  };
}

function showSummary() {
  const summary = buildSummary();
  summaryTitle.textContent = summary.title;
  summaryPoints.innerHTML = summary.points
    .map(
      (point, index) => `
        <article>
          <span>${String(index + 1).padStart(2, "0")}</span>
          <div>
            <em>${escapeHtml(point.label)}</em>
            <strong>${escapeHtml(point.title)}</strong>
            <p>${escapeHtml(point.note)}</p>
          </div>
        </article>
      `,
    )
    .join("");
  summaryPanel.hidden = false;
}

function buildTask(data, id) {
  const title = data.output?.replace(/^创作任务：/, "") || data.title;
  const purpose = data.reason || data.impact || data.why;
  return {
    id,
    type: data.type,
    title,
    purpose,
    next: data.next || "下一步：把这条信息整理成一页可复用的作品集素材。",
  };
}

function renderOutputDock() {
  outputDock.hidden = outputTasks.length === 0;
  outputList.innerHTML = outputTasks
    .map(
      (task, index) => `
        <article class="output-item">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <div>
            <p>${escapeHtml(task.type)}</p>
            <h3>${escapeHtml(task.title)}</h3>
            <small>${escapeHtml(task.next)}</small>
          </div>
        </article>
      `,
    )
    .join("");
}

function saveOutputTasks() {
  try {
    window.localStorage?.setItem("bill-ai-output-tasks", JSON.stringify(outputTasks));
  } catch (error) {
    // Some embedded/browser contexts block localStorage; the in-page queue still works.
  }
}

function updateAddToOutputButton() {
  if (!addToOutputButton) return;
  const exists = outputTasks.some((item) => item.id === currentDetailId);
  addToOutputButton.textContent = exists ? "已生成，查看今日产出" : "生成今日产出任务";
  addToOutputButton.dataset.state = exists ? "added" : "idle";
}

function showOutputDock() {
  const activeTopic = document.querySelector(".topic.is-active")?.dataset.topic || "all";
  showList(activeTopic, { scrollTarget: outputDock });
}

function showTaskResult(task) {
  taskResult.hidden = false;
  taskResult.innerHTML = `
    <p>已生成今日产出</p>
    <h2>${escapeHtml(task.title)}</h2>
    <p class="task-result-note">这条任务已经进入首页底部的「今日产出」。它用于承接你读完之后真正要写、要画、要整理的内容。</p>
    <ul>
      <li><strong>用途</strong>${escapeHtml(task.purpose)}</li>
      <li><strong>下一步</strong>${escapeHtml(task.next)}</li>
    </ul>
    <div class="task-result-actions">
      <button class="primary-button" type="button" data-action="view-output">查看今日产出</button>
      <button class="text-button" type="button" data-action="keep-reading">继续阅读</button>
    </div>
  `;
  taskResult.querySelector('[data-action="view-output"]')?.addEventListener("click", showOutputDock);
  taskResult.querySelector('[data-action="keep-reading"]')?.addEventListener("click", () => {
    taskResult.hidden = true;
  });
}

function addCurrentDetailToOutput() {
  const data = detailData[currentDetailId];
  if (!data) return;
  const task = buildTask(data, currentDetailId);
  const existingIndex = outputTasks.findIndex((item) => item.id === task.id);
  if (existingIndex >= 0) {
    outputTasks[existingIndex] = task;
  } else {
    outputTasks.unshift(task);
  }
  saveOutputTasks();
  renderOutputDock();
  showTaskResult(task);
  updateAddToOutputButton();
  showToast("已生成今日产出任务。");
}

async function loadDailyContent({ silent = false } = {}) {
  try {
    setSyncStatus("正在读取已发布数据...", "loading");
    const response = await fetch(`data/daily-content.json?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await mergeLocalPrivateData(await response.json());
    applyContentData(data);
    if (!silent) showToast("已读取最新发布数据。");
  } catch (error) {
    renderSourceHealth([]);
    setSyncStatus("使用页面内置数据", "fallback");
    if (!silent) showToast("没有读到已发布数据，先使用页面内置内容。");
  }
}

async function refreshFeishuMessages({ silent = true } = {}) {
  try {
    const response = await fetch(`data/daily-content.json?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await mergeLocalPrivateData(await response.json(), { includeCalendar: false, includeMessages: true });
    applyMessageContentData(data);
    if (!silent) showToast("飞书消息已更新。");
  } catch (error) {
    sourceState.lastMessageRefreshLabel = `${formatClock()} 失败`;
    renderSourceHealth(latestItems);
    if (!silent) showToast("飞书消息暂时没有更新。");
  }
}

function setTopic(topic) {
  const meta = topicMeta[topic] || topicMeta.all;
  topics.forEach((item) => item.classList.toggle("is-active", item.dataset.topic === topic));
  cards.forEach((card) => {
    const visible = topic === "all" || card.dataset.topic === topic;
    card.classList.toggle("is-hidden", !visible);
  });
  pageTitle.textContent = meta.title;
  pageKicker.textContent = meta.kicker;
  pageNote.textContent = meta.note;
}

function showList(topic = "all", options = {}) {
  detailView.classList.remove("is-active");
  listView.classList.add("is-active");
  setTopic(topic);
  window.scrollTo({ top: lastListScrollY, behavior: "auto" });
  requestAnimationFrame(() => {
    if (options.scrollTarget) {
      options.scrollTarget.hidden = false;
      options.scrollTarget.scrollIntoView({ block: "start", behavior: "smooth" });
      return;
    }
    const anchorCard = lastOpenedCardId ? document.querySelector(`[data-id="${CSS.escape(lastOpenedCardId)}"]`) : null;
    if (anchorCard && !anchorCard.classList.contains("is-hidden")) {
      anchorCard.scrollIntoView({ block: "center", behavior: "smooth" });
    } else {
      window.scrollTo({ top: lastListScrollY, behavior: "smooth" });
    }
  });
}

function openDetail(id) {
  const data = detailData[id];
  if (!data) return;
  currentDetailId = id;
  lastOpenedCardId = id;
  lastListScrollY = window.scrollY;
  taskResult.hidden = true;
  taskResult.innerHTML = "";
  updateAddToOutputButton();

  document.querySelector("#detailType").textContent = data.type;
  document.querySelector("#detailTitle").textContent = data.title;
  document.querySelector("#detailWhy").textContent = data.why;
  document.querySelector("#detailImpact").textContent = data.impact || "这条信息需要补充对 AI × 设计的影响。";
  document.querySelector("#detailReason").textContent = data.reason || "这条信息需要补充为什么值得关注。";
  document.querySelector("#detailOutput").textContent = data.output;
  document.querySelector("#detailNext").textContent = data.next;
  document.querySelector("#detailPoints").innerHTML = data.points.map((point) => `<li>${point}</li>`).join("");
  const gallery = document.querySelector("#detailGallery");
  gallery.innerHTML = (data.images || [])
    .map((image, index) => `
        <div class="gallery-item">
          <button type="button" data-image-index="${index}">
          <img src="${escapeHtml(image.src)}" ${image.originalSrc ? `data-fallback-src="${escapeHtml(image.originalSrc)}"` : ""} alt="${escapeHtml(image.alt)}" loading="lazy" referrerpolicy="no-referrer" />
          <span>${escapeHtml(image.alt)}</span>
          </button>
          <button class="source-link" type="button" data-source-index="${index}">${image.href ? "原始页面" : "查看参考"}</button>
        </div>
      `)
    .join("");
  gallery.classList.toggle("is-empty", !(data.images || []).length);
  watchImages(gallery);
  gallery.querySelectorAll("[data-image-index]").forEach((button) => {
    button.addEventListener("click", () => openImagePreview(data.images[Number(button.dataset.imageIndex)]));
  });
  gallery.querySelectorAll("[data-source-index]").forEach((button) => {
    button.addEventListener("click", () => openImagePreview(data.images[Number(button.dataset.sourceIndex)]));
  });

  listView.classList.remove("is-active");
  detailView.classList.add("is-active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

topics.forEach((topic) => topic.addEventListener("click", () => showList(topic.dataset.topic)));

cards.forEach((card) => {
  card.querySelector(".open-detail").addEventListener("click", () => openDetail(card.dataset.id));
});

document.querySelector("#backButton").addEventListener("click", () => {
  const activeTopic = document.querySelector(".topic.is-active")?.dataset.topic || "all";
  showList(activeTopic);
});

bottomBackButton?.addEventListener("click", () => {
  const activeTopic = document.querySelector(".topic.is-active")?.dataset.topic || "all";
  showList(activeTopic);
});

addToOutputButton?.addEventListener("click", () => {
  const exists = outputTasks.some((item) => item.id === currentDetailId);
  if (exists) {
    showOutputDock();
    return;
  }
  addCurrentDetailToOutput();
});

document.querySelector("#makeSummary").addEventListener("click", () => {
  showSummary();
  summaryPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

clearSummary?.addEventListener("click", () => {
  document.querySelector("#feed")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

clearOutput?.addEventListener("click", () => {
  outputTasks = [];
  saveOutputTasks();
  renderOutputDock();
  updateAddToOutputButton();
});

modalClose?.addEventListener("click", closeImagePreview);
imageModal?.addEventListener("click", (event) => {
  if (event.target === imageModal) closeImagePreview();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeImagePreview();
});

loadDailyContent({ silent: true });
renderOutputDock();
setInterval(() => {
  window.location.reload();
}, FULL_PAGE_REFRESH_INTERVAL_MS);
setInterval(() => {
  refreshFeishuMessages({ silent: true });
}, MESSAGE_REFRESH_INTERVAL_MS);
