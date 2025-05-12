# Timer Plugin (Text-Only Display)

This is a simple, bold countdown timer plugin designed for **OBS Studio**. It consists of two parts:

- **Control Panel** – lets you set the time, start/pause/reset the countdown, and customize the message and styling.
- **Display Page** – shows a large, fullscreen countdown timer and a blinking message once time is up.

---

## 💻 How It Works

- The **Control Panel** is added to OBS as a _dock_.
- The **Display Page** is added as a _browser source_.
- They communicate through a `BroadcastChannel` — no server or internet needed.

---

## 🧠 Usage

### 1. **In OBS: Add Custom Browser Dock**

- Go to `View → Docks → Custom Browser Dock`
- Name it something like **Timer Control**
- Load your local `panel.html` file using the `file:///` path (e.g., `file:///C:/Users/You/Downloads/obs-timer/panel.html`)

### 2. **Add Display as Browser Source**

- Add a **Browser Source** to your scene
- Point it to your local `display.html` (e.g., `file:///C:/Users/You/Downloads/obs-timer/display.html`)
- Set size to `1920 x 1080`

---

## 🎨 Style Customization

From the **Style** tab in the Control Panel, you can:

- Switch between **Light** and **Dark** themes (panel only)
- Choose separate **font colors** for the **timer** and **end message** using color pickers
- Select custom **font styles** (Sans, Serif, Monospace, Cursive)
- All style changes affect the **display**, except theme which only affects the panel

---

## 📝 Example Workflow

1. Enter countdown time (in minutes)
2. Enter your custom message (e.g., `Your time is up. Please leave the stage.`)
3. Click **Start**
4. When time is up, the message will flash in bold text, and the timer will move down

---

---

## 🔖 Version History

### [v1.2 – UI Enhancements](https://github.com/Tioluwanilowo/Timer-plugin-offline/tree/v1.2)

- Added **Style** tab to Control Panel
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

Made with ❤️ by [Tioluwani Lowo](https://tioluwanilowo.com/)

Designed to be fast, flexible, and offline-friendly.
