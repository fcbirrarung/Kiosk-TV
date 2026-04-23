// Cloudflare Worker — lists R2 objects for a given TV folder and returns JSON.
// Deploy with: npx wrangler deploy

const MIME_MAP = {
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  gif:  'image/gif',
  webp: 'image/webp',
  mp4:  'video/mp4',
  webm: 'video/webm',
  mov:  'video/quicktime',
};

const PUBLIC_BASE = 'https://pub-3b4cb0842b5b40659332a432157addbe.r2.dev';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url  = new URL(request.url);
    // Expect: /playlist/1  /playlist/2  /playlist/3
    const match = url.pathname.match(/^\/playlist\/([123])$/);
    if (!match) {
      return new Response('Not found', { status: 404, headers: CORS });
    }

    const tv     = match[1];
    const prefix = `tv${tv}/`;

    const listed = await env.KIOSK_BUCKET.list({ prefix });

    const files = listed.objects
      .filter(obj => obj.size > 0)           // skip folder placeholder objects
      .map(obj => {
        const ext      = obj.key.split('.').pop().toLowerCase();
        const mimeType = MIME_MAP[ext] ?? 'application/octet-stream';
        return {
          name:     obj.key.replace(prefix, ''),
          url:      `${PUBLIC_BASE}/${obj.key.split('/').map(encodeURIComponent).join('/')}`,
          mimeType,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));  // alphabetical; prefix with 01_ to control order

    return new Response(JSON.stringify(files), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  },
};
