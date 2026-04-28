const VISUAL_VARIANTS = ["aurora", "interface", "city", "document", "sound", "image"];

const LAYOUTS = [
  [
    { x: -85, y: 0, rot: 0, scale: 1, w: 158, h: 154, z: 1 },
    { x: 85, y: 0, rot: 0, scale: 1, w: 158, h: 154, z: 1 },
    { x: 0, y: 166, rot: 0, scale: 1, w: 328, h: 154, z: 1 },
    { x: 338, y: 0, rot: 0, scale: 1, w: 328, h: 320, z: 1 },
    { x: 676, y: 0, rot: 0, scale: 1, w: 328, h: 154, z: 1 },
  ],
  [
    { x: -85, y: 0, rot: 0, scale: 1, w: 158, h: 154, z: 1 },
    { x: 85, y: 0, rot: 0, scale: 1, w: 158, h: 154, z: 1 },
    { x: 0, y: 166, rot: 0, scale: 1, w: 328, h: 154, z: 1 },
    { x: 338, y: 0, rot: 0, scale: 1, w: 328, h: 320, z: 1 },
    { x: 676, y: 0, rot: 0, scale: 1, w: 328, h: 154, z: 1 },
  ],
  [
    { x: -85, y: 0, rot: 0, scale: 1, w: 158, h: 154, z: 1 },
    { x: 85, y: 0, rot: 0, scale: 1, w: 158, h: 154, z: 1 },
    { x: 0, y: 166, rot: 0, scale: 1, w: 328, h: 154, z: 1 },
    { x: 338, y: 0, rot: 0, scale: 1, w: 328, h: 320, z: 1 },
    { x: 676, y: 0, rot: 0, scale: 1, w: 328, h: 154, z: 1 },
  ],
];

const CARD_BATCHES = [
  [
    {
      type: "query",
      text: ".tdb文件属于什么类型？需要使用哪些软件才能正常打开？",
    },
    {
      type: "weather",
      date: "2016-01-21",
      temp: "29°",
      desc: "多云间晴",
      city: "海淀区",
      range: "36°～13°",
    },
    {
      type: "podcast",
      title: "设计职场商务英语汇报技巧二三事",
      summary: "“用简洁专业的表达传递关键价值、逻辑清晰贴合职场",
    },
    {
      type: "article",
      title: "AUI 设计的核心是将虚拟信息与真实世界相结合，强调空间场景中的交互性",
      source: "来自于：UI中国",
      visual: "aurora",
      visualText: "AUI",
    },
    {
      type: "query-list",
      items: ["使用AI插件提升排版效率？", "联想电脑怎么选"],
    },
  ],
  [
    {
      type: "query",
      text: "帮我把今晚会议纪要整理成三条行动项，并标注负责人。",
    },
    {
      type: "weather",
      date: "2026-04-20",
      temp: "22°",
      desc: "微风晴",
      city: "朝阳区",
      range: "26°～14°",
    },
    {
      type: "podcast",
      title: "从灵感到界面：让 AI 推荐卡片更自然浮现",
      summary: "“把信息整理成可行动的提示，让每一次打开都有下一步",
    },
    {
      type: "article",
      title: "从灵感到界面：让 AI 推荐卡片更像自然浮现",
      source: "来自于：天禧精选",
      visual: "image",
      visualText: "IDEA",
    },
    {
      type: "query-list",
      items: ["AI 首页动效怎样更有生成感？", "15:30 产品动效评审"],
    },
  ],
  [
    {
      type: "query",
      text: "把这段英文产品说明翻译成更自然的中文，不要太营销。",
    },
    {
      type: "weather",
      date: "2026-04-21",
      temp: "18°",
      desc: "小雨转阴",
      city: "西城区",
      range: "21°～12°",
    },
    {
      type: "podcast",
      title: "如何让卡片不只是列表，而是一次可感知的生成",
      summary: "“用清晰的层级和节奏，让推荐内容像被整理好一样出现",
    },
    {
      type: "article",
      title: "如何让卡片不只是列表，而是一次可感知的内容生成",
      source: "来自于：设计笔记",
      visual: "document",
      visualText: "CARD",
    },
    {
      type: "query-list",
      items: ["最近收藏了 6 篇 AUI 资料", "翻译：Make it feel alive"],
    },
  ],
  [
    {
      type: "query",
      text: "这张截图里有哪些信息可以自动提取成待办？",
    },
    {
      type: "weather",
      date: "2026-04-22",
      temp: "25°",
      desc: "云量增多",
      city: "海淀区",
      range: "28°～17°",
    },
    {
      type: "podcast",
      title: "端侧智能的下一步：让推荐在上下文里自然发生",
      summary: "“从用户正在做的事里推断下一步，少打扰但更有用",
    },
    {
      type: "article",
      title: "端侧智能的下一步：让推荐在上下文里自然发生",
      source: "来自于：科技前沿",
      visual: "city",
      visualText: "EDGE AI",
    },
    {
      type: "query-list",
      items: ["打开最近编辑的项目文件", "v4.0 需求设计进度.pdf"],
    },
  ],
  [
    {
      type: "query",
      text: "把这张长图里的关键信息整理成发布会讲稿提纲。",
    },
    {
      type: "weather",
      date: "2026-04-23",
      temp: "21°",
      desc: "阵雨转晴",
      city: "望京",
      range: "24°～15°",
    },
    {
      type: "podcast",
      title: "多模态首页：从输入框到主动建议的微交互演进",
      summary: "“语音、图像和文本都能成为首页推荐的自然入口",
    },
    {
      type: "article",
      title: "多模态首页：从输入框到主动建议的微交互演进",
      source: "来自于：交互观察",
      visual: "sound",
      visualText: "VOICE",
    },
    {
      type: "query-list",
      items: ["同声传译：即时切换场景", "0423 设计团队周会纪要"],
    },
  ],
  [
    {
      type: "query",
      text: "根据我的浏览记录，推荐几个适合做产品灵感库的内容。",
    },
    {
      type: "weather",
      date: "2026-04-24",
      temp: "24°",
      desc: "晴间多云",
      city: "中关村",
      range: "27°～16°",
    },
    {
      type: "podcast",
      title: "让 AI 首页更像一个会呼吸的工作台",
      summary: "“把入口、内容和任务组织成一组稳定的每日建议",
    },
    {
      type: "article",
      title: "让 AI 首页更像一个会呼吸的工作台，而不是功能入口集合",
      source: "来自于：体验研究",
      visual: "aurora",
      visualText: "WORK",
    },
    {
      type: "query-list",
      items: ["整理天禧首页动效录屏", "AI写作：一句话介绍功能"],
    },
  ],
];

