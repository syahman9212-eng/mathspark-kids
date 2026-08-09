import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.STORAGE_KV_REST_API_URL,
  token: process.env.STORAGE_KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const premiumData = await redis.get(`premium:${uid}`);

    return res.status(200).json({
      premium: !!premiumData,
      data: premiumData || null,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to check premium status",
    });
  }
}
