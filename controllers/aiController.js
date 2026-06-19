import axios from "axios";
import config from "../config/index.js";

export const suggestDesign = async (req, res, next) => {
  try {
    const { message, context = {} } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!config.GROQ_API_KEY) {
      return res
        .status(503)
        .json({ error: "AI service not configured. Add GROQ_API_KEY to .env and restart the server." });
    }

    const { carName, color, finish, parts, wheels } = context;

    const installedParts =
      parts && Object.keys(parts).length > 0
        ? Object.entries(parts)
            .filter(([, v]) => v)
            .map(([k]) => k)
            .join(", ")
        : "none";

    const wheelType =
      wheels && Object.values(wheels).some(Boolean) ? "aftermarket" : "stock";

    const systemPrompt = `You are an expert automotive customization advisor for BuildMyRide, a 3D car configurator. Keep every response to 2-3 sentences maximum.
Current build context:
- Car: ${carName || "Unknown model"}
- Paint color: ${color || "default"} (${finish || "glossy"} finish)
- Installed parts: ${installedParts}
- Wheels: ${wheelType}
Help the user with: color combinations, part compatibility, styling tips, and wheel selection for their specific build.`;

    const groqRes = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message.trim() },
        ],
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${config.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    const reply =
      groqRes.data.choices[0]?.message?.content ||
      "I couldn't generate a response. Please try again.";

    res.json({ reply });
  } catch (err) {
    if (err.response?.status === 401) {
      return res
        .status(500)
        .json({ error: "Invalid GROQ_API_KEY. Get a free key at console.groq.com." });
    }
    next(err);
  }
};