const cardLayer = document.getElementById("cardLayer");
const cardStage = document.querySelector(".card-stage");
const composer = document.getElementById("composer");
const messageInput = document.getElementById("messageInput");
const phone = document.querySelector(".phone");
const addButton = document.querySelector(".composer__icon--add");
const micButton = document.querySelector(".composer__icon--mic");
const sendButton = document.querySelector(".composer__icon--send");
const voiceCapture = document.getElementById("voiceCapture");
const voiceBars = Array.from(document.querySelectorAll(".voice-wave__bar"));
const resultView = document.getElementById("resultView");
const resultBack = document.getElementById("resultBack");
const resultQuestion = document.getElementById("resultQuestion");
const resultAnswer = document.getElementById("resultAnswer");
const voiceBaseHeights = [2.6, 5.7, 4.1, 7.4, 5.7, 10.2, 7.4, 4.1, 8.8, 11.6, 6.6, 3.4, 3.4, 6.6, 11.6, 8.8, 4.1, 7.4, 10.2, 5.7, 7.4, 4.1, 5.7, 2.6];
const CARD_GROUP_VISIBLE_COUNT = 4;
const CARD_GROUP_OFFSET = 676;
const CARD_TRACK_TAIL_WIDTH = 682;
const CARD_PREVIEW_SCROLL = 148;
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let hasUsedCardStage = false;
let cardPreviewTimers = [];
let cardPreviewFrame = 0;

let batchIndex = 0;
let layoutIndex = 0;
let pressTimer = 0;
let isRecording = false;
let pressStartY = 0;
let pressStartX = 0;
let voiceWaveTimer = 0;
let recordingFallbackTimer = 0;
let capturedPointerId = null;
let activeVoicePointerId = null;
let activeTouchId = null;
let pressStartedOnInput = false;
let shouldFocusInputOnTap = false;
let suppressNativeInputFocus = false;

const VOICE_CANCEL_DISTANCE = 150;

function captureComposerPointer(event) {
  if (typeof event.pointerId !== "number") return;
  try {
    composer.setPointerCapture(event.pointerId);
    capturedPointerId = event.pointerId;
  } catch {
    capturedPointerId = null;
  }
}

