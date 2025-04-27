// ─── Escape HTML for Safe Output ───────────────────────────
import { login, logout } from './firebaseAuth.js';
import { db, auth } from './firebaseInit.js';
import { escapeHTML } from './util.js';

import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

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

  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const profileInfo = document.getElementById("profileInfo");
  const profileName = document.getElementById("profileName");
  const profilePic = document.getElementById("profilePic");

  // Default state: hide profile, show login, hide logout
  if (profileInfo) profileInfo.style.display = 'none';
  if (loginBtn) loginBtn.style.display = 'inline-block';
  if (logoutBtn) logoutBtn.style.display = 'none';

  if (user) {
    currentUserUid = user.uid;
    console.log("👤 Logged in as:", user.displayName);

    if (profileName) profileName.textContent = user.displayName || "Logged In";
    if (profilePic) profilePic.src = user.photoURL || "";

    if (profileInfo) profileInfo.style.display = 'block';
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';

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
  threadListDiv.innerHTML = ""; // reset list each load

  try {
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/pip-ai/databases/(default)/documents/users/${userId}/threads`);
    const data = await res.json();

    if (data.documents && data.documents.length > 0) {
      data.documents.forEach(doc => {
        const threadId = doc.name.split('/').pop(); // extract threadId from path

        const threadBlock = document.createElement('div');
        threadBlock.style.display = "flex";
        threadBlock.style.alignItems = "center";
        threadBlock.style.justifyContent = "space-between";
        threadBlock.style.border = "1px solid #ccc";
        threadBlock.style.padding = "5px";
        threadBlock.style.margin = "5px 0";
        threadBlock.style.cursor = "pointer";
        threadBlock.dataset.threadId = threadId;


        // Span for thread name
        const threadNameSpan = document.createElement('span');
        const displayName = doc.fields?.displayName?.stringValue || threadId;
        threadNameSpan.textContent = displayName;

        threadNameSpan.style.flexGrow = "1";
        threadNameSpan.style.overflowWrap = "break-word";

        threadNameSpan.addEventListener('dblclick', async () => {
          const newName = prompt("Rename thread to:");
          if (newName) {
            console.log(`✏️ Rename thread ${threadId} to ${newName}`);
            // Firestore rename logic will go here later!
            await renameThread(userId, threadId, newName);




          }
        });

        threadNameSpan.addEventListener('click', async () => {
          activeThreadId = threadId;
          highlightActiveThread(threadId);
          console.log(`🧵 Active thread set to: ${threadId}`);
          await loadConversation(threadId);
        });

        // Trashcan button for delete
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "🗑️";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.addEventListener('click', async (e) => {
          e.stopPropagation(); // prevent selecting thread
          if (confirm(`Delete thread ${threadId}?`)) {
            console.log(`🗑️ Deleting thread ${threadId}`);
            // Firestore delete logic will go here later!
            await deleteThread(userId, threadId);

          }
        });

        threadBlock.appendChild(threadNameSpan);
        threadBlock.appendChild(deleteBtn);
        threadListDiv.appendChild(threadBlock);
      });
    } else {
      threadListDiv.innerHTML = "<p>No threads found.</p>";
    }
  } catch (err) {
    console.error("🔥 Error loading threads:", err);
    threadListDiv.innerHTML += `<p style="color:red;">Error loading threads</p>`;
  }
}

async function renameThread(userId, threadId, newName) {
  try {
    const threadDocRef = doc(db, `users/${userId}/threads/${threadId}`);
    await updateDoc(threadDocRef, {
      displayName: newName
    });
    console.log(`✅ Thread ${threadId} renamed to ${newName}`);
    loadThreads(currentUserUid || DEFAULT_USER_ID);
  } catch (error) {
    console.error("🔥 Error renaming thread:", error);
  }
}

async function deleteThread(userId, threadId) {
  try {
    const threadDocRef = doc(db, `users/${userId}/threads/${threadId}`);
    await deleteDoc(threadDocRef);
    console.log(`✅ Thread ${threadId} deleted`);
    loadThreads(currentUserUid || DEFAULT_USER_ID);
  } catch (error) {
    console.error("🔥 Error deleting thread:", error);
  }
}


function highlightActiveThread(selectedThreadId) {
  const threadListDiv = document.getElementById("threadList");
  const threadBlocks = threadListDiv.querySelectorAll('div');

  threadBlocks.forEach(block => {
    if (block.dataset.threadId === selectedThreadId) {
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
      let lastRole = null; // 🆕 Track last speaker

      messages.forEach(msg => {
        const messageBlock = document.createElement('div');
        messageBlock.style.display = 'flex';
        messageBlock.style.flexDirection = 'column';
        messageBlock.style.alignItems = msg.role === 'user' ? 'flex-end' : 'flex-start';
        messageBlock.style.marginTop = lastRole && lastRole !== msg.role ? '30px' : '10px'; // 🛠 Big gap when sender changes

        const messageDiv = document.createElement('div');
        messageDiv.className = msg.role === "user" ? "userMessage" : "assistantMessage";
        messageDiv.innerHTML = `<b>${msg.role === "user" ? "You" : "PiP"}:</b> ${escapeHTML(msg.content[0].text.value)}`;

        messageBlock.appendChild(messageDiv);
        convo.appendChild(messageBlock);

        lastRole = msg.role; // 🆕 Update lastRole
      });
    } else {
      const noHistoryDiv = document.createElement('div');
      noHistoryDiv.className = "assistantMessage";
      noHistoryDiv.innerHTML = "<i>No conversation history found.</i>";
      convo.appendChild(noHistoryDiv);
    }
  } catch (err) {
    console.error("🔥 Error loading conversation:", err);
    convo.innerHTML = `<p style="color:red;">Error loading conversation</p>`;
  }

  convo.scrollTo({ top: convo.scrollHeight, behavior: 'smooth' }); // 🛠 Smooth scroll to bottom
}




// ─── Handle Send Action ────────────────────────────────────
async function send() {
  const input = document.getElementById("userInput");
  const convo = document.getElementById("conversation");
  const btn = document.querySelector("button");
  const wasNewThread = !activeThreadId;

  const msg = input.value.trim();
  if (!msg) return;

  input.value = "";
  btn.disabled = true;

  // 🛠 INSERT your own message inside a block (aligned right)
  const userBlock = document.createElement('div');
  userBlock.style.display = 'flex';
  userBlock.style.flexDirection = 'column';
  userBlock.style.alignItems = 'flex-end';
  userBlock.style.marginTop = '30px'; // Always space above user's message

  const userMessageDiv = document.createElement('div');
  userMessageDiv.className = "userMessage";
  userMessageDiv.innerHTML = `<b>You:</b> ${escapeHTML(msg)}`;

  userBlock.appendChild(userMessageDiv);
  convo.appendChild(userBlock);

  convo.scrollTo({ top: convo.scrollHeight, behavior: 'smooth' });

  try {
    const payload = { message: msg };
    if (activeThreadId) {
      payload.threadId = activeThreadId;
    }
    if (currentUserUid) {
      payload.userId = currentUserUid;
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
      loadThreads(currentUserUid || DEFAULT_USER_ID);
    }

    const data = await res.json();

    // 🛠 INSERT PiP reply inside a block (aligned left)
    const assistantBlock = document.createElement('div');
    assistantBlock.style.display = 'flex';
    assistantBlock.style.flexDirection = 'column';
    assistantBlock.style.alignItems = 'flex-start';
    assistantBlock.style.marginTop = '30px'; // Space above PiP's reply

    const assistantMessageDiv = document.createElement('div');
    assistantMessageDiv.className = "assistantMessage";
    assistantMessageDiv.innerHTML = `<b>PiP:</b> ${escapeHTML(data.reply)}`;

    assistantBlock.appendChild(assistantMessageDiv);
    convo.appendChild(assistantBlock);

    convo.scrollTo({ top: convo.scrollHeight, behavior: 'smooth' });

  } catch (err) {
    convo.innerHTML += `<p style="color:red;"><b>Error:</b> ${err.message}</p>`;
  }

  btn.disabled = false;
}
