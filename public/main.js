 // ─── Escape HTML for Safe Output ───────────────────────────
 import { escapeHTML } from './util.js';


 document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('sendButton');
  if (sendButton) {
    sendButton.addEventListener('click', send);
  }
});


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
      const res = await fetch("https://us-central1-pip-ai.cloudfunctions.net/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      });

      const data = await res.json();
      convo.innerHTML += `<p><b>PiP:</b> ${escapeHTML(data.reply)}</p>`;
    } catch (err) {
      convo.innerHTML += `<p style="color:red;"><b>Error:</b> ${err.message}</p>`;
    }

    convo.scrollTop = convo.scrollHeight;
    btn.disabled = false;
  }