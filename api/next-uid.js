export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' });
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const uidKey = 'latest_uid';

  try {
    // Atomically increment UID
    const response = await fetch(`${url}/incr/${uidKey}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const uid = await response.text();

    res.status(200).json({ uid: parseInt(uid, 10) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to increment UID', details: err.message });
  }
}