function releaseComposerPointer() {
  if (capturedPointerId === null) return;
  try {
    composer.releasePointerCapture(capturedPointerId);
  } catch {}
  capturedPointerId = null;
}

function isVoiceStartTarget(target) {
  if (!target) return false;
  return target === messageInput || target === composer || Boolean(target.closest(".composer__icon--mic"));
}

function isInputPressTarget(target) {
  return target === messageInput;
}

function getTrackedTouch(event) {
  if (activeTouchId === null) return null;
  return Array.from(event.changedTouches || []).find((touch) => touch.identifier === activeTouchId) || null;
}

function beginInputFocusGuard() {
  suppressNativeInputFocus = true;
  messageInput.setAttribute("readonly", "readonly");
}

function endInputFocusGuard() {
  suppressNativeInputFocus = false;
  messageInput.removeAttribute("readonly");
}

function scalePhone() {
  const isRealDevicePreview = window.matchMedia("(max-width: 720px), (pointer: coarse)").matches;
  if (isRealDevicePreview) {
    phone.style.transform = "none";
    return;
  }

  const scale = Math.min((window.innerWidth - 24) / 360, (window.innerHeight - 24) / 880, 1);
  phone.style.transform = `scale(${scale})`;
}

function isDesktopPreview() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function isMobilePreview() {
  return window.matchMedia("(max-width: 720px), (pointer: coarse)").matches;
}

function setKeyboardOffset() {
  if (!phone.classList.contains("is-typing")) {
    phone.style.setProperty("--keyboard-offset", "0px");
    return;
  }

  if (isDesktopPreview()) {
    phone.style.setProperty("--keyboard-offset", "306px");
    return;
  }

  const viewport = window.visualViewport;
  const offset = viewport ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) : 0;
  phone.style.setProperty("--keyboard-offset", `${Math.min(offset, 430)}px`);
}

function enterTypingMode() {
  if (phone.classList.contains("has-result") || isRecording) return;
  phone.classList.add("is-typing");
  window.requestAnimationFrame(setKeyboardOffset);
}

function exitTypingMode() {
  window.setTimeout(() => {
    if (document.activeElement === messageInput || isRecording) return;
    phone.classList.remove("is-typing");
    setKeyboardOffset();
  }, 90);
}

function updateComposerTextState() {
  const hasText = Boolean(messageInput.value.trim());
  composer.classList.toggle("has-text", hasText);
  phone.classList.toggle("has-composer-text", hasText);
}

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[char];
  });
}

function buildAnswer(question) {
  const cleanQuestion = escapeHTML(question);
  if (cleanQuestion.toLowerCase().includes("claude code")) {
    return `
      <p>先给你核心结论：</p>
      <p>Anthropic 官方 Claude 大模型本体没有开源、无法纯本地原生部署；你说的 Claude Code 是官方 CLI/IDE 编程客户端工具，本身只是前端交互层，后端必须对接模型服务。</p>
      <ol>
        <li>对接官方 Claude API（联网、付费、效果最好）</li>
        <li>对接 Ollama 本地开源代码模型（完全本地离线、免费、无官方模型）（国内用户首选）</li>
      </ol>
      <p>下面给你全平台（Windows/macOS/Linux）保姆级完整部署、配置、踩坑、VSCode 集成全流程。</p>
    `;
  }

  return `
    <p>先给你核心结论：</p>
    <p>围绕「${cleanQuestion}」，天禧会先识别你的真实意图，再把问题拆成可以直接行动的步骤。</p>
    <ol>
      <li>如果是工具部署类问题，会先区分官方能力、本地替代方案和必要环境。</li>
      <li>如果是设计或内容类问题，会先给出结构化方案，再补充可执行细节。</li>
    </ol>
    <p>你可以继续追问安装流程、风险点、对比方案，或者让我把这段回答整理成一份完整执行清单。</p>
  `;
}

function showResultPage(question) {
  const finalQuestion = question.trim() || "Claude code的本地化部署";
  resultQuestion.textContent = finalQuestion;
  resultAnswer.innerHTML = buildAnswer(finalQuestion);
  isRecording = false;
  window.clearTimeout(pressTimer);
  window.clearTimeout(voiceWaveTimer);
  window.clearTimeout(recordingFallbackTimer);
  phone.classList.remove("is-typing", "is-recording");
  phone.classList.add("has-result");
  resultView.setAttribute("aria-hidden", "false");
  voiceCapture.setAttribute("aria-hidden", "true");
  setVoiceWaveIdle();
  messageInput.blur();
  messageInput.value = "";
  updateComposerTextState();
  setKeyboardOffset();
}

