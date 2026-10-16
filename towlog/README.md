# TowLog — Tow driver's runsheet app

A phone web app (PWA, no server) for logging sub-contract tow calls. It uses the same fields as the paper
"Sub-Contract Tow Driver's Runsheet".

- **3 ways to fill it in:** typing, voice (a 🎤 on each field, plus a big 🎤 button for several fields at once), or a photo (read plate/VIN with OCR, scan the VIN barcode).
- **Account types:** Cash / Basic / Plus / Premium. Cash and Basic show a full-screen alarm with sound and vibration: *collect cash before towing*. The "Towing" step stays blocked until cash is marked as collected.
- **Steps:** En route → At vehicle → Towing → Dropped. Records the times and measures km with GPS.
- **Reason dropdown** with common breakdown and tow reasons.
- **Vehicle photos** saved on the phone (IndexedDB).
- **Pricing:** $50 base on every call + km to vehicle (5 km free for every account) + km towed
  (free km: Basic 10, Plus 200, Premium 300, Cash 0). Extra km: Plus/Premium $2.50, Basic/Cash $4.50. HST 13%. All of these can be changed in Settings.
- **Bi-weekly report:** a table with totals, Excel (CSV) export and Print/PDF. When a period ends, a reminder appears.
- **Backup:** export/import JSON (photos included).

Run it: open `towlog/index.html` from any HTTPS host (GitHub Pages, Netlify, Cloudflare Pages), then "Add to Home Screen".
The microphone, GPS and camera need HTTPS.
