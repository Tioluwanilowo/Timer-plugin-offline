// Creates a BroadcastChannel for communication between different browser contexts
const channel = new BroadcastChannel("obs-timer");

// References to the DOM elements for displaying the timer and messages
const timeText = document.getElementById("time");
const message = document.getElementById("message");

// Variables to manage the timer state
let timer, // Holds the interval ID for the countdown
  remaining = 0, // Remaining time in seconds
  total = 0, // Total countdown time in seconds
  paused = false; // Tracks whether the timer is paused

/**
 * Formats a given time in seconds into MM:SS format.
 * @param {number} seconds - The time in seconds to format.
 * @returns {string} - The formatted time string.
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60); // Calculate minutes
  const secs = seconds % 60; // Calculate remaining seconds
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Starts or resumes the countdown timer.
 * @param {number} time - The total time for the countdown in seconds.
 * @param {string} finalMessage - The message to display when the timer ends.
 * @param {boolean} [resume=false] - Whether to resume from the remaining time.
 */
function startCountdown(time, finalMessage, resume = false) {
  // Clear any existing timer
  clearInterval(timer);

  if (!resume) {
    // Initialize total and remaining time if not resuming
    total = remaining = time;
    message.style.display = "none"; // Hide the end message
  }

  // Start the countdown interval
  timer = setInterval(() => {
    if (remaining <= 0) {
      // Stop the timer when it reaches zero
      clearInterval(timer);
      timeText.textContent = "00:00"; // Display 00:00
      message.textContent = finalMessage; // Show the final message
      message.style.display = "block"; // Make the message visible
      return;
    }

    // Update the timer display and decrement the remaining time
    timeText.textContent = formatTime(remaining);
    remaining--;
  }, 1000); // Update every second
}

// Handles incoming messages from the BroadcastChannel
channel.onmessage = (event) => {
  const { action, time, message: msg } = event.data; // Destructure the event data

  switch (action) {
    case "start":
      // Start the timer with the specified time and message
      paused = false;
      startCountdown(time, msg);
      break;

    case "pause":
      // Pause the timer by clearing the interval
      paused = true;
      clearInterval(timer);
      break;

    case "resume":
      // Resume the timer if it was paused
      if (paused) startCountdown(remaining, msg, true);
      break;

    case "reset":
      // Reset the timer to its initial state
      clearInterval(timer);
      remaining = 0;
      timeText.textContent = "00:00"; // Reset the timer display
      message.style.display = "none"; // Hide the end message
      paused = false;
      break;
  }
};
