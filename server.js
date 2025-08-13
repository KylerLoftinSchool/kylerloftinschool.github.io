import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

app.use(express.json());
app.use(cors({ origin: ALLOWED_ORIGIN === "*" ? "*" : ALLOWED_ORIGIN }));

app.get("/", (_req, res) => res.send("OK"));

app.post("/ask", async (req, res) => {
  try {
    const prompt = String(req.body.prompt || "");

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content ?? "";
    res.json({ text }); // keep response small & easy to use
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
