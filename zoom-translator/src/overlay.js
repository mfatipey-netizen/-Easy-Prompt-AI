// Zoom Persian Subtitles — overlay renderer
// Loopback audio → Deepgram (STT) → Claude Haiku (translate) → RTL captions

const $ = (id) => document.getElementById(id);
const statusEl = $('status');
const lineEl = $('line');
const captionsEl = $('captions');

let cfg = null;
let running = false;
let ws = null;
let audioCtx = null;
let sourceNode = null;
let processorNode = null;
let mediaStream = null;
let clickThroughOn = false;

const HISTORY_MAX = 3;
const history = [];  // {text, id}
let interimLine = null;

const RTL_LANGS = new Set(['fa', 'ar', 'he', 'ur']);
function applyStyle() {
  document.documentElement.style.setProperty('--fs', (cfg.fontSize || 28) + 'px');
  document.documentElement.style.setProperty('--fg', cfg.textColor || '#ffffff');
  const bg = cfg.bgColor || '#000000';
  const op = (cfg.opacity == null ? 0.75 : cfg.opacity);
  const rgb = hexToRgb(bg);
  document.documentElement.style.setProperty('--bg', `rgba(${rgb.r},${rgb.g},${rgb.b},${op})`);
  const target = cfg.targetLang || 'fa';
  captionsEl.style.direction = RTL_LANGS.has(target) ? 'rtl' : 'ltr';
}
function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#000000');
  return m ? { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) } : { r:0, g:0, b:0 };
}

function setStatus(msg, color) {
  statusEl.textContent = msg;
  statusEl.style.color = color || '#ffd76a';
}

function renderCaptions() {
  captionsEl.innerHTML = '';
  for (const item of history) {
    const el = document.createElement('div');
    el.className = 'line';
    el.textContent = item.text;
    if (cfg.showOriginal && item.original) {
      const o = document.createElement('div');
      o.className = 'original';
      o.textContent = item.original;
      el.appendChild(o);
    }
    captionsEl.appendChild(el);
  }
  if (interimLine) {
    const el = document.createElement('div');
    el.className = 'line interim';
    el.textContent = interimLine;
    captionsEl.appendChild(el);
  }
  if (!history.length && !interimLine) {
    const el = document.createElement('div');
    el.className = 'line';
    el.textContent = running ? 'در حال گوش دادن…' : 'برای شروع کلید «شروع» را بزن.';
    captionsEl.appendChild(el);
  }
}

function pushFinal(text, original) {
  history.push({ text, original });
  while (history.length > HISTORY_MAX) history.shift();
  interimLine = null;
  renderCaptions();
}

function setInterim(text) {
  interimLine = text;
  renderCaptions();
}

// ─── Audio capture (Windows loopback via getDisplayMedia) ──────────────────
async function startCapture() {
  if (running) return;
  if (!cfg?.deepgramKey) { setStatus('کلید Deepgram در تنظیمات وارد نشده', '#ff8080'); return; }
  if (!cfg?.anthropicKey) { setStatus('کلید Anthropic در تنظیمات وارد نشده', '#ff8080'); return; }
  try {
    setStatus('در حال گرفتن صدای سیستم…');
    mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: { width: 1, height: 1, frameRate: 1 },
      audio: true,
    });
    // discard video
    mediaStream.getVideoTracks().forEach(t => t.stop());
    const audioTrack = mediaStream.getAudioTracks()[0];
    if (!audioTrack) throw new Error('هیچ ترک صوتی پیدا نشد. مطمئن شو گزینه Share audio روشن است.');

    audioCtx = new AudioContext({ sampleRate: 48000 });
    sourceNode = audioCtx.createMediaStreamSource(new MediaStream([audioTrack]));
    processorNode = audioCtx.createScriptProcessor(4096, 1, 1);
    sourceNode.connect(processorNode);
    processorNode.connect(audioCtx.destination); // required to run; we won't hear it (loopback)

    await openDeepgram();

    processorNode.onaudioprocess = (e) => {
      if (!ws || ws.readyState !== 1) return;
      const input = e.inputBuffer.getChannelData(0);
      const pcm16 = downsampleTo16kInt16(input, audioCtx.sampleRate);
      if (pcm16.byteLength) ws.send(pcm16);
    };

    running = true;
    $('mic').textContent = 'توقف';
    setStatus('در حال گوش دادن ✓', '#7dff9a');
    renderCaptions();
  } catch (err) {
    console.error(err);
    setStatus('خطا در ضبط: ' + err.message, '#ff8080');
    stopCapture();
  }
}

