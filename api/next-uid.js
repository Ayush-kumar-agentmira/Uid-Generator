export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/next_uid`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
      // No body needed
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to get next UID');
    }

    const uid = await response.json();
    res.status(200).json({ uid }); // uid will be a number
  } catch (err) {
    res.status(500).json({ error: 'Failed to increment UID', details: err.message });
  }
}