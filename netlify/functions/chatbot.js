// Netlify Function: chatbot.js
// Proxies chat requests to the Hugging Face Inference API.
// Set HF_API_TOKEN (server-side) and HF_MODEL in Netlify environment variables.

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const message = body.message || '';
    const model = process.env.HF_MODEL || 'gpt2';
    const token = process.env.HF_API_TOKEN;

    if (!token) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'HF_API_TOKEN not set on server' }),
      };
    }

    const resp = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: message, parameters: { max_new_tokens: 150 } }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: resp.status || 500, headers, body: JSON.stringify({ error: text }) };
    }

    const data = await resp.json();

    let reply = '';
    if (Array.isArray(data) && data[0] && typeof data[0].generated_text === 'string') {
      reply = data[0].generated_text;
    } else if (typeof data === 'string') {
      reply = data;
    } else if (data?.error) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: data.error }) };
    } else {
      // Fallback: stringify the response
      reply = JSON.stringify(data);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: String(err) }),
    };
  }
};
