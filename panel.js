// Wait for the DOM to fully load before executing the script
window.addEventListener("DOMContentLoaded", () => {
  // Create a BroadcastChannel for communication with other parts of the app
  const channel = new BroadcastChannel("obs-timer");

  // Get references to the input fields and buttons in the HTML
  const minutesInput = document.getElementById("minutes");
  const messageInput = document.getElementById("message");

  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resumeBtn = document.getElementById("resumeBtn");
  const resetBtn = document.getElementById("resetBtn");

  // Function to send a message through the BroadcastChannel
  function send(action) {
    // Get the timer duration in seconds and the message to display
    const time = parseInt(minutesInput.value) || 0; // Default to 0 if input is invalid
    const message = messageInput.value;

    // Send the action, time, and message as a message
    channel.postMessage({ action, time: time * 60, message });

    // Reset the "active" class on all buttons
    [startBtn, pauseBtn, resumeBtn, resetBtn].forEach((btn) =>
      btn.classList.remove("active")
    );

    // Add the "active" class to the button corresponding to the current action
    const activeBtn = document.getElementById(`${action}Btn`);
    if (activeBtn) activeBtn.classList.add("active");
  }

  // Attach click event listeners to the buttons
  startBtn.onclick = () => send("start"); // Start the timer
  pauseBtn.onclick = () => send("pause"); // Pause the timer
  resumeBtn.onclick = () => send("resume"); // Resume the timer
  resetBtn.onclick = () => send("reset"); // Reset the timer
});
