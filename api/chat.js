export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, context } = req.body || {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      reply: `Please message ${context?.developer || "Shaurabh"} directly on WhatsApp (${context?.phone || "+91 83768 91847"}) for quick help.`
    });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.4,
        max_tokens: 220,
        messages: [
          {
            role: "system",
            content: `You are the helpful website assistant for ${context?.developer || "Shaurabh Kumar"}. Keep answers short, clear, and polite. Use this data: ${JSON.stringify(context || {})}. If the user wants a quote or booking, encourage chatting on WhatsApp.`
          },
          { role: "user", content: message.slice(0, 600) }
        ]
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(200).json({ reply: "" });
  }
}