function hideResultPage() {
  phone.classList.remove("has-result");
  resultView.setAttribute("aria-hidden", "true");
}

function setVoiceWaveIdle() {
  voiceBars.forEach((bar, index) => {
    const height = voiceBaseHeights[index] || 4;
    bar.style.height = `${height}px`;
    bar.style.opacity = "0.86";
    bar.style.transform = "scaleY(1)";
  });
}

function animateVoiceWave() {
  if (!isRecording) return;

  const now = Date.now() / 130;
  voiceBars.forEach((bar, index) => {
    const base = voiceBaseHeights[index] || 4;
    const phase = Math.sin(now + index * 0.84);
    const nearCenter = 1 - Math.abs(index - (voiceBars.length - 1) / 2) / (voiceBars.length / 2);
    const noise = 0.55 + Math.random() * 0.72;
    const height = Math.max(2.2, Math.min(13.1, base + phase * 2.2 + nearCenter * noise * 4.2));
    bar.style.height = `${height.toFixed(2)}px`;
    bar.style.opacity = String(Math.min(1, 0.72 + height / 24));
    bar.style.transform = `scaleY(${(0.96 + height / 82).toFixed(3)})`;
  });

  voiceWaveTimer = window.setTimeout(animateVoiceWave, 86);
}

function startRecording() {
  if (isRecording || phone.classList.contains("has-result")) return;
  isRecording = true;
  shouldFocusInputOnTap = false;
  endInputFocusGuard();
  window.clearTimeout(pressTimer);
  window.clearTimeout(voiceWaveTimer);
  window.clearTimeout(recordingFallbackTimer);
  messageInput.blur();
  phone.classList.remove("is-typing");
  phone.classList.add("is-recording");
  voiceCapture.setAttribute("aria-hidden", "false");
  setKeyboardOffset();
  animateVoiceWave();
  recordingFallbackTimer = window.setTimeout(cancelRecording, 12000);
}

function finishRecording(event) {
  if (!isRecording) return;
  const shouldCancel = event && typeof event.clientY === "number" && event.clientY < pressStartY - VOICE_CANCEL_DISTANCE;
  isRecording = false;
  window.clearTimeout(voiceWaveTimer);
  window.clearTimeout(recordingFallbackTimer);
  releaseComposerPointer();
  activeVoicePointerId = null;
  activeTouchId = null;
  phone.classList.remove("is-recording");
  voiceCapture.setAttribute("aria-hidden", "true");
  setVoiceWaveIdle();
  if (!shouldCancel) {
    showResultPage("语音输入：Claude code 的本地化部署");
  }
}

function cancelRecording() {
  window.clearTimeout(pressTimer);
  window.clearTimeout(recordingFallbackTimer);
  releaseComposerPointer();
  activeVoicePointerId = null;
  activeTouchId = null;
  if (!isRecording) return;
  isRecording = false;
  window.clearTimeout(voiceWaveTimer);
  phone.classList.remove("is-recording");
  voiceCapture.setAttribute("aria-hidden", "true");
  setVoiceWaveIdle();
}

function quoteIcon() {
  return `
    <span class="gen-card__quote" aria-hidden="true">
      <svg viewBox="0 0 16 16">
        <path d="M6.6 4.1C4.6 4.7 3.5 6.2 3.5 8.3V12H7.1V8.3H5.6C5.6 7.2 6.1 6.4 7.2 5.9L6.6 4.1Z" />
        <path d="M12.3 4.1C10.3 4.7 9.2 6.2 9.2 8.3V12H12.8V8.3H11.3C11.3 7.2 11.8 6.4 12.9 5.9L12.3 4.1Z" />
      </svg>
    </span>
  `;
}

function cardStyle(layout, index, pageOffset = 0) {
  return [
    `--x:${layout.x + pageOffset}px`,
    `--y:${layout.y}px`,
    `--rot:${layout.rot}deg`,
    `--scale:${layout.scale}`,
    `--w:${layout.w}px`,
    `--h:${layout.h}px`,
    `--z:${layout.z}`,
    `--delay:${index * 58}ms`,
  ].join(";");
}

