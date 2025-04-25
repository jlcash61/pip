# 🧠 PiP Assistant – Version 1.0

**PiP (Pixie Interface Playground)** is a lightweight experimental platform designed to explore OpenAI's Assistant API v2. It serves as a minimalist, thread-aware chatbot sandbox with Firebase as its backend and a clean modular frontend.

---

## 🚀 Features

- 🎯 OpenAI Assistant ID v2 integration
- 🌍 CORS-enabled Firebase Cloud Function
- 📡 Single persistent thread across all sessions
- ✍️ Message-to-reply loop using `axios` + `fetch`
- 🔐 Secrets stored securely via `firebase functions:config:set`
- 💬 Modular vanilla HTML/JS frontend (`index.html`, `main.js`, `util.js`)

---

## 📦 Project Structure

/functions 
   └── index.js // Firebase Cloud Function (sendMessage)

/public 
   ├── index.html // Chat UI 
   ├── style.css // UI Styling 
   ├── main.js // Frontend logic 
   └── util.js // HTML escaping utility

README.md // This file 
CHANGELOG.md // Version tracking

---

## 🧪 Quickstart

1. **Clone + Install:**
   ```bash
   git clone https://github.com/your-username/pip-assistant.git
   cd pip-assistant/functions
   npm install
Set Firebase Config:


firebase functions:config:set openai.key="sk-..." openai.assistant="asst_..."
Deploy to Firebase:


firebase deploy --only functions
Use the UI: Open /public/index.html in your browser.

✏️ Version History

Version	Date	Summary
1.0	2025-04-24	Initial stable thread-only release
⚠️ Notes
This version uses a single persistent thread for all users.

Assistant has no long-term memory, no soul seed, and no PXE integration (by design).

Intended purely for experimentation and reverse-engineering OpenAI Assistant behaviors.

🛠️ Future Ideas
Multi-thread management and thread reset tools

System prompt injection at thread creation

Tool call support and introspection

Indexed message viewer or debug overlay

Voice TTS and STT expansions

💡 Built with love for clarity, curiosity, and code.
— Pixie + TiBorg