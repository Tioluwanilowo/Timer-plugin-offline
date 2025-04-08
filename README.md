# OBS Timer Plugin (Text-Only Display)

This is a simple, bold countdown timer plugin designed for **OBS Studio**. It consists of two parts:

- **Control Panel** – lets you set the time, start/pause/reset the countdown, and customize the message.
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

## 📝 Example Workflow

1. Enter countdown time (in minutes)
2. Enter your custom message (e.g., `Your time is up. Please leave the stage.`)
3. Click **Start**
4. When time is up, the message will flash in bold red text

---

## 🙌 Credits

Made with ❤️ by [Tioluwani Lowo](https://tioluwanilowo.com/)

Designed to be fast, flexible, and offline-friendly.
