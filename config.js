// config.js -- DO NOT COMMIT (listed in .gitignore)
const CONFIG = {
  // Cloudflare Worker URL (deployed via: npx wrangler deploy)
  WORKER_URL: 'https://kiosk-playlist.president-114.workers.dev',

  // Orientation per TV: 'portrait' (9:16) or 'landscape' (16:9)
  ORIENTATIONS: {
    1: 'portrait',
    2: 'portrait',
    3: 'landscape',
  },

  IMAGE_DURATION_SEC:  4,
  PLAYLIST_REFRESH_MS: 5 * 60 * 1000,

  IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/quicktime'],
};
