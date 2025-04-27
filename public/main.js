// ─── Escape HTML for Safe Output ───────────────────────────
import { login, logout } from './firebaseAuth.js';
import { db, auth } from './firebaseInit.js'; // 🛠 moved auth to same import
import { escapeHTML } from './util.js'; // already had this

import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'; // 🛠 absolute import needed

let currentUserUid = null; // 🆕 Track who is logged in
let activeThreadId = null; // 🆕 Track active thread
const DEFAULT_USER_ID = 'demo'; // 🆕 fallback uid

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  if (loginBtn) loginBtn.addEventListener('click', login);
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  const sendButton = document.getElementById('sendButton');
  if (sendButton) {
    sendButton.addEventListener('click', send);
  }

  const newThreadBtn = document.getElementById('newThreadBtn');
if (newThreadBtn) {
  newThreadBtn.addEventListener('click', startNewThread);
}


  // 🛠 Moved loadThreads to only happen after auth ready
});

// ─── Monitor Auth State ─────────────────────────────────────
onAuthStateChanged(auth, (user) => {
  // Clear active thread and conversation when auth state changes
  activeThreadId = null;
  const convo = document.getElementById("conversation");
  if (convo) convo.innerHTML = "";

  if (user) {
    currentUserUid = user.uid;
    console.log("👤 Logged in as:", user.displayName);
    loadThreads(currentUserUid);
  } else {
    currentUserUid = null;
    console.log("👥 Logged out");
    loadThreads(DEFAULT_USER_ID);
  }
});

async function loadThreads(userId) {
  userId = userId || DEFAULT_USER_ID; // fallback if missing

  const threadListDiv = document.getElementById("threadList");
  threadListDiv.innerHTML = "<h3>My Threads</h3>"; // reset list each load

  try {
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/pip-ai/databases/(default)/documents/users/${userId}/threads`);
    const data = await res.json();

    if (data.documents && data.documents.length > 0) {
      data.documents.forEach(doc => {
        const threadId = doc.name.split('/').pop(); // extract threadId from path
        const threadBlock = document.createElement('div');

        threadBlock.textContent = threadId;
        threadBlock.style.border = "1px solid #ccc";
        threadBlock.style.padding = "5px";
        threadBlock.style.margin = "5px 0";
        threadBlock.style.cursor = "pointer"; // 🆕 Show pointer on hover

        threadBlock.addEventListener('click', async () => {
          activeThreadId = threadId;
          highlightActiveThread(threadId);
          console.log(`🧵 Active thread set to: ${threadId}`);
          await loadConversation(threadId);
        });

        threadListDiv.appendChild(threadBlock);
      });
    } else {
      threadListDiv.innerHTML += "<p>No threads found.</p>";
    }
  } catch (err) {
    console.error("🔥 Error loading threads:", err);
    threadListDiv.innerHTML += `<p style="color:red;">Error loading threads</p>`;
  }
}

function highlightActiveThread(selectedThreadId) {
  const threadListDiv = document.getElementById("threadList");
  const threadBlocks = threadListDiv.querySelectorAll('div');

  threadBlocks.forEach(block => {
    if (block.textContent === selectedThreadId) {
      block.style.backgroundColor = "#e0f7fa"; // light blue
    } else {
      block.style.backgroundColor = "transparent";
    }
  });
}

function startNewThread() {
  console.log("➕ New Thread Button Clicked");
  activeThreadId = null;

  const convo = document.getElementById("conversation");
  if (convo) convo.innerHTML = "";

  // Optional: Scroll conversation to top
  convo.scrollTop = 0;
}


async function loadConversation(threadId) {
  const convo = document.getElementById("conversation");
  convo.innerHTML = ""; // Clear current convo

  try {
    const res = await fetch("https://us-central1-pip-ai.cloudfunctions.net/getThreadMessages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId })
    });

    const data = await res.json();

    if (data.data && data.data.length > 0) {
      const messages = data.data.reverse();
      messages.forEach(msg => {
        if (msg.role === "user") {
          convo.innerHTML += `<p><b>You:</b> ${escapeHTML(msg.content[0].text.value)}</p>`;
        } else if (msg.role === "assistant") {
          convo.innerHTML += `<p><b>PiP:</b> ${escapeHTML(msg.content[0].text.value)}</p>`;
        }
      });
    } else {
      convo.innerHTML = "<p>No conversation history found.</p>";
    }

  } catch (err) {
    console.error("🔥 Error loading conversation:", err);
    convo.innerHTML = `<p style="color:red;">Error loading conversation</p>`;
  }

  convo.scrollTop = convo.scrollHeight;
}

// ─── Handle Send Action ────────────────────────────────────
async function send() {
  const input = document.getElementById("userInput");
  const convo = document.getElementById("conversation");
  const btn = document.querySelector("button");
  const wasNewThread = !activeThreadId; // 🆕 was there no active thread before send?


  const msg = input.value.trim();
  if (!msg) return;

  input.value = "";
  btn.disabled = true;

  convo.innerHTML += `<p><b>You:</b> ${escapeHTML(msg)}</p>`;

  try {
    const payload = { message: msg };
    if (activeThreadId) {
      payload.threadId = activeThreadId;
    }
    if (currentUserUid) {
      payload.userId = currentUserUid; // 🆕 Add userId if logged in
    }

    console.log("📤 Preparing to send message:");
    console.log("- currentUserUid:", currentUserUid);
    console.log("- activeThreadId:", activeThreadId);



    const res = await fetch("https://us-central1-pip-ai.cloudfunctions.net/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (wasNewThread) {
      // Refresh thread list to show newly created thread
      loadThreads(currentUserUid || DEFAULT_USER_ID);
    }
    

    const data = await res.json();
    convo.innerHTML += `<p><b>PiP:</b> ${escapeHTML(data.reply)}</p>`;

  } catch (err) {
    convo.innerHTML += `<p style="color:red;"><b>Error:</b> ${err.message}</p>`;
  }

  convo.scrollTop = convo.scrollHeight;
  btn.disabled = false;
}
