const VERCEL_BASE = 'https://rainbowlovely-owner.vercel.app';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      const targetUrl = VERCEL_BASE + url.pathname + url.search;
      const headers = { 'Content-Type': 'application/json' };
      const adminKey = request.headers.get('x-admin-key');
      if (adminKey) headers['x-admin-key'] = adminKey;

      const proxyRes = await fetch(targetUrl, {
        method: request.method,
        headers,
        body: request.method !== 'GET' && request.method !== 'OPTIONS' ? await request.text() : undefined
      });
      const body = await proxyRes.text();
      return new Response(body, {
        status: proxyRes.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return env.ASSETS.fetch(request);
  }
};
