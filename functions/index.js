// PiP Assistant v1.2.10 – Firestore Thread Save
// 🌟 Thread API with Firestore persistence
// ✅ Saves threadId + createdAt
// ✅ Uses Assistant ID API (v2)
// ✅ CORS enabled

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

  // ─── CORS Headers ──────────────────────────────────────────
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

    // ─── Determine Thread ────────────────────────────────────
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

      // 🔥 Save under users/{userId}/threads/{threadId}
      await db
        .collection('users')
        .doc(userId)
        .collection('threads')
        .doc(threadId)
        .set({
          threadId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }

    // ─── Post User Message ────────────────────────────────────
    await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      { role: "user", content: userText },
      { headers: openAIHeaders }
    );

    // ─── Run Assistant ────────────────────────────────────────
    const run = await axios.post(
      `https://api.openai.com/v1/threads/${threadId}/runs`,
      { assistant_id: ASSISTANT_ID },
      { headers: openAIHeaders }
    );

    // ─── Poll Until Complete ─────────────────────────────────
    let runStatus;
    do {
      await new Promise(r => setTimeout(r, 1000));
      const statusResp = await axios.get(
        `https://api.openai.com/v1/threads/${threadId}/runs/${run.data.id}`,
        { headers: openAIHeaders }
      );
      runStatus = statusResp.data.status;
    } while (runStatus !== "completed");

    // ─── Fetch Latest Assistant Reply ────────────────────────
    const msgResp = await axios.get(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      { headers: openAIHeaders }
    );

    const reply =
      msgResp?.data?.data?.[0]?.content?.[0]?.text?.value || "No reply.";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("🔥 Error in sendMessage:", err?.response?.data || err.message || err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message || "Unknown error",
    });
  }
});

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
