 // ─── Escape HTML for Safe Output ───────────────────────────
 import { escapeHTML } from './util.js';

 let activeThreadId = null;  // 🆕 Track active thread
 const DEFAULT_USER_ID = 'demo';  // 🆕 fallback uid


 document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('sendButton');
  if (sendButton) {
    sendButton.addEventListener('click', send);
  }

  loadThreads();  // 🆕 Load thread list at startup

});

async function loadThreads(userId = DEFAULT_USER_ID) {
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
      
        // 🆕 Add click event
        threadBlock.addEventListener('click', async () => {
          activeThreadId = threadId;
          highlightActiveThread(threadId); // optional: highlight visually
          console.log(`🧵 Active thread set to: ${threadId}`);

          await loadConversation(threadId); // 🆕 Load previous conversation
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
      // Messages come newest first, so reverse them
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

    const msg = input.value.trim();
    if (!msg) return;

    input.value = "";
    btn.disabled = true;

    convo.innerHTML += `<p><b>You:</b> ${escapeHTML(msg)}</p>`;

    try {

      const payload = { message: msg };
      if (activeThreadId) {
        payload.threadId = activeThreadId;  // 🆕 Include threadId if one is active
      }

      const res = await fetch("https://us-central1-pip-ai.cloudfunctions.net/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      convo.innerHTML += `<p><b>PiP:</b> ${escapeHTML(data.reply)}</p>`;

    } catch (err) {
      convo.innerHTML += `<p style="color:red;"><b>Error:</b> ${err.message}</p>`;
    }

    convo.scrollTop = convo.scrollHeight;
    btn.disabled = false;
  }