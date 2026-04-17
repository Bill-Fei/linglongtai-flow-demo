const RESTAURANTS = [
  {
    id: "jiangnan",
    name: "江南小馆",
    price: "¥98/人",
    meta: "淮扬菜 · 距五道口约 12 分钟 · ★4.6 · 口味清淡，环境安静",
  },
  {
    id: "jinyuan",
    name: "金谷园饺子馆·五道口店",
    price: "¥98/人",
    meta: "饺子/家常菜 · 距五道口约 5 分钟 · ★4.5 · 适合聊天",
  },
  {
    id: "qinghe",
    name: "清和小馆",
    price: "¥102/人",
    meta: "粤式简餐 · 距五道口约 10 分钟 · ★4.6 · 口味偏清淡",
  },
];

const STATES = [
  {
    id: "proactive",
    index: 1,
    type: "主动提示",
    title: "顶部通知卡片",
    desc: "通知卡片从顶部弹出，用户点击确定后进入伴随态。",
    copy: "从顶部弹出服务卡片，轻提醒而不打断。",
  },
  {
    id: "select",
    index: 2,
    type: "伴随态",
    title: "选择餐厅",
    desc: "伴随态出现彩色光圈、底部模糊和彩色氛围，卡片切到餐厅候选列表。",
    copy: "底部入口和点击说话提示出现，用户先选候选餐厅。",
  },
  {
    id: "info",
    index: 3,
    type: "伴随态",
    title: "信息查询",
    desc: "卡片更新成门店信息确认页，伴随态氛围继续保留。",
    copy: "用户做二次确认后，任务进入执行中。",
  },
  {
    id: "running",
    index: 4,
    type: "伴随态",
    title: "任务执行中",
    desc: "卡片缩成顶部执行 toast，任务继续进行，用户可点空白退出伴随态。",
    copy: "顶部保留执行状态，屏幕仍有彩色光圈和底部氛围。",
  },
  {
    id: "chip",
    index: 5,
    type: "后台执行",
    title: "缩回中岛",
    desc: "用户点击空白处后退出伴随态，任务缩回中岛继续执行。",
    copy: "退出伴随态但不断任务，2 秒后自动回推结果。",
    autoAdvanceMs: 2000,
  },
  {
    id: "result",
    index: 6,
    type: "结果回推",
    title: "执行结束",
    desc: "任务完成后结果卡自动弹出，点击“我知道了”即可消失。",
    copy: "最终结果从顶部回推成完成态卡片。",
    autoHideMs: 4000,
  },
];

const PANEL_ANIMATION_CLASSES = [
  "panel-enter--drop",
  "panel-enter--card",
  "panel-enter--toast",
  "panel-enter--chip",
  "panel-enter--result",
  "panel-exit--result",
  "ambient-enter",
];

const RESULT_EXIT_MS = 360;

const elements = {
  phoneFrame: document.getElementById("phoneFrame"),
  stateGrid: document.getElementById("stateGrid"),
  restaurantList: document.getElementById("restaurantList"),
  serviceCard: document.getElementById("serviceCard"),
  selectionCard: document.getElementById("selectionCard"),
  infoCard: document.getElementById("infoCard"),
  runningToast: document.getElementById("runningToast"),
  resultCard: document.getElementById("resultCard"),
  companionBottomEffect: document.getElementById("companionBottomEffect"),
  glowShell: document.getElementById("glowShell"),
  companionDock: document.getElementById("companionDock"),
  tapHint: document.getElementById("tapHint"),
  chipRunner: document.getElementById("chipRunner"),
  blankZoneBtn: document.getElementById("blankZoneBtn"),
  startFlowBtn: document.getElementById("startFlowBtn"),
  ignoreStartBtn: document.getElementById("ignoreStartBtn"),
  selectConfirmBtn: document.getElementById("selectConfirmBtn"),
  ignoreSelectBtn: document.getElementById("ignoreSelectBtn"),
  confirmInfoBtn: document.getElementById("confirmInfoBtn"),
  ignoreInfoBtn: document.getElementById("ignoreInfoBtn"),
  finishBtn: document.getElementById("finishBtn"),
  restartBtn: document.getElementById("restartBtn"),
  infoQuote: document.getElementById("infoQuote"),
  resultPrimary: document.getElementById("resultPrimary"),
};

