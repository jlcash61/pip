PiP Playground – v1.3.0-dev
Welcome to PiP Playground, your testbed for assistant-powered conversations powered by OpenAI's Assistant ID API and Firestore integration.

🌟 What's New in v1.3.0
🔵 System Prompt Injection — New threads automatically inject a system message from Firestore (/systemPrompts/default).

🔵 Firestore Dynamic Prompts — System prompts are now editable and manageable via Firestore.

🔵 Hardened Backend — Safer thread creation flow with robust error handling.

🔵 Future-Ready — Structure prepared for upcoming Settings menu (gear icon) to allow selectable system prompts.

✅ Smooth performance, no frontend changes needed for this upgrade.

🛠 Architecture Overview
Frontend
index.html — Main page structure

style.css — Layout and visual polish

main.js — Authentication, thread management, conversation flow

util.js — Escape HTML safely

Backend
index.js —

sendMessage Cloud Function: creates or continues threads, injects system prompt on new threads, posts user messages, polls and returns assistant reply.

getThreadMessages Cloud Function: retrieves thread conversation history.

Firebase
Authentication — Google OAuth2 (sign-in/out)

Firestore —

/users/{uid}/threads/{threadId} — Thread metadata

/systemPrompts/{promptId} — System prompts for injection

🚀 Getting Started
1. Deploy Cloud Functions
Deploy index.js using Firebase CLI:

bash
Copy
Edit
firebase deploy --only functions
2. Set Up Firestore
Manually create a collection:


Collection	Document ID	Field	Type	Value
systemPrompts	default	content	string	"You are PiP, a friendly assistant created by BorgworX. Stay helpful, concise, and a little witty!"
3. Run Locally or Host
Open index.html directly in the browser

Or deploy it to your favorite hosting service (Firebase Hosting recommended)

🎯 Future Development Roadmap
🛠 Add Gear Settings Menu (choose system prompts)

🛠 Add optional STT (Speech-to-Text) or TTS (Text-to-Speech)

🛠 Continue visual and UX polish

🛠 Allow multiple predefined prompt modes (Casual Mode, Dev Mode, etc.)

🧠 Special Thanks
Developed by Jeff (TiBorg, BorgworX Labs)
Brought to life with the help of PiP (Project in Progress) 💬✨

✨ Version

Version	Status	Release Date
v1.3.0-dev	In Progress	2025-04-27
📬 Contact
For questions, feedback, or collaboration ideas, reach out through your project channels! 🚀

🎯 BorgworX - Smarter Systems for a Smarter Tomorrow