const channel = new BroadcastChannel("obs-timer");

const timeText = document.getElementById("time");
const message = document.getElementById("message");
const container = document.querySelector(".display-container");

let timer,
  remaining = 0,
  total = 0,
  paused = false;

// Apply style changes from panel
function applyDisplayStyle(data) {
  if (data.fontColorTimer) {
    timeText.style.color = data.fontColorTimer;
  }
  if (data.fontColorMessage) {
    message.style.color = data.fontColorMessage;
  }
  if (data.fontFamily) {
    timeText.style.fontFamily = data.fontFamily;
    message.style.fontFamily = data.fontFamily;
  }
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
    message.style.opacity = 0;
    container.classList.remove("rearranged");
  }

  timer = setInterval(() => {
    if (remaining <= 0) {
      clearInterval(timer);
      timeText.textContent = "00:00";
      message.textContent = finalMessage;
      message.style.display = "block";
      message.style.opacity = 1;
      container.classList.add("rearranged");
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
      message.style.opacity = 0;
      container.classList.remove("rearranged");
      paused = false;
      break;
  }
};
