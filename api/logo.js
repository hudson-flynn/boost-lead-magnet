// Vercel serverless function — stores/retrieves logos in Upstash Redis
// Requires env vars: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
// Set these in Vercel dashboard → Project Settings → Environment Variables

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } = process.env;

  if (!url || !token) {
    return res.status(503).json({ error: "Logo storage not configured" });
  }

  const redis = async (cmd) => {
    const r = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(cmd),
    });
    return r.json();
  };

  if (req.method === "POST") {
    const { logo } = req.body || {};
    if (!logo) return res.status(400).json({ error: "No logo provided" });
    const id = Math.random().toString(36).slice(2, 8); // 6-char ID
    const setResult = await redis(["SET", `logo:${id}`, logo, "EX", 2592000]); // 30-day TTL
    if (setResult.error) return res.status(500).json({ error: "Redis SET failed", detail: setResult.error });
    if (setResult.result !== "OK") return res.status(500).json({ error: "Redis SET unexpected result", detail: setResult });
    return res.json({ id });
  }

  if (req.method === "GET") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "No id provided" });
    const data = await redis(["GET", `logo:${id}`]);
    return res.json({ logo: data.result || null });
  }

  res.status(405).end();
}