function createCard(card, layout, index, pageOffset = 0) {
  const element = document.createElement("article");
  element.className = `gen-card ${card.type}-card`;
  element.style.cssText = cardStyle(layout, index, pageOffset);

  if (card.type === "query") {
    element.innerHTML = `${quoteIcon()}<p class="gen-card__text">${card.text}</p>`;
    return element;
  }

  if (card.type === "weather") {
    element.innerHTML = `
      <p class="weather-card__date">${card.date}</p>
      <div class="weather-card__body">
        <div>
          <p class="weather-card__temp">${card.temp}</p>
          <p class="weather-card__desc">${card.desc}</p>
        </div>
        <div class="weather-card__icon" aria-hidden="true">
          <span class="weather-card__sun"></span>
          <span class="weather-card__cloud"></span>
        </div>
      </div>
      <p class="weather-card__meta"><span>${card.city}</span><span>${card.range}</span></p>
    `;
    return element;
  }

  if (card.type === "podcast") {
    element.innerHTML = `
      <div class="podcast-card__main">
        <div class="podcast-card__cover" aria-hidden="true">
          <img src="./assets/icon-ai-podcast.svg" alt="" />
        </div>
        <p class="podcast-card__title">${card.title}</p>
        <button class="podcast-card__play" type="button" aria-label="播放播客" tabindex="-1">
          <span></span>
        </button>
      </div>
      <p class="podcast-card__summary">${card.summary}</p>
      <div class="podcast-card__wave" aria-hidden="true">
        ${Array.from({ length: 36 }, (_, itemIndex) => `<span style="--i:${itemIndex}"></span>`).join("")}
      </div>
    `;
    return element;
  }

  if (card.type === "query-list") {
    element.innerHTML = card.items
      .map((item) => `
        <div class="query-list-card__item">
          <span>${item}</span>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M6 3.5L10.5 8L6 12.5" />
          </svg>
        </div>
      `)
      .join("");
    return element;
  }

  if (card.type === "article") {
    const visual = card.visual || VISUAL_VARIANTS[index % VISUAL_VARIANTS.length];
    const media = card.image
      ? `<img src="${card.image}" alt="" loading="lazy" />`
      : `<div class="article-visual article-visual--${visual}" aria-hidden="true"><span>${card.visualText || "AI"}</span></div>`;
    element.innerHTML = `
      <p class="article-card__title">${card.title}</p>
      <div class="article-card__media">${media}</div>
      <p class="article-card__source">${card.source}</p>
    `;
    const image = element.querySelector("img");
    image?.addEventListener("error", () => image.remove(), { once: true });
    return element;
  }

  if (card.type === "translate") {
    element.innerHTML = `
      <p class="utility-card__label">${card.label}</p>
      <p class="translate-card__from">${card.from}</p>
      <p class="translate-card__to">${card.to}</p>
    `;
    return element;
  }

  if (card.type === "schedule") {
    element.innerHTML = `
      <p class="schedule-card__time">${card.time}</p>
      <p class="schedule-card__title">${card.title}</p>
      <p class="schedule-card__meta">${card.meta}</p>
      <span class="schedule-card__status">${card.status}</span>
    `;
    return element;
  }

  if (card.type === "file") {
    element.innerHTML = `
      <p class="file-card__name">${card.name}</p>
      <p class="file-card__summary">${card.summary}</p>
      <div class="file-card__chips">
        ${card.chips.map((chip) => `<span>${chip}</span>`).join("")}
      </div>
    `;
    return element;
  }

  element.innerHTML = `
    <p class="mini-card__label">${card.label}</p>
    <p class="mini-card__title">${card.title}</p>
    <div class="mini-card__meta">
      ${card.tags.map((tag) => `<span class="mini-card__tag">${tag}</span>`).join("")}
    </div>
  `;
  return element;
}

function renderBatch(nextBatchIndex = batchIndex) {
  const fragment = document.createDocumentFragment();
  cardLayer.style.width = `${CARD_GROUP_OFFSET * (CARD_BATCHES.length - 1) + CARD_TRACK_TAIL_WIDTH}px`;

  CARD_BATCHES.forEach((batch, groupIndex) => {
    const layout = LAYOUTS[(layoutIndex + groupIndex) % LAYOUTS.length];
    const groupOffset = groupIndex * CARD_GROUP_OFFSET;

    batch.slice(0, CARD_GROUP_VISIBLE_COUNT).forEach((card, index) => {
      fragment.append(createCard(card, layout[index], index + groupIndex * layout.length, groupOffset));
    });
  });

  cardLayer.replaceChildren(fragment);
  cardStage.scrollLeft = 0;
  batchIndex = nextBatchIndex;
}

