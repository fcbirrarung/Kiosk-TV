FC BIRRARUNG KIOSK TV
====================
Digital signage system for 3 TVs. Media is stored in Cloudflare R2,
served via a Cloudflare Worker, and displayed via a web app hosted
on GitHub Pages.


ARCHITECTURE
------------
  GitHub Pages          - hosts kiosk.html, config.js, sw.js
  Cloudflare R2         - stores media files (images and videos)
  Cloudflare Worker     - lists R2 files and returns playlist as JSON
  Service Worker (sw.js)- caches media locally on the TV after first load

  TV URLs:
    https://fcbirrarung.github.io/Kiosk-TV/kiosk.html?tv=1
    https://fcbirrarung.github.io/Kiosk-TV/kiosk.html?tv=2
    https://fcbirrarung.github.io/Kiosk-TV/kiosk.html?tv=3


FILES
-----
  kiosk.html    Main app. Fetches playlist from Worker, displays slides.
  config.js     Configuration (Worker URL, orientations, timing).
  sw.js         Service Worker. Caches R2 media locally on the TV.
  worker.js     Cloudflare Worker source. Lists R2 bucket by TV folder.
  wrangler.toml Cloudflare Worker deployment config.


CONFIGURATION (config.js)
--------------------------
  WORKER_URL
    URL of the deployed Cloudflare Worker.
    Example: https://kiosk-playlist.president-114.workers.dev

  ORIENTATIONS
    Display orientation per TV: 'portrait' (9:16) or 'landscape' (16:9).
      1: 'portrait',
      2: 'portrait',
      3: 'landscape',

  IMAGE_DURATION_SEC
    How many seconds each image is shown. Default: 4.

  PLAYLIST_REFRESH_MS
    How often the app checks R2 for new content. Default: 300000 (5 min).


ADDING / UPDATING CONTENT
--------------------------
1. Log in to dash.cloudflare.com
2. Go to R2 -> kiosk-tv bucket
3. Upload files into the correct folder:
     tv1/   -> TV 1 (Canteen)
     tv2/   -> TV 2 (Canteen Outdoor)
     tv3/   -> TV 3 (Kit Room Outdoor)
4. Supported formats: JPG, PNG, GIF, WEBP, MP4, WEBM, MOV
5. To control playback order, prefix filenames with numbers:
     01_welcome.png
     02_sponsors.jpg
     03_fixture.png
6. The TVs will pick up changes within 5 minutes automatically.

To REMOVE content: delete the file from R2. It will be removed from
the playlist and the local cache on the next refresh cycle.


DEPLOYING THE WORKER
--------------------
Run this from the project folder whenever worker.js changes:

  npx wrangler deploy

Requires Node.js and wrangler to be installed. First run will prompt
for Cloudflare login.


SETTING UP A NEW TV
-------------------
1. Enable developer mode on the Google TV:
     Settings -> System -> About -> click "Android TV OS Build" 7 times

2. Enable unknown sources:
     Settings -> Privacy -> Security & Restrictions -> Unknown Sources
     Enable for the Downloader app.

3. Install Downloader by AFTVnews from the Play Store.

4. Use Downloader to install the kiosk browser app (android-web-kiosk):
     https://github.com/screenlite/android-web-kiosk/releases

5. Open the kiosk app and set the URL:
     TV 1: https://fcbirrarung.github.io/Kiosk-TV/kiosk.html?tv=1
     TV 2: https://fcbirrarung.github.io/Kiosk-TV/kiosk.html?tv=2
     TV 3: https://fcbirrarung.github.io/Kiosk-TV/kiosk.html?tv=3

6. Enable "Start URL on boot" in the kiosk app settings.


TROUBLESHOOTING
---------------
"SET WORKER_URL IN CONFIG.JS"
  The WORKER_URL in config.js is missing or has the placeholder value.
  Update config.js on GitHub with the correct Worker URL.

"NO MEDIA FOUND IN FOLDER"
  The R2 folder for that TV is empty, or the folder is not named
  correctly. Check that files are inside tv1/, tv2/, or tv3/.

"ERROR LOADING PLAYLIST. RETRYING..."
  The Worker is unreachable. Check it is deployed and the URL in
  config.js is correct. Test by opening:
    https://kiosk-playlist.president-114.workers.dev/playlist/1

Video does not play
  Autoplay may be blocked by the browser. The app will skip to the
  next slide automatically. Use a kiosk browser (android-web-kiosk
  or Fully Kiosk Browser) which allows autoplay.

Content not updating
  The app refreshes every 5 minutes. Wait 5 minutes after uploading
  to R2. If still not updating, check the Worker is returning the
  new file at /playlist/1.
