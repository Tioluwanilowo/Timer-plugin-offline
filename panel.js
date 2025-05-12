window.addEventListener("DOMContentLoaded", () => {
  const channel = new BroadcastChannel("obs-timer");

  const minutesInput = document.getElementById("minutes");
  const messageInput = document.getElementById("message");

  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resumeBtn = document.getElementById("resumeBtn");
  const resetBtn = document.getElementById("resetBtn");

  // === TIMER CONTROLS ===
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

  // === TAB SWITCHING ===
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

  // === PRESET BUTTONS ===
  document.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const presetMinutes = parseInt(btn.getAttribute("data-min"));
      minutesInput.value = presetMinutes;
    });
  });

  // === STYLE SETTINGS ===
  const themeSelect = document.getElementById("theme");
  const fontColorTimer = document.getElementById("fontColorTimer");
  const fontColorMessage = document.getElementById("fontColorMessage");
  const fontFamilySelect = document.getElementById("fontFamily");

  function applyPanelTheme(theme) {
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add(`theme-${theme}`);
  }

  function sendStyleToDisplay() {
    const theme = themeSelect.value;
    const colorTimer = fontColorTimer.value;
    const colorMessage = fontColorMessage.value;
    const fontFamily = fontFamilySelect.value;

    // Save values
    localStorage.setItem("theme", theme);
    localStorage.setItem("fontColorTimer", colorTimer);
    localStorage.setItem("fontColorMessage", colorMessage);
    localStorage.setItem("fontFamily", fontFamily);

    // Apply theme to panel only
    applyPanelTheme(theme);

    // Send style data to display only
    channel.postMessage({
      action: "style",
      fontColorTimer: colorTimer,
      fontColorMessage: colorMessage,
      fontFamily: fontFamily,
    });
  }

  // === Apply saved settings on load ===
  const savedTheme = localStorage.getItem("theme") || "dark";
  const savedColorTimer = localStorage.getItem("fontColorTimer") || "#ffffff";
  const savedColorMessage =
    localStorage.getItem("fontColorMessage") || "#ff0000";
  const savedFontFamily = localStorage.getItem("fontFamily") || "sans-serif";

  themeSelect.value = savedTheme;
  fontColorTimer.value = savedColorTimer;
  fontColorMessage.value = savedColorMessage;
  fontFamilySelect.value = savedFontFamily;

  applyPanelTheme(savedTheme);
  sendStyleToDisplay();

  // === Watch for changes ===
  themeSelect.onchange = sendStyleToDisplay;
  fontColorTimer.onchange = sendStyleToDisplay;
  fontColorMessage.onchange = sendStyleToDisplay;
  fontFamilySelect.onchange = sendStyleToDisplay;
});