const state = {
  current: "proactive",
  selectedRestaurantId: "jiangnan",
  autoTimer: null,
  companionBurstTimer: null,
  companionVisibilityTimer: null,
  resultDismissTimer: null,
};

function getCurrentState() {
  return STATES.find((item) => item.id === state.current);
}

function getRestaurantById(id) {
  return RESTAURANTS.find((item) => item.id === id) || RESTAURANTS[0];
}

function clearAutoTimer() {
  if (state.autoTimer) {
    window.clearTimeout(state.autoTimer);
    state.autoTimer = null;
  }
}

function clearCompanionBurstTimer() {
  if (state.companionBurstTimer) {
    window.clearTimeout(state.companionBurstTimer);
    state.companionBurstTimer = null;
  }
}

function clearCompanionVisibilityTimer() {
  if (state.companionVisibilityTimer) {
    window.clearTimeout(state.companionVisibilityTimer);
    state.companionVisibilityTimer = null;
  }
}

function clearResultDismissTimer() {
  if (state.resultDismissTimer) {
    window.clearTimeout(state.resultDismissTimer);
    state.resultDismissTimer = null;
  }
}

function resetAnimationClasses(element) {
  element.classList.remove(...PANEL_ANIMATION_CLASSES);
}

function hideElement(element) {
  resetAnimationClasses(element);
  element.hidden = true;
}

function showElement(element, animationClass) {
  element.hidden = false;
  resetAnimationClasses(element);
  void element.offsetWidth;
  if (animationClass) {
    element.classList.add(animationClass);
  }
}

function hideAllPanels() {
  hideElement(elements.serviceCard);
  hideElement(elements.selectionCard);
  hideElement(elements.infoCard);
  hideElement(elements.runningToast);
  hideElement(elements.resultCard);
  hideElement(elements.chipRunner);
}

function updateDynamicCopy() {
  const selected = getRestaurantById(state.selectedRestaurantId);
  elements.infoQuote.textContent = `“营业时间 10:00-22:00，已为您查到 ${selected.name} 的预约电话 xxx，是否需要为您电话预约？”`;
  elements.resultPrimary.textContent = `✓预订餐厅：${selected.name}，时间：周六 18:30`;
}

function dismissResultCard() {
  clearAutoTimer();
  clearResultDismissTimer();

  if (elements.resultCard.hidden) {
    return;
  }

  resetAnimationClasses(elements.resultCard);
  void elements.resultCard.offsetWidth;
  elements.resultCard.classList.add("panel-exit--result");
  state.resultDismissTimer = window.setTimeout(() => {
    hideElement(elements.resultCard);
    state.resultDismissTimer = null;
  }, RESULT_EXIT_MS);
}

function showCompanionLayer(element) {
  clearCompanionVisibilityTimer();
  element.hidden = false;
  void element.offsetWidth;
  element.classList.add("is-visible");
}

function hideCompanionLayer(element) {
  element.classList.remove("is-visible");
}

function triggerCompanionBurst() {
  clearCompanionBurstTimer();
  elements.glowShell.classList.remove("is-bursting");
  elements.companionBottomEffect.classList.remove("is-bursting");
  void elements.glowShell.offsetWidth;
  elements.glowShell.classList.add("is-bursting");
  elements.companionBottomEffect.classList.add("is-bursting");
  state.companionBurstTimer = window.setTimeout(() => {
    elements.glowShell.classList.remove("is-bursting");
    elements.companionBottomEffect.classList.remove("is-bursting");
    state.companionBurstTimer = null;
  }, 700);
}

function renderRestaurantList() {
  elements.restaurantList.replaceChildren();

  RESTAURANTS.forEach((restaurant) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "restaurant-item";
    if (restaurant.id === state.selectedRestaurantId) {
      button.classList.add("is-selected");
    }

    button.innerHTML = `
      <div class="restaurant-item__body">
        <p class="restaurant-item__title">${restaurant.name} <span class="restaurant-item__price">${restaurant.price}</span></p>
        <p class="restaurant-item__meta">${restaurant.meta}</p>
      </div>
      <span class="radio-mark" aria-hidden="true"></span>
    `;

    button.addEventListener("click", () => {
      state.selectedRestaurantId = restaurant.id;
      renderRestaurantList();
      updateDynamicCopy();
    });

    elements.restaurantList.append(button);
  });
}

