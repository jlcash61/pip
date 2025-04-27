# PiP Playground v1.2.10

🚀 **Welcome to PiP Playground** — a streamlined frontend + backend project for interacting with OpenAI's Assistant ID threads and managing conversations in a user-friendly interface.

---

## 🌟 Features

- **Thread Management**
  - Create new threads
  - Rename existing threads
  - Delete threads
  - View all threads dynamically after login

- **Dynamic UI**
  - Login with Google
  - Display user profile picture and name after login
  - Hide Login button when logged in, show Logout button
  - Fully functional "Demo" mode when logged out (using fallback "demo" user ID)

- **Responsive Layout**
  - Centered title with flexbox header
  - Profile information floats right
  - Threads panel on left, conversation/chat panel on right
  - Pinned footer at bottom — no scrolling overflow

- **Chat Experience**
  - Left-aligned assistant bubbles (gray)
  - Right-aligned user bubbles (blue)
  - Proper margin spacing on speaker change
  - Auto-scroll to latest message
  - Smooth conversation loading

- **Backend Firestore Integration**
  - Threads are saved under `users/{userId}/threads/{threadId}` in Firestore
  - CreatedAt timestamp saved on thread creation
  - Cloud Functions securely handle OpenAI API interactions

---

## 🔧 Project Structure

/public ├── index.html ├── style.css ├── main.js ├── firebaseInit.js ├── firebaseAuth.js └── util.js /functions ├── index.js (Cloud Functions backend: sendMessage, getThreadMessages)


---

## 🚀 Getting Started

1. Deploy `/public` to Firebase Hosting.
2. Deploy `/functions` as Firebase Cloud Functions.
3. Set your Firebase environment variables:
   ```bash
   firebase functions:config:set openai.key="YOUR_OPENAI_API_KEY" openai.assistant="YOUR_ASSISTANT_ID"
Done! Log in with Google and start chatting.

🛡️ Notes
Logging out immediately clears the conversation window and returns to demo threads.

All interactions secured through backend Cloud Functions — no client-side OpenAI API keys exposed.

If no login, system operates in "Demo Mode" using a shared thread list.

🛠️ Built with
OpenAI Assistants v2 API

Firebase Hosting

Firebase Authentication

Firebase Firestore

Firebase Functions (Node.js)

Vanilla JavaScript, HTML, and CSS

👤 Author
Created by Jeff Cash under the BorgworX brand 🚀
(Version 1.2.10 — Golden Master)

