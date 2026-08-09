import { Redis } from "@upstash/redis";

const redis = new Redis({
url: process.env.KV_REST_API_URL,
token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paymentId, txid } = req.body;

  if (!paymentId || !txid) {
    return res.status(400).json({
      error: "Payment ID and transaction ID are required",
    });
  }

  try {
    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txid }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }
if (data.user_uid) {
  await redis.set(`premium:${data.user_uid}`, {
    premium: true,
    paymentId,
    txid,
    activatedAt: new Date().toISOString(),
  });
}
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to complete payment",
    });
  }
}
