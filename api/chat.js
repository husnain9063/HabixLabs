const MODEL = "gemini-3.6-flash";
const SYSTEM_PROMPT =
  "You are the AI assistant on Habix Labs' website, a technology and creative studio. Be helpful, concise, and friendly. You can answer general questions as well as ones about Habix Labs' services (web, AI systems, data engineering, DevOps, software, media).";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
    return;
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  const contents = messages.slice(-20).map((m) => ({
    role: m.role === "model" ? "model" : "user",
    parts: [{ text: String(m.text || "").slice(0, 8000) }],
  }));

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        }),
      },
    );

    const data = await upstream.json();

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: data.error?.message || "Gemini request failed" });
      return;
    }

    const reply = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
    res.status(200).json({ reply: reply || "I don't have a response for that." });
  } catch (err) {
    res.status(500).json({ error: "Upstream request failed" });
  }
}
