// config.js
const CONFIG = {
  WORKER_URL: 'https://kiosk-playlist.president-114.workers.dev',

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
