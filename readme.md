🧠 PiP Assistant – Version 1.2
PiP (Pixie Interface Playground) is a lightweight experimental platform designed to explore OpenAI's Assistant API v2.
It serves as a minimalist, thread-aware chatbot sandbox with Firebase backend and a clean modular frontend.

Now upgraded with Google login, per-user thread management, and smarter frontend loading!

🚀 Features
🎯 OpenAI Assistant ID v2 integration

🔑 Google authentication (login/logout)

🌍 CORS-enabled Firebase Cloud Functions

📡 Firestore thread persistence (per user account)

🧵 Multi-thread selection and conversation loading

✨ Active thread highlighting for better navigation

✍️ Secure message-to-reply loop using axios + fetch

🔐 Secrets securely stored via firebase functions:config:set

💬 Modular vanilla HTML/JS frontend (index.html, main.js, util.js)

📦 Project Structure
cpp
Copy
Edit
/functions 
   ├── index.js          // Firebase Cloud Functions (sendMessage, getThreadMessages)
/public 
   ├── index.html        // Chat UI 
   ├── style.css         // UI Styling 
   ├── main.js           // Frontend logic 
   └── util.js           // HTML escaping utility

README.md   // This file 
CHANGELOG.md // Version tracking
🧪 Quickstart
Clone + Install:

bash
Copy
Edit
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
Use the UI:

Open /public/index.html in your browser.

Login with Google to manage your personal threads.

✏️ Version History

Version	Date	Summary
1.2	2025-04-26	Google login, per-user threads, active thread highlight, race condition fix
1.1	2025-04-26	Firestore thread management, multi-thread UI
1.0	2025-04-24	Initial stable thread-only release
⚠️ Notes
Assistant has no long-term memory, no soul seed, no PXE integration (by design).

Login is optional — "Demo" fallback mode works if no authentication.

Built primarily for experimentation, testing, and learning OpenAI Assistant behavior.

🛠️ Future Ideas
"New Thread" creation button

Thread deletion and renaming

System prompt injection at thread start

Voice TTS/STT support

Real-time Firestore syncing (onSnapshot)

💡 Built with love for clarity, curiosity, and code.
— Pixie + TiBorg 🚀