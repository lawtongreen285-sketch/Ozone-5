import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8787;
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || true }));
app.use(express.json({ limit: "1mb" }));

async function searchWeb(query) {
  if (!process.env.BRAVE_SEARCH_API_KEY) return [];
  const url = new URL("https://api.search.brave.com/res/v1/web/search");
  url.searchParams.set("q", query);
  url.searchParams.set("count", "6");
  const response = await fetch(url, { headers: { "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY, "Accept": "application/json" } });
  if (!response.ok) throw new Error(`Search provider returned ${response.status}`);
  const data = await response.json();
  return (data.web?.results || []).slice(0, 6).map(item => ({
    title: item.title, url: item.url, description: item.description || ""
  }));
}

async function generateAnswer(question, sources) {
  if (!process.env.OPENAI_API_KEY) return {
    answer: "OZONE 5 is ready to research this question, but its AI provider has not been connected yet. Add an AI API key to the server environment to enable generated answers. When web research is enabled, the sources found for your question will appear below.",
    demo: true
  };
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const context = sources.length ? sources.map((s, i) => `[${i+1}] ${s.title}\n${s.url}\n${s.description}`).join("\n\n") : "No external sources were retrieved.";
  const response = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: "You are OZONE 5, a careful research and assistance AI. Answer clearly and directly. Use supplied web sources when relevant, cite them inline as [1], [2], etc. Never claim a source proves something it does not. State uncertainty and conflicting evidence. If sources are absent, do not pretend you searched the web." },
        { role: "user", content: `Question: ${question}\n\nRetrieved web sources:\n${context}\n\nGive a useful, well-structured response. Distinguish sourced facts from your analysis.` }
      ]
    })
  });
  if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
  const data = await response.json();
  return { answer: data.choices?.[0]?.message?.content || "No answer was returned.", demo: false };
}

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "OZONE 5 API", searchConfigured: Boolean(process.env.BRAVE_SEARCH_API_KEY), aiConfigured: Boolean(process.env.OPENAI_API_KEY) }));

app.post("/api/ask", async (req, res) => {
  try {
    const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
    const research = req.body?.research !== false;
    if (!question) return res.status(400).json({ error: "Please enter a question." });
    if (question.length > 6000) return res.status(400).json({ error: "Please keep questions under 6,000 characters." });
    const sources = research ? await searchWeb(question) : [];
    const result = await generateAnswer(question, sources);
    res.json({ ...result, sources, researched: research && Boolean(process.env.BRAVE_SEARCH_API_KEY) });
  } catch (error) {
    console.error("OZONE request failed:", error.message);
    res.status(502).json({ error: "OZONE 5 could not complete this request. Check the server configuration and try again." });
  }
});

if (process.env.NODE_ENV === "production") {
  const path = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const root = path.dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.resolve(root, "../dist")));
  app.get("*", (_req, res) => res.sendFile(path.resolve(root, "../dist/index.html")));
}
app.listen(port, () => console.log(`OZONE 5 API listening on port ${port}`));