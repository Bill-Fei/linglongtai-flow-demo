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
const todayMeta = document.querySelector("#todayMeta");
const imageModal = document.querySelector("#imageModal");
const modalClose = document.querySelector("#modalClose");
const modalImage = document.querySelector("#modalImage");
const modalCaption = document.querySelector("#modalCaption");
const modalSource = document.querySelector("#modalSource");

const topicMeta = {
  all: {
    title: "今天先读真实信号",
    kicker: "AI 建议",
    note: "今天重点不是“看新闻”，而是把 Claude Tag、Codex 和 AgentWorld 三条信号转成 AI Presence / Agent UI 的设计判断。",
  },
  calendar: {
    title: "日程与纪要",
    kicker: "会议上下文",
    note: "这一组用于承接飞书日历和妙记。现在先保留结构，之后每场会议都要能沉淀目标、结论、行动项和设计风险。",
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
  behance: {
    type: "设计风格源",
    title: "Behance：地区不可用，暂不接入",
    why: "你反馈 Behance 当前地区不可用，所以这一路先暂停。平台里保留这个入口，是为了以后可访问时继续承接完整项目叙事和作品集结构拆解。",
    points: ["当前状态：地区不可用，不进入每日自动采集。", "不再把 Behance 标记为待登录，避免误导。", "临时替代：用 Dribbble 的项目页补组件表达，用优设案例补中文叙事，用你手动提供的作品集案例补完整结构。"],
    impact: "Behance 原本负责作品集叙事层：背景、洞察、过程、系统结构、关键界面和结果。暂停后，平台仍然需要保留这个信息层，只是暂时换来源。",
    reason: "你做这个平台的最终目标之一是形成作品集和求职表达。完整项目叙事不能丢，只是今天不依赖 Behance。",
    output: "创作任务：先建立你自己的 AI Native 作品集叙事模板：背景 / 问题 / 系统结构 / 关键交互 / AI 行为 / 结果。",
    next: "下一步：Behance 暂停，等地区可用后再恢复；短期用优设案例和 Dribbble 项目页补位。",
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

function formatUpdatedAt(value) {
  if (!value) return "数据更新时间未知";
  return `数据更新：${value}`;
}

function openImagePreview(image) {
  if (!imageModal || !modalImage || !modalCaption || !modalSource || !image) return;
  modalImage.src = image.src;
  modalImage.alt = image.alt || "设计参考图";
  modalCaption.textContent = image.alt || "设计参考图";
  modalSource.href = image.href || image.src;
  imageModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeImagePreview() {
  if (!imageModal || !modalImage) return;
  imageModal.setAttribute("aria-hidden", "true");
  modalImage.removeAttribute("src");
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
                    <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy" referrerpolicy="no-referrer" />
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
}

function applyContentData(data) {
  if (!data || !Array.isArray(data.items)) return;
  if (data.todayFocus) {
    document.querySelector(".today-focus h2").textContent = data.todayFocus.title || "从真实信号里提炼 AI Native 观点";
    todayMeta.textContent = data.todayFocus.meta || `${data.items.length} 条待审阅`;
    topicMeta.all.note = data.todayFocus.summary || topicMeta.all.note;
  }

  detailData = data.items.reduce((acc, item) => {
    const detail = item.detail || {};
    acc[item.id] = {
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
    return acc;
  }, {});

  renderFeed(data.items);
  setTopic(document.querySelector(".topic.is-active")?.dataset.topic || "all");
  setSyncStatus(formatUpdatedAt(data.updatedAt), "ready");
}

async function loadDailyContent({ silent = false } = {}) {
  try {
    const response = await fetch(`data/daily-content.json?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    applyContentData(data);
    if (!silent) showToast("已读取最新本地数据。");
  } catch (error) {
    setSyncStatus("使用页面内置数据", "fallback");
    if (!silent) showToast("没有读到本地数据，先使用页面内置内容。");
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

function showList(topic = "all") {
  detailView.classList.remove("is-active");
  listView.classList.add("is-active");
  setTopic(topic);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openDetail(id) {
  const data = detailData[id];
  if (!data) return;

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
          <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy" referrerpolicy="no-referrer" />
          <span>${escapeHtml(image.alt)}</span>
          </button>
          <a href="${escapeHtml(image.href || image.src)}" target="_blank" rel="noreferrer">来源</a>
        </div>
      `)
    .join("");
  gallery.classList.toggle("is-empty", !(data.images || []).length);
  gallery.querySelectorAll("[data-image-index]").forEach((button) => {
    button.addEventListener("click", () => openImagePreview(data.images[Number(button.dataset.imageIndex)]));
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

document.querySelector("#addToOutput").addEventListener("click", () => {
  showToast("已生成创作任务：下一版会在首页显示任务标题、用途、结构和草稿入口。");
});

document.querySelector("#makeSummary").addEventListener("click", () => {
  showToast("今日总结建议：先写 Codex 工程代理观察，再整理 AI 工作台的创作任务流。");
});

document.querySelector("#connectSources").addEventListener("click", () => {
  showToast("AI 晨报 09:00，设计源 09:15。页面会读取 data/daily-content.json；打开或刷新即可看到最新数据。");
});

modalClose?.addEventListener("click", closeImagePreview);
imageModal?.addEventListener("click", (event) => {
  if (event.target === imageModal) closeImagePreview();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeImagePreview();
});

loadDailyContent({ silent: true });
setInterval(() => loadDailyContent({ silent: true }), 5 * 60 * 1000);