function clearCardPreviewTimers() {
  cardPreviewTimers.forEach((timer) => window.clearTimeout(timer));
  cardPreviewTimers = [];
  window.clearTimeout(cardPreviewFrame);
  cardPreviewFrame = 0;
  cardStage.style.scrollBehavior = "";
}

function markCardStageUsed() {
  hasUsedCardStage = true;
  clearCardPreviewTimers();
}

function previewCardScroll() {
  if (REDUCED_MOTION || hasUsedCardStage || phone.classList.contains("is-typing")) return;
  if (!cardStage || cardStage.scrollWidth <= cardStage.clientWidth) return;

  const easeInOut = (progress) => 0.5 - Math.cos(Math.PI * progress) / 2;
  const easeOutSoft = (progress) => 1 - Math.pow(1 - progress, 3);
  const animate = (from, to, duration, easing, done) => {
    const startedAt = performance.now();
    cardStage.style.scrollBehavior = "auto";

    const tick = () => {
      if (hasUsedCardStage) return;
      const now = performance.now();
      const progress = Math.min((now - startedAt) / duration, 1);
      cardStage.scrollLeft = from + (to - from) * easing(progress);

      if (progress < 1) {
        cardPreviewFrame = window.setTimeout(tick, 16);
        return;
      }

      cardPreviewFrame = 0;
      cardStage.scrollLeft = to;
      cardStage.style.scrollBehavior = "";
      done?.();
    };

    tick();
  };

  cardPreviewTimers.push(window.setTimeout(() => {
    if (hasUsedCardStage) return;
    animate(cardStage.scrollLeft, CARD_PREVIEW_SCROLL, 920, easeInOut, () => {
      cardPreviewTimers.push(window.setTimeout(() => {
        if (hasUsedCardStage) return;
        animate(cardStage.scrollLeft, 0, 1040, easeOutSoft);
      }, 360));
    });
  }, 720));
}

function flashGeneratedPrompt(text) {
  const value = text.trim();
  if (!value) return;

  CARD_BATCHES.unshift([
    {
      type: "query",
      text: value,
    },
    {
      type: "mini",
      label: "天禧生成",
      title: "正在为你整理相关知识与行动建议",
      tags: ["上下文", "实时推荐"],
    },
    {
      type: "weather",
      date: "刚刚",
      temp: "AI",
      desc: "已接收",
      city: "输入内容",
      range: "可继续追问",
    },
    {
      type: "article",
      title: "根据你的输入，推荐 3 个可以马上继续探索的方向",
      source: "来自于：天禧",
      visual: VISUAL_VARIANTS[layoutIndex % VISUAL_VARIANTS.length],
      visualText: "NEXT",
    },
    {
      type: "query",
      text: "要不要把这条消息扩写成一份完整方案？",
    },
  ]);

  batchIndex = -1;
  renderBatch(0);
  previewCardScroll();
}

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = messageInput.value.trim();
  if (value) showResultPage(value);
});

messageInput.addEventListener("focus", () => {
  if (suppressNativeInputFocus) {
    messageInput.blur();
    return;
  }
  enterTypingMode();
});
messageInput.addEventListener("blur", exitTypingMode);
messageInput.addEventListener("input", updateComposerTextState);
messageInput.addEventListener("touchstart", (event) => {
  if (!isMobilePreview()) return;
  beginInputFocusGuard();
  event.preventDefault();
}, { passive: false });
messageInput.addEventListener("click", (event) => {
  if (!isMobilePreview() || !suppressNativeInputFocus) return;
  event.preventDefault();
});

composer.addEventListener("pointerdown", (event) => {
  if (phone.classList.contains("has-result")) return;
  if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
  const canStartVoice = isVoiceStartTarget(event.target);
  if (!canStartVoice) return;
  pressStartedOnInput = isInputPressTarget(event.target);
  shouldFocusInputOnTap = pressStartedOnInput && isMobilePreview();
  if (shouldFocusInputOnTap) {
    beginInputFocusGuard();
    event.preventDefault();
  }

  pressStartY = event.clientY;
  pressStartX = event.clientX;
  activeVoicePointerId = event.pointerId;
  captureComposerPointer(event);
  window.clearTimeout(pressTimer);
  pressTimer = window.setTimeout(startRecording, 420);
});

