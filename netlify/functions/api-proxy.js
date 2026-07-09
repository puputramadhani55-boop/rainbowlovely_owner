const VERCEL_BASE = 'https://rainbow-lovely.vercel.app';

exports.handler = async (event) => {
  const originalUrl = new URL(event.rawUrl);
  const targetUrl = VERCEL_BASE + originalUrl.pathname + originalUrl.search;
 
  const headers = { 'Content-Type': 'application/json' };
  if (event.headers['x-admin-key']) {
    headers['x-admin-key'] = event.headers['x-admin-key'];
  }

  let body;
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
    body = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64').toString('utf-8')
      : event.body;
  }

  try {
    const proxyRes = await fetch(targetUrl, {
      method: event.httpMethod,
      headers,
      body,
    });
    const text = await proxyRes.text();
    return {
      statusCode: proxyRes.status,
      headers: { 'Content-Type': 'application/json' },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Proxy gagal: ' + err.message }),
    };
  }
};
  
