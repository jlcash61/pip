// PiP Assistant v1.0 – Initial Thread API Integration
// PiP Assistant v1.0
// 🌟 Stable thread-only playground
// ✅ Uses Assistant ID API with v2 header
// ✅ CORS enabled, minimal user context

// ─────────────────────────────────────────────────────────────
// 🔧 Imports & Configuration
// ─────────────────────────────────────────────────────────────
const functions = require("firebase-functions");
const axios = require("axios");

const OPENAI_API_KEY = functions.config().openai.key;
const ASSISTANT_ID = functions.config().openai.assistant;
let threadId = null;

const openAIHeaders = {
  Authorization: `Bearer ${OPENAI_API_KEY}`,
  "OpenAI-Beta": "assistants=v2"
};

// ─────────────────────────────────────────────────────────────
// 🚀 sendMessage Cloud Function
// ─────────────────────────────────────────────────────────────
exports.sendMessage = functions.https.onRequest(async (req, res) => {
  // ─── CORS Headers ──────────────────────────────────────────
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  try {
    // ─── Validate Request ─────────────────────────────────────
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    const userText = req.body.message;
    if (!userText) return res.status(400).send("Missing user message.");

    // ─── Create Thread if Not Exists ──────────────────────────
    if (!threadId) {
      const newThread = await axios.post(
        "https://api.openai.com/v1/threads",
        {},
        { headers: openAIHeaders }
      );
      threadId = newThread.data.id;
      console.log("🧵 Thread created:", threadId);
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
      msgResp?.data?.data?.[0]?.content?.[0]?.text?.value || "No reply returned.";
    
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("🔥 sendMessage error:", err?.response?.data || err.message || err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message || "Unknown"
    });
  }
});
