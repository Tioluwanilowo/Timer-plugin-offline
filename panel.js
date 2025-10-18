window.addEventListener("DOMContentLoaded", () => {
  const channel = new BroadcastChannel("obs-timer");

  // --- Timer controls ---
  const minutesInput = document.getElementById("minutes");
  const messageInput = document.getElementById("message");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resumeBtn = document.getElementById("resumeBtn");
  const resetBtn = document.getElementById("resetBtn");

  function send(action) {
    const time = parseInt(minutesInput.value) || 0;
    const message = messageInput.value;
    channel.postMessage({ action, time: time * 60, message });

    [startBtn, pauseBtn, resumeBtn, resetBtn].forEach((btn) =>
      btn.classList.remove("active")
    );
    const activeBtn = document.getElementById(`${action}Btn`);
    if (activeBtn) activeBtn.classList.add("active");
  }

  startBtn.onclick = () => send("start");
  pauseBtn.onclick = () => send("pause");
  resumeBtn.onclick = () => send("resume");
  resetBtn.onclick = () => send("reset");

  // --- Tabs ---
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((tab) => tab.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  // --- Presets (minutes shortcuts, if present) ---
  document.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const presetMinutes = parseInt(btn.getAttribute("data-min"));
      minutesInput.value = presetMinutes;
    });
  });

  // --- Style controls (panel->display) ---
  const themeSelect = document.getElementById("theme"); // panel only
  const fontColorTimer = document.getElementById("fontColorTimer"); // display
  const fontColorMessage = document.getElementById("fontColorMessage"); // display
  const fontFamilySelect = document.getElementById("fontFamily"); // display
  const fontSizeTimer = document.getElementById("fontSizeTimer"); // display
  const fontSizeMessage = document.getElementById("fontSizeMessage"); // display
  const containerPosSelect = document.getElementById("containerPos"); // display (9-point)

  // --- Preset UI (Style Presets) ---
  const presetNameInput = document.getElementById("presetName");
  const presetSelect = document.getElementById("presetSelect");
  const savePresetBtn = document.getElementById("savePresetBtn");
  const deletePresetBtn = document.getElementById("deletePresetBtn");
  const applyPresetBtn = document.getElementById("applyPresetBtn");

  // Apply theme to PANEL only
  function applyPanelTheme(theme) {
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add(`theme-${theme}`);
  }

  // Load saved values
  const savedTheme = localStorage.getItem("theme") || "dark";
  const savedColorTimer = localStorage.getItem("fontColorTimer") || "#ffffff";
  const savedColorMessage =
    localStorage.getItem("fontColorMessage") || "#ff0000";
  const savedFontFamily = localStorage.getItem("fontFamily") || "sans-serif";
  const savedFontSizeTimer = localStorage.getItem("fontSizeTimer") || "180";
  const savedFontSizeMessage = localStorage.getItem("fontSizeMessage") || "100";
  const savedContainerPos =
    localStorage.getItem("containerPos") || "center-center";

  // Hydrate controls
  themeSelect.value = savedTheme;
  fontColorTimer.value = savedColorTimer;
  fontColorMessage.value = savedColorMessage;
  fontFamilySelect.value = savedFontFamily;
  fontSizeTimer.value = savedFontSizeTimer;
  fontSizeMessage.value = savedFontSizeMessage;
  containerPosSelect.value = savedContainerPos;

  // Apply theme to panel only
  applyPanelTheme(savedTheme);

  // Broadcast current style to display + persist
  function sendStyleToDisplay() {
    const theme = themeSelect.value; // saved, but only applied on panel
    const colorTimer = fontColorTimer.value;
    const colorMessage = fontColorMessage.value;
    const fontFamily = fontFamilySelect.value;
    const sizeTimer = parseInt(fontSizeTimer.value) || 180;
    const sizeMessage = parseInt(fontSizeMessage.value) || 100;
    const containerPos = containerPosSelect.value || "center-center";

    // Persist
    localStorage.setItem("theme", theme);
    localStorage.setItem("fontColorTimer", colorTimer);
    localStorage.setItem("fontColorMessage", colorMessage);
    localStorage.setItem("fontFamily", fontFamily);
    localStorage.setItem("fontSizeTimer", String(sizeTimer));
    localStorage.setItem("fontSizeMessage", String(sizeMessage));
    localStorage.setItem("containerPos", containerPos);

    // Apply panel theme
    applyPanelTheme(theme);

    // Send to display
    channel.postMessage({
      action: "style",
      fontColorTimer: colorTimer,
      fontColorMessage: colorMessage,
      fontFamily,
      fontSizeTimer: sizeTimer,
      fontSizeMessage: sizeMessage,
      containerPos,
    });
  }

  // Listen for style changes
  themeSelect.onchange = sendStyleToDisplay;
  fontColorTimer.onchange = sendStyleToDisplay;
  fontColorMessage.onchange = sendStyleToDisplay;
  fontFamilySelect.onchange = sendStyleToDisplay;
  fontSizeTimer.oninput = sendStyleToDisplay;
  fontSizeMessage.oninput = sendStyleToDisplay;
  containerPosSelect.onchange = sendStyleToDisplay;

  // --- STYLE PRESETS (save/apply/delete) ---
  function readPresets() {
    try {
      return JSON.parse(localStorage.getItem("stylePresets") || "{}");
    } catch {
      return {};
    }
  }
  function writePresets(presets) {
    localStorage.setItem("stylePresets", JSON.stringify(presets));
  }
  function refreshPresetSelect() {
    const presets = readPresets();
    const names = Object.keys(presets).sort((a, b) => a.localeCompare(b));
    const opts = ['<option value="">-- No Preset Saved --</option>'].concat(
      names.map((n) => `<option value="${n}">${n}</option>`)
    );
    if (presetSelect) presetSelect.innerHTML = opts.join("");
  }
  function currentStylePayload() {
    return {
      fontColorTimer: fontColorTimer.value,
      fontColorMessage: fontColorMessage.value,
      fontFamily: fontFamilySelect.value,
      fontSizeTimer: parseInt(fontSizeTimer.value) || 180,
      fontSizeMessage: parseInt(fontSizeMessage.value) || 100,
      containerPos: containerPosSelect.value || "center-center",
    };
  }

  savePresetBtn?.addEventListener("click", () => {
    const name = (presetNameInput.value || "").trim();
    if (!name) {
      alert("Enter a preset name.");
      return;
    }
    const presets = readPresets();
    presets[name] = currentStylePayload();
    writePresets(presets);
    refreshPresetSelect();
    if (presetSelect) presetSelect.value = name;
  });

  applyPresetBtn?.addEventListener("click", () => {
    const name = presetSelect?.value;
    if (!name) return;
    const p = readPresets()[name];
    if (!p) return;
    // hydrate controls
    if (p.fontColorTimer) fontColorTimer.value = p.fontColorTimer;
    if (p.fontColorMessage) fontColorMessage.value = p.fontColorMessage;
    if (p.fontFamily) fontFamilySelect.value = p.fontFamily;
    if (p.fontSizeTimer) fontSizeTimer.value = p.fontSizeTimer;
    if (p.fontSizeMessage) fontSizeMessage.value = p.fontSizeMessage;
    if (p.containerPos) containerPosSelect.value = p.containerPos;
    sendStyleToDisplay();
  });

  deletePresetBtn?.addEventListener("click", () => {
    const name = presetSelect?.value;
    if (!name) return;
    const presets = readPresets();
    if (!(name in presets)) return;
    delete presets[name];
    writePresets(presets);
    refreshPresetSelect();
    if (presetSelect) presetSelect.value = "";
  });

  // Init presets dropdown
  refreshPresetSelect();

  // --- SESSIONS (Saved named timers) ---
  const sessionName = document.getElementById("sessionName");
  const sessionMinutes = document.getElementById("sessionMinutes");
  const sessionMessage = document.getElementById("sessionMessage");
  const saveSessionBtn = document.getElementById("saveSessionBtn");
  const clearSessionFormBtn = document.getElementById("clearSessionFormBtn");
  const sessionList = document.getElementById("sessionList");

  function readSessions() {
    try {
      return JSON.parse(localStorage.getItem("timerSessions") || "[]");
    } catch {
      return [];
    }
  }
  function writeSessions(list) {
    localStorage.setItem("timerSessions", JSON.stringify(list));
  }

  function clearSessionForm() {
    sessionName.value = "";
    sessionMinutes.value = "";
    sessionMessage.value = "";
    sessionName.dataset.editing = ""; // not editing
  }

  function renderSessions() {
    const list = readSessions();
    if (!sessionList) return;

    if (list.length === 0) {
      sessionList.innerHTML = `<div class="session-meta">No sessions saved yet.</div>`;
      return;
    }

    sessionList.innerHTML = list
      .map(
        (s, i) => `
      <div class="session-item" data-idx="${i}">
        <div class="session-info">
          <div class="session-title">${s.name}</div>
          <div class="session-meta">${s.minutes} min • “${(
          s.message || ""
        ).replace(/"/g, "&quot;")}”</div>
        </div>
        <div class="session-actions">
          <button class="small-btn" data-act="load"  data-idx="${i}">Load</button>
          <button class="small-btn" data-act="start" data-idx="${i}">Start</button>
          <button class="small-btn danger-btn" data-act="delete" data-idx="${i}">Delete</button>
        </div>
      </div>
    `
      )
      .join("");
  }

  // Save or update a session
  saveSessionBtn?.addEventListener("click", () => {
    const name = (sessionName.value || "").trim();
    const minutes = parseInt(sessionMinutes.value) || 0;
    const msg = (sessionMessage.value || "").trim();

    if (!name) {
      alert("Enter a session name.");
      return;
    }
    if (minutes <= 0) {
      alert("Enter minutes (> 0).");
      return;
    }

    const list = readSessions();
    const editingIdx = sessionName.dataset.editing
      ? parseInt(sessionName.dataset.editing)
      : -1;

    const payload = { name, minutes, message: msg };

    if (editingIdx >= 0 && list[editingIdx]) {
      list[editingIdx] = payload; // update
    } else {
      list.push(payload); // add
    }
    writeSessions(list);
    renderSessions();
    clearSessionForm();
  });

  clearSessionFormBtn?.addEventListener("click", clearSessionForm);

  // Handle list actions (Load / Start / Delete)
  sessionList?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;

    const idx = parseInt(btn.dataset.idx);
    const list = readSessions();
    const item = list[idx];
    if (!item) return;

    const act = btn.dataset.act;
    switch (act) {
      case "load":
        // Fill the timer tab inputs (do not start)
        minutesInput.value = item.minutes;
        messageInput.value = item.message || "";
        // also switch to the timer tab for convenience
        document.querySelector('.tab-btn[data-tab="timerTab"]').click();
        break;

      case "start":
        // Start immediately with this session
        channel.postMessage({
          action: "start",
          time: item.minutes * 60,
          message: item.message || "",
        });
        // switch highlight
        [startBtn, pauseBtn, resumeBtn, resetBtn].forEach((b) =>
          b.classList.remove("active")
        );
        startBtn.classList.add("active");
        break;

      case "delete":
        list.splice(idx, 1);
        writeSessions(list);
        renderSessions();
        break;
    }
  });

  // Initial render + initial style broadcast
  renderSessions();
  sendStyleToDisplay();
});
