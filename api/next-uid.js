// api/next-uid.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for server-side

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/nextval`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sequence_name: 'uid_seq' })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get next UID');
    }

    const uid = await response.json();
    res.status(200).json({ uid: uid[0] }); // uid[0] is the next value
  } catch (err) {
    res.status(500).json({ error: 'Failed to increment UID', details: err.message });
  }
}