function stopCapture() {
  running = false;
  $('mic').textContent = 'شروع';
  try { processorNode && processorNode.disconnect(); } catch {}
  try { sourceNode && sourceNode.disconnect(); } catch {}
  try { audioCtx && audioCtx.close(); } catch {}
  try { mediaStream && mediaStream.getTracks().forEach(t => t.stop()); } catch {}
  try { ws && ws.close(); } catch {}
  audioCtx = sourceNode = processorNode = mediaStream = ws = null;
  setStatus('متوقف شد');
  renderCaptions();
}

function downsampleTo16kInt16(float32, srcRate) {
  const targetRate = 16000;
  if (srcRate === targetRate) return float32ToInt16(float32);
  const ratio = srcRate / targetRate;
  const outLen = Math.floor(float32.length / ratio);
  const out = new Float32Array(outLen);
  let idx = 0;
  for (let i = 0; i < outLen; i++) {
    const start = Math.floor(i * ratio);
    const end = Math.floor((i + 1) * ratio);
    let sum = 0, cnt = 0;
    for (let j = start; j < end && j < float32.length; j++) { sum += float32[j]; cnt++; }
    out[i] = cnt ? sum / cnt : 0;
  }
  return float32ToInt16(out);
}
function float32ToInt16(f32) {
  const buf = new ArrayBuffer(f32.length * 2);
  const view = new DataView(buf);
  for (let i = 0; i < f32.length; i++) {
    let s = Math.max(-1, Math.min(1, f32[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buf;
}

// ─── Deepgram streaming ─────────────────────────────────────────────────────
// Deepgram model selection per language
const NOVA3_LANGS = new Set(['en', 'es', 'multi']);
function pickModel(lang) { return NOVA3_LANGS.has(lang) ? 'nova-3' : 'nova-2'; }

async function openDeepgram() {
  const lang = cfg.sourceLang || 'en';
  const params = new URLSearchParams({
    model: pickModel(lang),
    language: lang,
    smart_format: 'true',
    interim_results: 'true',
    utterance_end_ms: '1000',
    vad_events: 'true',
    encoding: 'linear16',
    sample_rate: '16000',
    channels: '1',
  });
  const url = 'wss://api.deepgram.com/v1/listen?' + params.toString();
  ws = new WebSocket(url, ['token', cfg.deepgramKey]);
  await new Promise((resolve, reject) => {
    ws.onopen = () => resolve();
    ws.onerror = (e) => reject(new Error('اتصال Deepgram ناموفق'));
  });
  ws.onmessage = onDeepgramMsg;
  ws.onclose = () => { if (running) setStatus('اتصال Deepgram قطع شد', '#ff8080'); };

  // periodic keepalive
  setInterval(() => { if (ws && ws.readyState === 1) ws.send(JSON.stringify({ type: 'KeepAlive' })); }, 8000);
}

let currentUtterance = '';
function onDeepgramMsg(ev) {
  let msg;
  try { msg = JSON.parse(ev.data); } catch { return; }
  if (msg.type === 'Results') {
    const alt = msg.channel?.alternatives?.[0];
    if (!alt) return;
    const text = alt.transcript || '';
    if (!text.trim()) return;
    if (msg.is_final) {
      currentUtterance = (currentUtterance + ' ' + text).trim();
      if (msg.speech_final) {
        translateAndPush(currentUtterance);
        currentUtterance = '';
      } else {
        setInterim(currentUtterance);
      }
    } else {
      setInterim((currentUtterance + ' ' + text).trim());
    }
  } else if (msg.type === 'UtteranceEnd') {
    if (currentUtterance.trim()) {
      translateAndPush(currentUtterance);
      currentUtterance = '';
    }
  }
}

// ─── Claude Haiku translation ───────────────────────────────────────────────
const translateQueue = [];
let translating = false;
async function translateAndPush(english) {
  translateQueue.push(english);
  if (translating) return;
  translating = true;
  while (translateQueue.length) {
    const txt = translateQueue.shift();
    try {
      const persian = await callClaude(txt);
      pushFinal(persian, txt);
    } catch (e) {
      console.error(e);
      pushFinal('[خطای ترجمه] ' + txt, txt);
    }
  }
  translating = false;
}

const LANG_NAMES = {
  en: 'English', fa: 'Persian (Farsi)', zh: 'Chinese (Simplified)', ru: 'Russian',
  ar: 'Modern Standard Arabic', tr: 'Turkish', fr: 'French', it: 'Italian',
  de: 'German', es: 'Spanish', ja: 'Japanese', ko: 'Korean', pt: 'Portuguese',
  nl: 'Dutch', hi: 'Hindi',
};
function sourceName() { return LANG_NAMES[cfg.sourceLang] || 'the source language'; }
function targetName() { return LANG_NAMES[cfg.targetLang || 'fa'] || 'Persian (Farsi)'; }

async function callClaude(text) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': cfg.anthropicKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: `You are a live simultaneous interpreter. Translate the user's ${sourceName()} (a live meeting transcript fragment) into natural, conversational ${targetName()}. Output ONLY the ${targetName()} translation as a single line. Do not add explanations, quotes, transliteration, or source-language words. If the input is empty or non-speech, output an empty line.`,
      messages: [{ role: 'user', content: text }],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error('Claude ' + res.status + ': ' + t.slice(0, 200));
  }
  const data = await res.json();
  return (data.content?.[0]?.text || '').trim();
}

// ─── UI ─────────────────────────────────────────────────────────────────────
$('mic').onclick = () => running ? stopCapture() : startCapture();
$('less').onclick = () => { cfg.fontSize = Math.max(14, (cfg.fontSize || 28) - 2); applyStyle(); window.api.setConfig(cfg); };
$('more').onclick = () => { cfg.fontSize = Math.min(72, (cfg.fontSize || 28) + 2); applyStyle(); window.api.setConfig(cfg); };
// "قفل" now toggles autopilot off/on. Off = the on-bar is always interactive
// (useful while adjusting settings); on = smart hover behavior (default).
let autopilotOn = true;
$('through').textContent = 'قفل';
$('through').title = 'حالت هوشمند: خارج از نوار، کلیک‌ها به Zoom می‌رود';
$('through').onclick = () => {
  autopilotOn = !autopilotOn;
  window.api.setAutopilot(autopilotOn);
  if (!autopilotOn) window.api.setClickThrough(false); // keep bar grabbing clicks
  $('through').textContent = autopilotOn ? 'قفل' : 'باز';
  $('through').title = autopilotOn
    ? 'حالت هوشمند: خارج از نوار، کلیک‌ها به Zoom می‌رود'
    : 'نوار همیشه کلیک می‌گیرد (Zoom زیر آن غیرفعال است)';
};
$('settings').onclick = () => window.api.openSettings();
$('hide').onclick = () => window.api.hideOverlay();
$('quit').onclick = () => window.api.quit();

async function boot() {
  cfg = await window.api.getConfig();
  applyStyle();
  window.api.onConfigUpdated((newCfg) => { cfg = newCfg; applyStyle(); renderCaptions(); });
  renderCaptions();
  if (cfg.deepgramKey && cfg.anthropicKey) {
    setStatus('آماده — «شروع» را بزن');
  } else {
    setStatus('کلیدهای API را در تنظیمات وارد کن', '#ff8080');
  }
}
boot();

// ─── Autopilot click-through ────────────────────────────────────────────────
// Window is created with setIgnoreMouseEvents(true, {forward:true}), which
// makes clicks pass through to Zoom but still delivers mousemove events here.
// We flip the ignore flag off only while the cursor is over an interactive
// element (.hit). This gives Zoom the entire overlay area except the tiny
// on-bar and the caption pill itself.
let lastIgnore = true;
function updateIgnoreFromPoint(x, y) {
  if (!autopilotOn) return;
  const el = document.elementFromPoint(x, y);
  const overHit = !!(el && el.closest && el.closest('.hit'));
  const ignore = !overHit;
  if (ignore !== lastIgnore) {
    lastIgnore = ignore;
    window.api.setIgnore(ignore);
  }
}
window.addEventListener('mousemove', (e) => updateIgnoreFromPoint(e.clientX, e.clientY));
// When the cursor leaves the window entirely, snap back to click-through.
window.addEventListener('mouseleave', () => {
  if (autopilotOn && !lastIgnore) { lastIgnore = true; window.api.setIgnore(true); }
});
