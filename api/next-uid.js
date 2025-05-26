export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' });
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const uidKey = 'latest_uid';

  try {
    const response = await fetch(`${url}/incr/${uidKey}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await response.json();
    const uid = parseInt(result.result, 10);

    res.status(200).json({ uid });
  } catch (err) {
    res.status(500).json({ error: 'Failed to increment UID', details: err.message });
  }
}
