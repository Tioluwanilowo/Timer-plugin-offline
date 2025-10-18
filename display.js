const channel = new BroadcastChannel("obs-timer");

const timeText = document.getElementById("time");
const message = document.getElementById("message");
const container = document.getElementById("displayContainer"); // <-- container for 9-pos
const stack = document.getElementById("stack");

let timer,
  remaining = 0,
  total = 0,
  paused = false;

// helper: set container position class
const POS_CLASSES = [
  "pos-top-left",
  "pos-top-center",
  "pos-top-right",
  "pos-center-left",
  "pos-center-center",
  "pos-center-right",
  "pos-bottom-left",
  "pos-bottom-center",
  "pos-bottom-right",
];

function setContainerPosition(posKey = "center-center") {
  // posKey like "top-left", "center-right", etc.
  const className = "pos-" + posKey;
  POS_CLASSES.forEach((c) => container.classList.remove(c));
  container.classList.add(className);
}

// Apply styles sent from the panel
function applyDisplayStyle(data) {
  if (data.fontColorTimer) timeText.style.color = data.fontColorTimer;
  if (data.fontColorMessage) message.style.color = data.fontColorMessage;
  if (data.fontFamily) {
    timeText.style.fontFamily = data.fontFamily;
    message.style.fontFamily = data.fontFamily;
  }
  if (data.fontSizeTimer) timeText.style.fontSize = `${data.fontSizeTimer}px`;
  if (data.fontSizeMessage)
    message.style.fontSize = `${data.fontSizeMessage}px`;
  if (data.containerPos) setContainerPosition(data.containerPos);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function startCountdown(time, finalMessage, resume = false) {
  clearInterval(timer);

  if (!resume) {
    total = remaining = time;
    message.style.display = "none";
  }

  timer = setInterval(() => {
    if (remaining <= 0) {
      clearInterval(timer);
      timeText.textContent = "00:00";

      // show the end message; it's already the top element in the stack
      message.textContent = finalMessage;
      message.style.display = "block";
      return;
    }

    timeText.textContent = formatTime(remaining);
    remaining--;
  }, 1000);
}

channel.onmessage = (event) => {
  const data = event.data;

  if (data.action === "style") {
    applyDisplayStyle(data);
    // Persist so reload keeps style
    if (data.fontColorTimer)
      localStorage.setItem("fontColorTimer", data.fontColorTimer);
    if (data.fontColorMessage)
      localStorage.setItem("fontColorMessage", data.fontColorMessage);
    if (data.fontFamily) localStorage.setItem("fontFamily", data.fontFamily);
    if (data.fontSizeTimer)
      localStorage.setItem("fontSizeTimer", data.fontSizeTimer);
    if (data.fontSizeMessage)
      localStorage.setItem("fontSizeMessage", data.fontSizeMessage);
    if (data.containerPos)
      localStorage.setItem("containerPos", data.containerPos);
    return;
  }

  const { action, time, message: msg } = data;
  switch (action) {
    case "start":
      paused = false;
      startCountdown(time, msg);
      break;
    case "pause":
      paused = true;
      clearInterval(timer);
      break;
    case "resume":
      if (paused) startCountdown(remaining, msg, true);
      break;
    case "reset":
      clearInterval(timer);
      remaining = 0;
      timeText.textContent = "00:00";
      message.textContent = "";
      message.style.display = "none";
      paused = false;
      break;
  }
};

// Apply saved styles on load (panel not required)
applyDisplayStyle({
  fontColorTimer: localStorage.getItem("fontColorTimer"),
  fontColorMessage: localStorage.getItem("fontColorMessage"),
  fontFamily: localStorage.getItem("fontFamily"),
  fontSizeTimer: localStorage.getItem("fontSizeTimer")
    ? parseInt(localStorage.getItem("fontSizeTimer"))
    : undefined,
  fontSizeMessage: localStorage.getItem("fontSizeMessage")
    ? parseInt(localStorage.getItem("fontSizeMessage"))
    : undefined,
  containerPos: localStorage.getItem("containerPos") || "center-center",
});
