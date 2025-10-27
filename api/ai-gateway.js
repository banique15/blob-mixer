// Vercel AI Gateway - Proxy for OpenAI API
// This creates a gateway that routes AI requests through Vercel's infrastructure

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get OpenAI API key from environment variables
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    // Get the request body
    const body = req.body;
    
    // Determine the OpenAI endpoint based on the request
    let openaiEndpoint = 'https://api.openai.com/v1/chat/completions';
    
    // Handle different model prefixes (e.g., "openai/gpt-4" -> "gpt-4")
    if (body.model && body.model.startsWith('openai/')) {
      body.model = body.model.replace('openai/', '');
    }

    console.log(`🌐 AI Gateway: Proxying request to OpenAI for model: ${body.model}`);

    // Forward the request to OpenAI
    const openaiResponse = await fetch(openaiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
        'User-Agent': 'Vercel-AI-Gateway/1.0'
      },
      body: JSON.stringify(body)
    });

    // Get the response data
    const responseData = await openaiResponse.json();

    // Return the response with proper status code
    if (!openaiResponse.ok) {
      console.error('❌ OpenAI API error:', responseData);
      return res.status(openaiResponse.status).json(responseData);
    }

    console.log('✅ AI Gateway: Successfully proxied request to OpenAI');
    
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return res.status(200).json(responseData);

  } catch (error) {
    console.error('❌ AI Gateway error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}