window.addEventListener("pointermove", (event) => {
  if (activeVoicePointerId !== event.pointerId) return;
  const movedX = Math.abs(event.clientX - pressStartX);
  const movedY = Math.abs(event.clientY - pressStartY);
  if (!isRecording && (movedX > 10 || movedY > 10)) {
    shouldFocusInputOnTap = false;
  }
  const movedUp = pressStartY - event.clientY;
  if (!isRecording && movedUp > VOICE_CANCEL_DISTANCE) {
    window.clearTimeout(pressTimer);
  }
}, { passive: true });

window.addEventListener("pointerup", (event) => {
  if (activeVoicePointerId !== null && activeVoicePointerId !== event.pointerId) return;
  window.clearTimeout(pressTimer);
  const shouldFocusInput = !isRecording && pressStartedOnInput && shouldFocusInputOnTap && !phone.classList.contains("has-result");
  finishRecording(event);
  if (shouldFocusInput) {
    window.requestAnimationFrame(() => {
      endInputFocusGuard();
      messageInput.focus({ preventScroll: true });
    });
  }
  if (!shouldFocusInput) {
    endInputFocusGuard();
  }
  pressStartedOnInput = false;
  shouldFocusInputOnTap = false;
  activeVoicePointerId = null;
  activeTouchId = null;
  releaseComposerPointer();
});

window.addEventListener("pointercancel", () => {
  if (activeTouchId !== null) return;
  if (isRecording) return;
  window.clearTimeout(pressTimer);
  pressStartedOnInput = false;
  shouldFocusInputOnTap = false;
  endInputFocusGuard();
  activeVoicePointerId = null;
  releaseComposerPointer();
});

composer.addEventListener("touchstart", (event) => {
  if (phone.classList.contains("has-result") || activeTouchId !== null) return;
  if (!isVoiceStartTarget(event.target)) return;
  const touch = event.changedTouches && event.changedTouches[0];
  if (!touch) return;
  activeTouchId = touch.identifier;
  pressStartX = touch.clientX;
  pressStartY = touch.clientY;
}, { passive: true });

window.addEventListener("touchend", (event) => {
  const touch = getTrackedTouch(event);
  if (!touch) return;
  window.clearTimeout(pressTimer);
  finishRecording(touch);
  pressStartedOnInput = false;
  shouldFocusInputOnTap = false;
  endInputFocusGuard();
  activeVoicePointerId = null;
  activeTouchId = null;
  releaseComposerPointer();
}, { passive: true });

window.addEventListener("touchcancel", (event) => {
  const touch = getTrackedTouch(event);
  if (!touch) return;
  if (isRecording) {
    window.setTimeout(() => {
      if (isRecording && activeTouchId === touch.identifier) finishRecording(touch);
    }, 360);
    return;
  }
  window.clearTimeout(pressTimer);
  pressStartedOnInput = false;
  shouldFocusInputOnTap = false;
  endInputFocusGuard();
  activeVoicePointerId = null;
  activeTouchId = null;
  releaseComposerPointer();
}, { passive: true });

window.addEventListener("blur", cancelRecording);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) cancelRecording();
});
voiceCapture.addEventListener("click", cancelRecording);

addButton.addEventListener("click", (event) => {
  const value = messageInput.value.trim();
  if (!value) return;
  event.preventDefault();
  showResultPage(value);
});

resultBack.addEventListener("click", () => {
  hideResultPage();
});

document.querySelectorAll(".quick-pill").forEach((button) => {
  button.addEventListener("click", () => {
    hideResultPage();
    const label = button.textContent.trim();
    messageInput.value = `${label}：`;
    updateComposerTextState();
    messageInput.focus();
  });
});

cardStage.addEventListener("pointerdown", markCardStageUsed, { passive: true });
cardStage.addEventListener("wheel", markCardStageUsed, { passive: true });
cardStage.addEventListener("touchstart", markCardStageUsed, { passive: true });

window.addEventListener("resize", scalePhone);
window.visualViewport?.addEventListener("resize", setKeyboardOffset);
window.visualViewport?.addEventListener("scroll", setKeyboardOffset);
scalePhone();
updateComposerTextState();
setVoiceWaveIdle();
renderBatch(0);
previewCardScroll();

if ("serviceWorker" in navigator && window.isSecureContext) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
