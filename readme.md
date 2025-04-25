# 🧠 PiP Assistant – Version 1.0

**PiP (Pixie Interface Playground)** is a lightweight experimental platform designed to explore OpenAI's Assistant API v2. It serves as a minimalist, thread-aware chatbot sandbox with Firebase as its backend and a vanilla JS frontend.

---

## 🚀 Features

- 🎯 **OpenAI Assistant ID v2** integration
- 🌍 **CORS-enabled Cloud Function**
- 📡 Persistent shared thread per session
- ✍️ Message-to-reply loop using `axios` + `fetch`
- 🔐 Secrets stored securely via `firebase functions:config:set`
- 💬 Simple scrolling chat UI in vanilla HTML/JS

---

## 📦 Project Structure

/functions └── index.js → Firebase Cloud Function (sendMessage) └── package.json → Includes axios, Firebase deps

/public └── index.html → PIP chat UI └── style.css (opt) → Can be added for visual refinement

README.md → This file

yaml
Copy
Edit

---

## 🧪 Quickstart

1. **Clone + Install:**
   ```bash
   git clone https://github.com/your-username/pip-assistant.git
   cd pip-assistant/functions
   npm install
Set Firebase Config:

bash
Copy
Edit
firebase functions:config:set openai.key="sk-..." openai.assistant="asst_..."
Deploy to Firebase:

bash
Copy
Edit
firebase deploy --only functions
Open /public/index.html in a browser to use the UI.

✏️ Version History

Version	Date	Summary
1.0	2025-04-24	Initial stable thread-only release
⚠️ Notes
This version uses a single shared thread for all users.

Assistant has no memory, no soul seed, and no PXE tie-in (by design).

Intended for experimentation and reverse-engineering OpenAI's assistant behaviors.

🛠️ Future Ideas
Multi-thread management and switcher

System prompt injection at thread creation

Tool call support and introspection

Indexed message viewer or debug overlay

💡 Built with love for clarity, curiosity, and code.
— Pixie + TiBorg