function renderStateGrid() {
  elements.stateGrid.replaceChildren();
  const currentState = getCurrentState();

  STATES.forEach((step) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "state-tile";

    if (step.id === currentState.id) {
      button.classList.add("is-active");
    } else if (step.index < currentState.index) {
      button.classList.add("is-past");
    }

    button.innerHTML = `
      <div class="state-tile__meta">
        <span class="state-tile__index">0${step.index}</span>
        <span class="state-tile__type">${step.type}</span>
      </div>
      <h3 class="state-tile__title">${step.title}</h3>
      <p class="state-tile__copy">${step.copy}</p>
    `;

    button.addEventListener("click", () => setState(step.id));
    elements.stateGrid.append(button);
  });
}

function syncHeader(step) {
  void step;
}

function syncCompanion(isVisible) {
  if (isVisible) {
    elements.phoneFrame.dataset.companion = "true";
    showCompanionLayer(elements.companionBottomEffect);
    showCompanionLayer(elements.glowShell);
    showCompanionLayer(elements.companionDock);
    showCompanionLayer(elements.tapHint);
    triggerCompanionBurst();
  } else {
    elements.phoneFrame.dataset.companion = "leaving";
    clearCompanionBurstTimer();
    clearCompanionVisibilityTimer();
    elements.glowShell.classList.remove("is-bursting");
    elements.companionBottomEffect.classList.remove("is-bursting");
    hideCompanionLayer(elements.companionBottomEffect);
    hideCompanionLayer(elements.glowShell);
    hideCompanionLayer(elements.companionDock);
    hideCompanionLayer(elements.tapHint);
    state.companionVisibilityTimer = window.setTimeout(() => {
      elements.phoneFrame.dataset.companion = "false";
      elements.companionBottomEffect.hidden = true;
      elements.glowShell.hidden = true;
      elements.companionDock.hidden = true;
      elements.tapHint.hidden = true;
      state.companionVisibilityTimer = null;
    }, 320);
  }
}

function syncPanels(step) {
  const isCompanion = ["select", "info", "running"].includes(step.id);

  hideAllPanels();
  syncCompanion(isCompanion);
  elements.blankZoneBtn.hidden = step.id !== "running";

  if (step.id === "proactive") {
    showElement(elements.serviceCard, "panel-enter--drop");
  }

  if (step.id === "select") {
    showElement(elements.selectionCard, "panel-enter--card");
  }

  if (step.id === "info") {
    showElement(elements.infoCard, "panel-enter--card");
  }

  if (step.id === "running") {
    showElement(elements.runningToast, "panel-enter--toast");
  }

  if (step.id === "chip") {
    showElement(elements.chipRunner, "panel-enter--chip");
  }

  if (step.id === "result") {
    showElement(elements.resultCard, "panel-enter--result");
  }
}

function setState(nextId) {
  const nextState = STATES.find((item) => item.id === nextId);
  if (!nextState) return;

  clearAutoTimer();
  clearResultDismissTimer();
  state.current = nextState.id;
  elements.phoneFrame.dataset.state = nextState.id;

  updateDynamicCopy();
  syncHeader(nextState);
  syncPanels(nextState);
  renderStateGrid();

  if (nextState.autoAdvanceMs) {
    state.autoTimer = window.setTimeout(() => {
      setState("result");
    }, nextState.autoAdvanceMs);
  }

  if (nextState.autoHideMs) {
    state.autoTimer = window.setTimeout(() => {
      dismissResultCard();
    }, nextState.autoHideMs);
  }
}

function resetFlow() {
  clearAutoTimer();
  state.selectedRestaurantId = "jiangnan";
  renderRestaurantList();
  setState("proactive");
}

function bindEvents() {
  elements.startFlowBtn.addEventListener("click", () => setState("select"));
  elements.ignoreStartBtn.addEventListener("click", resetFlow);
  elements.selectConfirmBtn.addEventListener("click", () => setState("info"));
  elements.ignoreSelectBtn.addEventListener("click", resetFlow);
  elements.confirmInfoBtn.addEventListener("click", () => setState("running"));
  elements.ignoreInfoBtn.addEventListener("click", resetFlow);
  elements.blankZoneBtn.addEventListener("click", () => setState("chip"));
  elements.finishBtn.addEventListener("click", dismissResultCard);
  elements.restartBtn.addEventListener("click", resetFlow);
}

function init() {
  renderRestaurantList();
  bindEvents();
  updateDynamicCopy();
  setState("proactive");
}

init();
