// ─────────────────────────────────────────────────────────────
// 🧠 PiP Playground – v1.3.3-dev
// ─────────────────────────────────────────────────────────────
// 🚀 Assistant ID API + Firestore Integration
// 🧵 Dynamic Thread Creation + System Prompt Injection
// 🌟 Features:
//    • Auto-create and persist threads in Firestore
//    • Inject dynamic system prompts from /systemPrompts/{promptId}
//    • Post user messages and handle assistant replies (Polling flow)
//    • Full CORS-enabled access for frontend clients
// 📅 Last Updated: 2025-04-27
// 🔥 Project by TiBorg (BorgworX Labs)
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// 🔧 Imports & Configuration
// ─────────────────────────────────────────────────────────────
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

const OPENAI_API_KEY = functions.config().openai.key;
const ASSISTANT_ID = functions.config().openai.assistant;

const openAIHeaders = {
  Authorization: `Bearer ${OPENAI_API_KEY}`,
  "OpenAI-Beta": "assistants=v2",
};

// ─────────────────────────────────────────────────────────────
// 🚀 sendMessage Cloud Function
// ─────────────────────────────────────────────────────────────
exports.sendMessage = functions.https.onRequest(async (req, res) => {
  let threadId = null;

  // 🛡️ Validate Request Method and Body
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  try {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    const { message: userText, threadId: incomingThreadId, userId = 'demo' } = req.body;
    if (!userText) return res.status(400).send("Missing user message.");

    // 🧵 Determine or Create Thread
    if (incomingThreadId) {
      threadId = incomingThreadId;
      console.log("📥 Using provided thread:", threadId);
    } else if (!threadId) {
      const newThread = await axios.post(
        "https://api.openai.com/v1/threads",
        {},
        { headers: openAIHeaders }
      );
      threadId = newThread.data.id;
      console.log("🧵 Created new thread:", threadId);

      // 🔥 Save Thread Metadata to Firestore
      await db
        .collection('users')
        .doc(userId)
        .collection('threads')
        .doc(threadId)
        .set({
          threadId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      // 🧠 Inject Default System Prompt (Optional)
      try {
        const sysPromptDoc = await db.collection('systemPrompts').doc('default').get();
        const sysPromptData = sysPromptDoc.data();
      
        if (sysPromptData && sysPromptData.content) {
          await axios.post(
            `https://api.openai.com/v1/threads/${threadId}/messages`,
            {
              role: "system",
              content: sysPromptData.content
            },
            { headers: openAIHeaders }
          );
          console.log("🧠 Injected system prompt from Firestore.");
        } else {
          console.log("⚠️ No system prompt found, skipping injection.");
        }
      } catch (error) {
        console.error("⚡ Error injecting system prompt:", error.message);
      }
    }

    // ✉️ Post User Message to Thread
    await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      { role: "user", content: userText },
      { headers: openAIHeaders }
    );

    // 🤖 Start Assistant Run and Poll Status
    const run = await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/runs`,
      { assistant_id: ASSISTANT_ID },
      { headers: openAIHeaders }
    );

    let runStatus;
    do {
      await new Promise(r => setTimeout(r, 1000));
      const statusResp = await axios.get(
        `https://api.openai.com/v1/threads/${threadId}/runs/${run.data.id}`,
        { headers: openAIHeaders }
      );
      runStatus = statusResp.data.status;
    } while (runStatus !== "completed");

    // 📩 Fetch Assistant Final Reply
    const msgResp = await axios.get(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      { headers: openAIHeaders }
    );

    const reply =
      msgResp?.data?.data?.[0]?.content?.[0]?.text?.value || "No reply.";

    return res.status(200).json({ reply, threadId });

  } catch (err) {
    console.error("🔥 Error in sendMessage:", err?.response?.data || err.message || err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message || "Unknown error",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// 📩 getThreadMessages Cloud Function
// ─────────────────────────────────────────────────────────────

exports.getThreadMessages = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  try {
    const { threadId } = req.body;
    if (!threadId) return res.status(400).send("Missing threadId.");

    const response = await axios.get(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2"
      }
    });

    return res.status(200).json(response.data);

  } catch (err) {
    console.error("🔥 Error in getThreadMessages:", err?.response?.data || err.message || err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message || "Unknown error",
    });
  }
});
