# Timer Plugin (Text-Only Display)

This is a powerful and fully customizable countdown timer plugin designed for **OBS Studio**.  
It consists of two parts:

- **Control Panel** – lets you set the time, start/pause/reset the countdown, and customize the message, style, and saved sessions.
- **Display Page** – shows a fullscreen countdown timer and message that updates in real time.

---

## 💻 How It Works

- The **Control Panel** is added to OBS as a _dock_.
- The **Display Page** is added as a _browser source_.
- Both communicate instantly through a `BroadcastChannel` — no server or internet required.

---

## 🧠 Tabs Overview

### ⏱️ Timer Settings Tab

- Enter and start custom countdowns.
- Use preset minute buttons for quick setup.
- **Select Preset Style** – apply a saved visual preset to the current display.
- Manage saved **Sessions** such as:
  - _Opening Speech_
  - _Prayer_
  - _Worship_
  - _Award Presentation_, etc.
- Each session stores its **name, duration, and end message** — ready to load or start instantly.

### 🎨 Style Tab

- Switch between **Light** and **Dark** themes (applies to panel only).
- Choose separate **font colors** for:
  - **Timer text**
  - **End message text**
- Adjust:
  - **Font family** (Sans, Serif, Monospace, Cursive)
  - **Font sizes** (Timer + Message)
  - **Container alignment** – choose from 9 screen positions  
    _(Top/Center/Bottom × Left/Center/Right)_
- Save and recall full **Style Presets** for quick visual configuration.

### 🧾 Sessions Tab

- Create and manage named timers.
- Each session includes:
  - Session name
  - Time (in minutes)
  - End message
- Options per session:
  - **Load** (fills Timer tab)
  - **Start** (immediately begins countdown)
  - **Delete**
- Sessions persist automatically between uses.

---

## 📝 Example Workflow

1. Create or load a session (e.g., “Opening Speech – 5 min”).
2. Adjust fonts, colors, and layout under the **Style** tab.
3. Save your style as a **preset** (e.g., “Bold Stage Display”).
4. Back in **Timer Settings**, choose your preset, click **Start**, and you’re ready to go!

---

## 💖 Support the Developer

If you love what I do and want to support ongoing development, you can donate here:

👉 [**Donate via PayPal**](https://www.paypal.com/ncp/payment/VUBFFTTB564AJ)

Your support helps keep this tool free and constantly improving. 🙏

---

## 🔖 Version History

### [v2.0 – Presets & Sessions Upgrade](https://github.com/Tioluwanilowo/Timer-plugin-offline/tree/v2..0)

- Added **Style Presets** (save, apply, delete)
- Added **Saved Sessions** tab for multiple timers
- Improved UI layout and panel organization
- Moved preset selection to **Timer Settings** tab
- Added 9-point **container alignment** control
- Added font size controls and persistent local storage

### [v1.2 – UI Enhancements](https://github.com/Tioluwanilowo/Timer-plugin-offline/tree/v1.2)

- Added Style tab to Control Panel
- Theme toggle (Light/Dark) for control panel
- Font color pickers for timer and end message (independent)
- Custom font family selector
- Animated message styling improvements

### [v1.1 – Display Update](https://github.com/Tioluwanilowo/Timer-plugin-offline/tree/v1.1)

- Integrated end message display
- Basic styling and layout improvements
- Setup for communication via `BroadcastChannel`

### [v1.0 – Initial Release](https://github.com/Tioluwanilowo/Timer-plugin-offline/tree/v1.0)

- Basic countdown timer
- End message display logic
- Core HTML/CSS structure for control and display

---

## 🙌 Credits

Made with ❤️ by [**Tioluwani Lowo**](https://tioluwanilowo.com)  
Designed to be **fast, flexible, and offline-friendly**.
